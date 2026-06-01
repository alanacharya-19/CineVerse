import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Movie } from "../../types/movie";
import { useSettings } from "../../context/SettingsContext";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  const { currentColors: colors } = useSettings();
  return (
    <TouchableOpacity
      className="flex-1"
      activeOpacity={0.8}
      onPress={() => router.push(`/movie/${movie.id}`)}
    >
      <View className="flex-1 rounded-3xl overflow-hidden">
        <Image
          source={{ uri: movie.poster_path }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-black/50">
          <Text className="text-white text-base font-bold" numberOfLines={1}>
            {movie.title}
          </Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="star" size={14} color={colors.star} />
            <Text className="text-white text-xs">{movie.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
