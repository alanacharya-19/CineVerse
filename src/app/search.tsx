import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { useSettings } from "../context/SettingsContext";
import type { Movie } from "../types/movie";

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 16;
const CARD_W = (width - H_PADDING * 2 - GAP) / 2;
const CARD_H = CARD_W * 1.5;

export default function SearchScreen() {
  const { currentColors: colors } = useSettings();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const queryRef = useRef(query);

  const doSearch = useCallback(async (q: string, p: number) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    try {
      const data = await searchMovies(q, p);
      if (queryRef.current !== q) return;
      if (p === 1) setResults(data);
      else setResults((prev) => [...prev, ...data]);
      setPage(p);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const handleSearch = (text: string) => {
    setQuery(text);
    setLoading(true);
    setPage(1);
    doSearch(text, 1);
  };

  const handleEndReached = () => {
    if (loadingMore || !query.trim()) return;
    setLoadingMore(true);
    doSearch(query, page + 1);
  };

  const renderMovie = ({ item: movie }: { item: Movie }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push(`/movie/${movie.id}`)}
      className="rounded-2xl overflow-hidden mb-4"
      style={{ width: CARD_W, height: CARD_H, backgroundColor: colors.card }}
    >
      <Image source={{ uri: movie.poster_path }} className="w-full h-full" resizeMode="cover" />
      <View className="absolute bottom-0 left-0 right-0 p-3 bg-black/60">
        <Text className="text-white text-sm font-bold" numberOfLines={1}>{movie.title}</Text>
        <View className="flex-row items-center gap-1 mt-0.5">
          <Ionicons name="star" size={11} color={colors.star} />
          <Text className="text-white text-[10px]">{movie.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
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

      {results.length === 0 && !loading ? (
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
          contentContainerStyle={{ paddingHorizontal: H_PADDING, paddingBottom: 24, gap: GAP }}
          columnWrapperStyle={{ gap: GAP }}
          showsVerticalScrollIndicator={false}
          renderItem={renderMovie}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View className="py-6 items-center"><ActivityIndicator size="small" color={colors.accent} /></View>
            ) : null
          }
        />
      )}
    </View>
  );
}
