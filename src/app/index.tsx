import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
import { colors } from "../constants/colors";
import CategoryMovies from "../components/section/CategoryMovies";
import TrendingMovie from "../components/section/TrendingMovie";
import UpcomingMovies from "../components/section/UpcomingMovies";
import { fetchPopular, fetchTrendingAll, fetchUpcoming } from "../services/api";
import type { Movie } from "../types/movie";

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
  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTrendingAll().then(setTrending);
    fetchUpcoming().then(setUpcoming);
    fetchPopular().then(setPopular);
  }, []);

  const browseMovies = useMemo(() => {
    const seen = new Set<number>();
    return [...trending, ...popular, ...upcoming].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [trending, popular, upcoming]);

  const handleMenuPress = (id: string) => {
    setSidebarOpen(false);
    if (id === "trending") router.push("/trending");
    else if (id === "upcoming") router.push("/upcoming");
    else if (id === "browse") router.push("/browse");
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
            <Text style={{ color: colors.accent }}>C</Text>ineVerse
          </Text>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Ionicons name="search" size={30} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TrendingMovie movies={trending} />
        <UpcomingMovies movies={upcoming} />
        <CategoryMovies movies={browseMovies} />
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
              <Text style={{ color: colors.accent }}>C</Text>ineVerse
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
