import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../constants/colors";

const openWhatsApp = () => {
  const url = "whatsapp://send?phone=919876543210";
  Linking.openURL(url).catch(() => {
    Linking.openURL("https://wa.me/9765364107").catch(() =>
      Alert.alert("Error", "WhatsApp is not installed"),
    );
  });
};

const openGmail = () => {
  Linking.openURL("mailto:alanacharyaaaa19@gmail.com").catch(() =>
    Alert.alert("Error", "Could not open email client"),
  );
};

export default function SupportScreen() {
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
          <Text className="text-white text-xl font-bold">Support</Text>
        </View>
      </SafeAreaView>

      <View
        className="flex-1 items-center justify-center px-8"
        style={{ marginTop: -60 }}
      >
        <View className="mb-5" style={{ borderRadius: 20, width: 80, height: 80, overflow: "hidden" }}>
          <Image
            source={require("../../assets/logo/appLogo.png")}
            style={{ width: 80, height: 80 }}
            resizeMode="cover"
          />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Get in Touch</Text>
        <Text
          className="text-sm text-center mb-10"
          style={{ color: colors.textMuted }}
        >
          Have questions or feedback? We're here to help.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openWhatsApp}
          className="w-full rounded-2xl p-4 mb-4 flex-row items-center gap-4"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: "#25D366" + "20" }}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-base font-semibold">WhatsApp</Text>
            <Text className="text-xs mt-0.5" style={{ color: colors.textDim }}>
              Quick reply via DM
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textVeryDim}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openGmail}
          className="w-full rounded-2xl p-4 flex-row items-center gap-4"
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: "#EA4335" + "20" }}
          >
            <Ionicons name="mail" size={24} color="#EA4335" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-base font-semibold">Email</Text>
            <Text className="text-xs mt-0.5" style={{ color: colors.textDim }}>
              support@cineverse.app
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textVeryDim}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
