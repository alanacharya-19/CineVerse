import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import { FavoritesProvider } from "../context/FavoritesContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";

function AppContent() {
  const { currentColors } = useSettings();
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: currentColors.background }}>
      <FavoritesProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: currentColors.background },
            animation: "fade",
          }}
        />
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
