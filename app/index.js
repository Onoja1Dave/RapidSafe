import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

export default function AppRoot() {
  const { user, isLoading } = useAuth();
  const { settings, isSettingsLoading } = useSettings();

  if (isLoading || isSettingsLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!settings?.isPinSet) {
    return <Redirect href="/setup-pins" />;
  }

  return <Redirect href="/pin-check" />;
}
