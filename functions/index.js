// /firebase/functions/index.js

// 1. Import necessary libraries
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

// 2. Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// 3. Configure Twilio securely
// It reads the secure keys set by the 'firebase functions:config:set' command
const twilioConfig = functions.config().twilio;
const client = new twilio(twilioConfig.sid, twilioConfig.token);

/**
 * 🚨 CRITICAL: HTTP Callable Function to initiate the SOS alert.
 * This is triggered by the mobile app's 'alertService.js'.
 * * @param {object} data - Contains the payload sent from the mobile app.
 * @param {object} context - Contains authentication info about the user making the call.
 */
exports.initiateSOS = functions.https.onCall(async (data, context) => {
  // --- A. Security and Validation Checks ---

  // Check if the user is authenticated (most important security check)
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called by an authenticated user."
    );
  }

  const { userId, triggerMethod, initialLocation, contacts } = data;
  const authenticatedUid = context.auth.uid;

  // Check if the user ID in the payload matches the authenticated user ID
  if (userId !== authenticatedUid) {
    throw new new functions.https.HttpsError(
      "permission-denied",
      "User ID mismatch. Cannot trigger an alert for another user."
    )();
  }

  // Basic input validation
  if (!contacts || contacts.length === 0) {
    console.warn(`Alert triggered by ${userId} but no contacts were provided.`);
    throw new functions.https.HttpsError(
      "invalid-argument",
      "No emergency contacts found to notify."
    );
  }

  // --- B. Create Firestore Alert Document ---

  const newAlertRef = db.collection("alerts").doc();
  const alertId = newAlertRef.id;

  // Create the alert record
  const alertData = {
    alertId: alertId,
    userId: userId,
    status: "active",
    triggerMethod: triggerMethod, // 'duress_pin' or 'normal_sos'
    createdAt: admin.firestore.Timestamp.now(),
    // Store the initial GPS location (this is updated by the locationService later)
    initialLocation: new admin.firestore.GeoPoint(
      initialLocation.lat,
      initialLocation.lng
    ),
    currentLocation: new admin.firestore.GeoPoint(
      initialLocation.lat,
      initialLocation.lng
    ),
    emergencyContacts: contacts.map((c) => c.phoneNumber),
  };

  await newAlertRef.set(alertData);
  console.log(
    `Alert ${alertId} created for User ${userId}. Trigger: ${triggerMethod}`
  );

  // --- C. Send SMS Notifications using Twilio ---

  const alertLink = `https://your-domain.com/track/${alertId}`; // IMPORTANT: Link to the web view showing the map

  const smsPromises = contacts.map((contact) => {
    // Customize the message based on the trigger method
    const messageBody =
      triggerMethod === "duress_pin"
        ? `⚠️ Duress Alert: Emergency! ${contact.name} needs IMMEDIATE assistance. Track live location here: ${alertLink}`
        : `🚨 SOS Alert: ${contact.name} has manually triggered an emergency alarm. Track live location here: ${alertLink}`;

    return client.messages
      .create({
        body: messageBody,
        to: contact.phoneNumber,
        from: twilioConfig.phone,
      })
      .catch((error) => {
        console.error(
          `Failed to send SMS to ${contact.phoneNumber}:`,
          error.message
        );
      });
  });

  // Wait for all messages to attempt sending
  await Promise.all(smsPromises);

  // --- D. Return Success to Mobile App ---
  return {
    success: true,
    message: "Alert initiated and contacts notified.",
    alertId: alertId,
  };
});
