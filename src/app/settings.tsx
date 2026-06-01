import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { requestPermission } from "../services/notifications";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "ta", label: "Tamil" },
  { code: "ml", label: "Malayalam" },
  { code: "kn", label: "Kannada" },
  { code: "bn", label: "Bengali" },
  { code: "mr", label: "Marathi" },
];

export default function SettingsScreen() {
  const { settings, currentColors: colors, setTheme, setLanguage } = useSettings();
  const [permGranted, setPermGranted] = useState(false);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="mb-3">
        <View className="flex-row items-center gap-3 mx-4 mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Settings</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      >
        {/* ===== APPEARANCE ===== */}
        <Text className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: colors.textDim }}>
          Appearance
        </Text>
        <View
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setTheme(settings.theme === "dark" ? "light" : "dark")}
            className="flex-row items-center px-4"
            style={{ height: 56 }}
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons
                name={settings.theme === "dark" ? "moon" : "sunny"}
                size={18}
                color={colors.text}
              />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-medium">Dark Mode</Text>
            </View>
            <View
              className="w-11 h-6 rounded-full items-center justify-center"
              style={{
                backgroundColor: settings.theme === "dark" ? colors.accent : colors.border,
              }}
            >
              <View
                className="w-4 h-4 rounded-full bg-white"
                style={{
                  alignSelf: settings.theme === "dark" ? "flex-end" : "flex-start",
                  marginHorizontal: 2,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* ===== NOTIFICATIONS ===== */}
        <Text className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: colors.textDim }}>
          Notifications
        </Text>
        <View
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={async () => {
              const ok = await requestPermission();
              setPermGranted(ok);
              Alert.alert(
                ok ? "Permission Granted" : "Permission Denied",
                ok
                  ? "You will now receive reminders for upcoming movies."
                  : "Enable notifications in your device settings to get movie reminders."
              );
            }}
            className="flex-row items-center px-4"
            style={{ height: 56 }}
          >
            <View
              className="w-9 h-9 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons name="notifications" size={18} color={colors.text} />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-medium">Movie Reminders</Text>
              <Text className="text-xs" style={{ color: colors.textDim }}>
                Get notified when upcoming movies release
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textVeryDim} />
          </TouchableOpacity>
        </View>

        {/* ===== LANGUAGE ===== */}
        <Text className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: colors.textDim }}>
          Movie Languages
        </Text>
        <View
          className="rounded-2xl overflow-hidden mb-8"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          {LANGUAGES.map((lang, i) => {
            const active = settings.language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                activeOpacity={0.6}
                onPress={() => setLanguage(lang.code)}
                className="flex-row items-center px-4"
                style={{
                  height: 50,
                  borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <Text className="flex-1 text-sm" style={{ color: active ? colors.accent : colors.textMuted }}>
                  {lang.label}
                </Text>
                {active && <Ionicons name="checkmark" size={18} color={colors.accent} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ===== INFO ===== */}
        <Text className="text-xs text-center" style={{ color: colors.textVeryDim }}>
          Language preference affects recommended content
        </Text>
      </ScrollView>
    </View>
  );
}
