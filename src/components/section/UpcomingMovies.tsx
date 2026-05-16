import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import type { Movie } from "../../types/movie";
import { colors } from "../../constants/colors";

type Props = {
  movies: Movie[];
};

const CARD_W = 140;
const CARD_H = 200;

export default function UpcomingMovies({ movies }: Props) {
  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mx-4 mb-4">
        <Text className="text-white text-2xl font-bold">Upcoming Movies</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/upcoming")}>
          <Text style={{ color: colors.accent }} className="text-sm font-semibold">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {movies.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/movie/${movie.id}`)}
            className="rounded-2xl overflow-hidden"
            style={{ width: CARD_W, height: CARD_H, backgroundColor: colors.card }}
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
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
