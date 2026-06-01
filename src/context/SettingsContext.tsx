import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { colors } from "../constants/colors";
import { colorsLight } from "../constants/colorsLight";

const STORAGE_KEY = "cineverse_settings";

type Theme = "dark" | "light";

type Settings = {
  theme: Theme;
  language: string;
};

type SettingsContextType = {
  settings: Settings;
  currentColors: typeof colors;
  setTheme: (t: Theme) => void;
  setLanguage: (lang: string) => void;
};

const defaultSettings: Settings = {
  theme: "dark",
  language: "en",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  currentColors: colors,
  setTheme: () => {},
  setLanguage: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setSettings({ ...defaultSettings, ...JSON.parse(data) });
    });
  }, []);

  const persist = useCallback(async (next: Settings) => {
    setSettings(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setTheme = useCallback(
    (theme: Theme) => persist({ ...settings, theme }),
    [settings, persist]
  );

  const setLanguage = useCallback(
    (language: string) => persist({ ...settings, language }),
    [settings, persist]
  );

  const currentColors = settings.theme === "light" ? colorsLight : colors;

  return (
    <SettingsContext.Provider value={{ settings, currentColors, setTheme, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
