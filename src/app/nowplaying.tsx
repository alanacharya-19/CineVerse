import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchNowPlaying } from "../services/api";
import type { Movie } from "../types/movie";
import { useSettings } from "../context/SettingsContext";
import Skeleton from "../components/ui/Skeleton";

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 16;
const CARD_W = (width - H_PADDING * 2 - GAP) / 2;
const CARD_H = CARD_W * 1.5;

export default function NowPlayingScreen() {
  const { currentColors: colors } = useSettings();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (p: number) => {
    setError(false);
    try {
      const data = await fetchNowPlaying(p);
      if (p === 1) setMovies(data);
      else setMovies((prev) => [...prev, ...data]);
      setPage(p);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const handleEndReached = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    load(page + 1);
  };

  const renderMovie = ({ item: movie }: { item: Movie }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        width: CARD_W,
        height: CARD_H,
        backgroundColor: colors.card,
      }}
    >
      <Image
        source={{ uri: movie.poster_path }}
        className="w-full h-full"
        resizeMode="cover"
      />
      <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/60">
        <Text className="text-white text-sm font-bold" numberOfLines={1}>
          {movie.title}
        </Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Ionicons name="star" size={11} color={colors.star} />
          <Text className="text-white text-[10px]">{movie.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <SafeAreaView className="mb-3">
          <View className="flex-row items-center gap-3 mx-4 mb-6">
            <View className="w-9 h-9" />
            <Text className="text-white text-xl font-bold">Now Playing</Text>
          </View>
        </SafeAreaView>
        <View className="flex-row flex-wrap px-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="rounded-2xl"
              style={{ width: CARD_W, height: CARD_H }}
            />
          ))}
        </View>
      </View>
    );

  if (error)
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
            <Text className="text-white text-xl font-bold">Now Playing</Text>
          </View>
        </SafeAreaView>
        <View className="flex-1 items-center justify-center">
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textVeryDim} />
          <Text className="text-sm mt-4 mb-4" style={{ color: colors.textDim }}>
            Failed to load
          </Text>
          <TouchableOpacity
            onPress={() => { setLoading(true); load(1); }}
            className="rounded-xl px-5 py-2"
            style={{ backgroundColor: colors.accent + "20" }}
          >
            <Text className="text-sm font-semibold" style={{ color: colors.accent }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );

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
          <Text className="text-white text-xl font-bold">Now Playing</Text>
        </View>
      </SafeAreaView>

      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: H_PADDING,
          paddingBottom: 24,
          gap: GAP,
        }}
        columnWrapperStyle={{ gap: GAP }}
        showsVerticalScrollIndicator={false}
        renderItem={renderMovie}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : null
        }
      />
    </View>
  );
}
