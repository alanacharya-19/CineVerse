import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Movie } from "../../../sample/data";

type MovieCardProps = {
  movie: Movie;
};

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <TouchableOpacity className="flex-1" activeOpacity={0.8}>
      <View className="flex-1 rounded-3xl overflow-hidden">
        <Image
          source={{ uri: movie.poster_path }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <BlurView
          intensity={40}
          tint="dark"
          className="absolute bottom-0 left-0 right-0 p-4"
        >
          <Text className="text-white text-lg font-bold" numberOfLines={1}>
            {movie.title}
          </Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="star" size={16} color="#eab308" />
            <Text className="text-white text-sm">{movie.rating}</Text>
          </View>
        </BlurView>
      </View>
    </TouchableOpacity>
  );
}
