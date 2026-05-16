import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchMovies } from "../services/api";
import { colors } from "../constants/colors";
import type { Movie } from "../types/movie";

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 16;
const CARD_W = (width - H_PADDING * 2 - GAP) / 2;
const CARD_H = CARD_W * 1.5;

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    searchMovies(text).then(setResults);
  };

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
          <View
            className="flex-1 rounded-xl px-4 py-3"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            }}
          >
            <TextInput
              placeholder="Search movies..."
              placeholderTextColor={colors.textVeryDim}
              value={query}
              onChangeText={handleSearch}
              autoFocus
              className="text-white text-sm"
              style={{ color: colors.text }}
            />
          </View>
        </View>
      </SafeAreaView>

      {results.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="search-outline" size={48} color={colors.textVeryDim} />
          <Text className="text-sm mt-4" style={{ color: colors.textDim }}>
            {query.trim() ? "No movies found" : "Search for your favorite movies"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
      )}
    </View>
  );
}
