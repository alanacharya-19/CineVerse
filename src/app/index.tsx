import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sampleMovies } from "../../sample/data";
import { upcomingMovies } from "../../sample/upcoming-data";
import CategoryMovies from "../components/section/CategoryMovies";
import TrendingMovie from "../components/section/TrendingMovie";
import UpcomingMovies from "../components/section/UpcomingMovies";
import { colors } from "../constants/colors";

const { width } = Dimensions.get("window");
const SIDEBAR_W = width * 0.72;

const menuItems = [
  { label: "Trending", icon: "flame" as const, id: "trending" },
  { label: "Upcoming", icon: "calendar" as const, id: "upcoming" },
  { label: "Browse Movies", icon: "film" as const, id: "browse" },
  { label: "Support", icon: "headset" as const, id: "support" },
  { label: "About", icon: "information-circle" as const, id: "about" },
  { label: "Login", icon: "log-in" as const, id: "login" },
];

export default function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuPress = (id: string) => {
    setSidebarOpen(false);
    if (id === "trending") router.push("/search");
    else if (id === "upcoming") router.push("/search");
    else if (id === "browse") router.push("/search");
    else if (id === "about") router.push("/about");
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="mb-3">
        <StatusBar barStyle="light-content" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity onPress={() => setSidebarOpen(true)}>
            <Ionicons name="menu" size={30} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-extrabold">
            <Text style={{ color: colors.accent }}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Ionicons name="search" size={30} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TrendingMovie movies={sampleMovies} />
        <UpcomingMovies movies={upcomingMovies} />
        <CategoryMovies movies={sampleMovies} />
      </ScrollView>

      {/* ===== SIDEBAR ===== */}
      <Modal
        visible={sidebarOpen}
        transparent
        animationType="none"
        onRequestClose={() => setSidebarOpen(false)}
      >
        <View className="flex-1 flex-row">
          <View
            style={{
              width: SIDEBAR_W,
              backgroundColor: colors.card,
              paddingTop: 60,
              paddingHorizontal: 24,
            }}
          >
           
            <Text className="text-white text-2xl font-extrabold mb-8">
              <Text style={{ color: colors.accent }}>M</Text>ovies
            </Text>
            {menuItems.map((item, i) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleMenuPress(item.id)}
                className="flex-row items-center gap-4 py-4"
                style={{
                  borderBottomWidth: i < menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <Ionicons name={item.icon} size={22} color={colors.textMuted} />
                <Text className="text-white text-base font-medium">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            className="flex-1 bg-black/60"
            activeOpacity={1}
            onPress={() => setSidebarOpen(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
