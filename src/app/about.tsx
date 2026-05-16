import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const features = [
  { icon: "trending-up", label: "Trending Movies" },
  { icon: "calendar", label: "Upcoming Releases" },
  { icon: "search", label: "Search & Filter" },
  { icon: "bookmark", label: "Save Favorites" },
];

export default function AboutScreen() {
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="mb-3">
        <View className="flex-row items-center gap-3 mx-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">About</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== APP ICON ===== */}
        <View
          className="w-24 h-24 rounded-2xl items-center justify-center mb-4"
          style={{ backgroundColor: colors.accent + "20" }}
        >
          <Ionicons name="film" size={48} color={colors.accent} />
        </View>
        <Text className="text-white text-3xl font-extrabold">
          <Text style={{ color: colors.accent }}>Cine</Text>Verse
        </Text>
        <Text
          className="text-xs font-medium mt-1"
          style={{ color: colors.textDim }}
        >
          Version 1.0.0
        </Text>

        {/* ===== DESCRIPTION ===== */}
        <View
          className="w-full rounded-2xl p-5 mt-6"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <Text
            className="text-sm leading-7 text-center"
            style={{ color: colors.textMuted }}
          >
            CineVerse is your ultimate destination for discovering films. Browse
            trending titles, stay updated with upcoming releases, and find your
            next favorite movie with ease.
          </Text>
        </View>

        {/* ===== FEATURES ===== */}
        <View className="w-full mt-6">
          <Text
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: colors.textDim }}
          >
            Features
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {features.map((f) => (
              <View
                key={f.label}
                className="flex-row items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  width: "48%",
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                }}
              >
                <Ionicons
                  name={f.icon as any}
                  size={18}
                  color={colors.accent}
                />
                <Text className="text-white text-xs font-medium">
                  {f.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ===== DEVELOPER ===== */}
        <View className="w-full mt-8 items-center">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-3"
            style={{ backgroundColor: colors.accent + "15" }}
          >
            <Ionicons name="code-slash" size={28} color={colors.accent} />
          </View>
          <Text className="text-white text-lg font-bold">
            Developed by Alan
          </Text>
          <Text className="text-xs -mt-0.5" style={{ color: colors.textDim }}>
            - 19
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
