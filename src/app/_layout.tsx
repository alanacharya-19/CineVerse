import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import { colors } from "../constants/colors";
import { FavoritesProvider } from "../context/FavoritesContext";
import { SettingsProvider, useSettings } from "../context/SettingsContext";

function RootStack() {
  const { currentColors } = useSettings();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: currentColors.background },
        animation: "fade",
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <SettingsProvider>
        <FavoritesProvider>
          <RootStack />
        </FavoritesProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
