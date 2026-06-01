import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryMovies from "../components/section/CategoryMovies";
import TrendingMovie from "../components/section/TrendingMovie";
import UpcomingMovies from "../components/section/UpcomingMovies";
import Skeleton from "../components/ui/Skeleton";
import { useSettings } from "../context/SettingsContext";
import { fetchPopular, fetchUpcoming } from "../services/api";
import type { Movie } from "../types/movie";

const { width } = Dimensions.get("window");
const SIDEBAR_W = width * 0.72;

const menuItems = [
  { label: "Trending", icon: "flame" as const, id: "trending" },
  { label: "Now Playing", icon: "play" as const, id: "nowplaying" },
  { label: "Upcoming", icon: "calendar" as const, id: "upcoming" },
  { label: "Browse Movies", icon: "film" as const, id: "browse" },
  { label: "TV Shows", icon: "tv" as const, id: "tv" },
  { label: "Favorites", icon: "heart" as const, id: "favorites" },
  { label: "Settings", icon: "settings" as const, id: "settings" },
  { label: "About & Help", icon: "information-circle" as const, id: "about" },
];

export default function Index() {
  const { currentColors: colors } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [trendingErr, setTrendingErr] = useState(false);
  const [upcomingErr, setUpcomingErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setTrendingErr(false);
    setUpcomingErr(false);
    try {
      const [t, u] = await Promise.all([fetchPopular(), fetchUpcoming()]);
      setTrending(t);
      setUpcoming(u);
    } catch {
      setTrendingErr(true);
      setUpcomingErr(true);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const browseMovies = useMemo(() => {
    const seen = new Set<number>();
    return [...trending, ...upcoming].filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });
  }, [trending, upcoming]);

  const handleMenuPress = (id: string) => {
    setSidebarOpen(false);
    if (id === "trending") router.push("/trending");
    else if (id === "nowplaying") router.push("/nowplaying");
    else if (id === "upcoming") router.push("/upcoming");
    else if (id === "browse") router.push("/browse");
    else if (id === "tv") router.push("/tv");
    else if (id === "favorites") router.push("/favorites");
    else if (id === "settings") router.push("/settings");
    else if (id === "about") router.push("/about");
  };

  const renderError = (onRetry: () => void) => (
    <View className="items-center py-10">
      <Ionicons
        name="cloud-offline-outline"
        size={36}
        color={colors.textVeryDim}
      />
      <Text className="text-sm mt-2 mb-3" style={{ color: colors.textDim }}>
        Failed to load
      </Text>
      <TouchableOpacity
        onPress={onRetry}
        className="rounded-xl px-5 py-2"
        style={{ backgroundColor: colors.accent + "20" }}
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.accent }}
        >
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSkeleton = () => (
    <View className="mb-8">
      <Skeleton
        className="rounded-lg mx-4 mb-4"
        style={{ width: 100, height: 20 }}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="rounded-2xl"
            style={{ width: width * 0.7, height: width * 0.7 * 1.5 }}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="mb-3">
        <StatusBar barStyle="light-content" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity
            onPress={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <Ionicons name="menu" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-white text-2xl font-extrabold tracking-tight">
            <Text style={{ color: colors.accent }}>Cine</Text>Verse
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/search")}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <Ionicons name="search" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
            progressBackgroundColor={colors.card}
          />
        }
      >
        {!loaded ? (
          <>
            {renderSkeleton()}
            {renderSkeleton()}
          </>
        ) : trendingErr ? (
          renderError(() =>
            fetchPopular()
              .then(setTrending)
              .catch(() => setTrendingErr(true)),
          )
        ) : (
          <TrendingMovie movies={trending} />
        )}

        {loaded && upcomingErr ? (
          renderError(() =>
            fetchUpcoming()
              .then(setUpcoming)
              .catch(() => setUpcomingErr(true)),
          )
        ) : (
          <UpcomingMovies movies={upcoming} />
        )}

        {loaded && <CategoryMovies movies={browseMovies} />}
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
