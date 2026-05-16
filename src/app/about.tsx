import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

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

      <View className="flex-1 items-center justify-center px-8" style={{ marginTop: -60 }}>
        {/* ===== APP ICON WITH GLOW ===== */}
        <View className="items-center mb-5">
          <View className="mb-4" style={{ borderRadius: 20, width: 96, height: 96, overflow: "hidden" }}>
            <Image
              source={require("../../assets/logo/appLogo.png")}
              style={{ width: 96, height: 96 }}
              resizeMode="cover"
            />
          </View>
          <Text className="text-white text-3xl font-extrabold tracking-tight">
            <Text style={{ color: colors.accent }}>Cine</Text>Verse
          </Text>
          <Text className="text-xs mt-1" style={{ color: colors.textVeryDim }}>
            Version 1.0.0
          </Text>
        </View>

        {/* ===== TAGLINE ===== */}
        <Text className="text-sm text-center leading-6 mb-8" style={{ color: colors.textMuted }}>
          Discover movies from every language, every genre, everywhere.
        </Text>

        {/* ===== QUICK STATS ===== */}
        <View
          className="w-full rounded-2xl px-5 py-4 mb-8 flex-row justify-around"
          style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
        >
          <View className="items-center">
            <Text className="text-white text-lg font-extrabold">10K+</Text>
            <Text className="text-[10px]" style={{ color: colors.textVeryDim }}>Movies</Text>
          </View>
          <View className="w-px" style={{ backgroundColor: colors.border }} />
          <View className="items-center">
            <Text className="text-white text-lg font-extrabold">8</Text>
            <Text className="text-[10px]" style={{ color: colors.textVeryDim }}>Languages</Text>
          </View>
          <View className="w-px" style={{ backgroundColor: colors.border }} />
          <View className="items-center">
            <Text className="text-white text-lg font-extrabold">∞</Text>
            <Text className="text-[10px]" style={{ color: colors.textVeryDim }}>Unlimited</Text>
          </View>
        </View>

        {/* ===== DEV ===== */}
        <View className="items-center">
          <View className="w-14 h-14 rounded-full items-center justify-center mb-3" style={{ backgroundColor: colors.accent + "18" }}>
            <Ionicons name="code-slash" size={24} color={colors.accent} />
          </View>
          <Text className="text-white text-base font-bold">Alan - 19</Text>
        </View>
      </View>
    </View>
  );
}
