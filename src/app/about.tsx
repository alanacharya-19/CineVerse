import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/colors";

const openWhatsApp = () => {
  Linking.openURL("whatsapp://send?phone=919876543210").catch(() => {
    Linking.openURL("https://wa.me/919876543210").catch(() =>
      Alert.alert("Error", "WhatsApp is not installed"),
    );
  });
};

const openGmail = () => {
  Linking.openURL("mailto:support@cineverse.app").catch(() =>
    Alert.alert("Error", "Could not open email client"),
  );
};

export default function AboutScreen() {
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* ===== HEADER ===== */}
        <View
          className="px-5 pt-14 pb-10"
          style={{
            backgroundColor: colors.accent + "12",
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
          }}
        >
          <View className="flex-row items-center gap-3 mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">About & Help</Text>
          </View>

          <View className="items-center">
            <View
              style={{
                width: 100,
                height: 90,
                borderRadius: 24,
                backgroundColor: "#000",
                overflow: "hidden",
                marginBottom: 14,
              }}
            >
              <Image
                source={require("../../assets/logo/appLogo.png")}
                style={{ width: 100, height: 90 }}
                resizeMode="cover"
              />
            </View>
            <Text className="text-white text-3xl font-extrabold tracking-tight">
              <Text style={{ color: colors.accent }}>Cine</Text>Verse
            </Text>
            <View className="flex-row items-center gap-1 mt-2">
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: colors.accent }}
              />
              <Text className="text-xs" style={{ color: colors.textMuted }}>
                v1.0.0
              </Text>
            </View>
          </View>
        </View>

        {/* ===== STATS ROW ===== */}
        <View
          className="flex-row mx-6 -mt-5 rounded-2xl overflow-hidden"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          {[
            { value: "10K+", label: "Movies" },
            { value: "8", label: "Languages" },
            { value: "∞", label: "Unlimited" },
          ].map((s, i) => (
            <View
              key={s.label}
              className="flex-1 items-center py-4"
              style={{
                borderRightWidth: i < 2 ? 1 : 0,
                borderRightColor: colors.border,
              }}
            >
              <Text className="text-white text-lg font-extrabold">
                {s.value}
              </Text>
              <Text
                className="text-[10px] mt-0.5"
                style={{ color: colors.textVeryDim }}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ===== CONTENT ===== */}
        <View className="px-6 pt-6 pb-10">
          {/* ===== DESCRIPTION ===== */}
          <View
            className="rounded-2xl p-5 mb-6"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons
                name="information-circle"
                size={18}
                color={colors.accent}
              />
              <Text className="text-white text-sm font-semibold">About</Text>
            </View>
            <Text
              className="text-xs leading-6"
              style={{ color: colors.textMuted }}
            >
              CineVerse brings the world of cinema to your fingertips. From
              Hollywood blockbusters to regional Indian cinema, discover films
              across 8+ languages in one place.
            </Text>
          </View>

          {/* ===== CONTACT ===== */}
          <Text
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: colors.textDim }}
          >
            Get in Touch
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openWhatsApp}
            className="w-full rounded-2xl p-4 mb-3 flex-row items-center gap-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#25D36618" }}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">
                Chat on WhatsApp
              </Text>
              <Text
                className="text-[11px] mt-0.5"
                style={{ color: colors.textDim }}
              >
                Usually replies within a few hours
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textVeryDim}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={openGmail}
            className="w-full rounded-2xl p-4 mb-6 flex-row items-center gap-4"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <View
              className="w-12 h-12 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#EA433518" }}
            >
              <Ionicons name="mail" size={24} color="#EA4335" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-sm font-semibold">
                Send an Email
              </Text>
              <Text
                className="text-[11px] mt-0.5"
                style={{ color: colors.textDim }}
              >
                support@cineverse.app
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textVeryDim}
            />
          </TouchableOpacity>

          {/* ===== DIVIDER ===== */}
          <View
            className="h-px mb-6"
            style={{ backgroundColor: colors.border }}
          />

          {/* ===== DEV ===== */}
          <View className="items-center">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-3"
              style={{
                backgroundColor: colors.accent + "15",
                borderWidth: 1.5,
                borderColor: colors.accent + "25",
              }}
            >
              <Ionicons name="code-slash" size={26} color={colors.accent} />
            </View>
            <Text className="text-white text-base font-bold">Alan - 19</Text>
            <View className="flex-row items-center gap-1">
              <Text
                className="text-[10px]"
                style={{ color: colors.textVeryDim }}
              >
                Crafted with
              </Text>
              <Ionicons name="heart" size={10} color={colors.accent} />
              <Text
                className="text-[10px]"
                style={{ color: colors.textVeryDim }}
              >
                using React Native
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
