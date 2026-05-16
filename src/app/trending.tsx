import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchTrendingAll } from "../services/api";
import type { Movie } from "../types/movie";
import { colors } from "../constants/colors";

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 16;
const CARD_W = (width - H_PADDING * 2 - GAP) / 2;
const CARD_H = CARD_W * 1.5;

export default function TrendingScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchTrendingAll().then(setMovies);
  }, []);

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
          <Text className="text-white text-xl font-bold">Trending</Text>
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
        renderItem={({ item: movie }) => (
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
        )}
      />
    </View>
  );
}
