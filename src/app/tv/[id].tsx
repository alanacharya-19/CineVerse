import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchTVDetails, fetchSimilarTV } from "../../services/api";
import type { TVShow } from "../../types/movie";
import { useSettings } from "../../context/SettingsContext";

const { width, height } = Dimensions.get("window");

export default function TVDetailScreen() {
  const { currentColors: colors } = useSettings();
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [show, setShow] = useState<TVShow | null>(null);
  const [creator, setCreator] = useState("N/A");
  const [creatorImage, setCreatorImage] = useState("");
  const [seasons, setSeasons] = useState(0);
  const [episodes, setEpisodes] = useState(0);
  const [status, setStatus] = useState("N/A");
  const [related, setRelated] = useState<TVShow[]>([]);

  useEffect(() => {
    const tvId = Number(id);
    fetchSimilarTV(tvId).then(setRelated);
    fetchTVDetails(tvId).then((d) => {
      setCreator(d.creator);
      setCreatorImage(d.creatorImage);
      setSeasons(d.seasons);
      setEpisodes(d.episodes);
      setStatus(d.status);
    });
    fetch(`https://api.themoviedb.org/3/tv/${tvId}?language=en-US`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setShow({
          id: data.id,
          title: data.name,
          poster_path: data.poster_path
            ? "https://image.tmdb.org/t/p/w500" + data.poster_path
            : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
          backdrop_path: data.backdrop_path
            ? "https://image.tmdb.org/t/p/w500" + data.backdrop_path
            : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
          rating: Math.round(data.vote_average * 10) / 10,
          genre: data.genres ? data.genres.map((g: { name: string }) => g.name).join(", ") : "",
          seasons: data.number_of_seasons ? `${data.number_of_seasons}` : "N/A",
          episodes: data.number_of_episodes ? `${data.number_of_episodes}` : "N/A",
          releaseDate: data.first_air_date || "TBA",
          description: data.overview || "No description available.",
        });
      });
  }, [id]);

  if (!show)
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );

  const genres = show.genre ? show.genre.split(", ") : [];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== HERO ===== */}
        <View className="w-full" style={{ height: height * 0.5 }}>
          <Image
            source={{ uri: show.poster_path }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <SafeAreaView className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-5 pt-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* ===== CONTENT ===== */}
        <View
          className="-mt-8 z-20 px-5 pt-5"
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          {/* ===== TITLE ===== */}
          <View className="flex-row items-stretch mb-4">
            <View className="w-1 bg-pink-500 rounded-full mr-3" />
            <View className="flex-1">
              <Text className="text-white text-3xl font-extrabold tracking-wide leading-9">
                {show.title}
              </Text>
            </View>
          </View>

          {/* ===== INFO CARDS ===== */}
          <View className="flex-row gap-3 mb-5">
            {[
              { icon: "star" as const, value: show.rating.toString(), tint: colors.star, bgOpacity: "rgba(234,179,8,0.1)" },
              { icon: "tv" as const, value: `${seasons} Seasons`, tint: colors.purple, bgOpacity: "rgba(167,139,250,0.1)" },
              { icon: "calendar-outline" as const, value: show.releaseDate, tint: colors.sky, bgOpacity: "rgba(96,165,250,0.1)" },
            ].map((item, i) => (
              <View
                key={i}
                className="flex-1 rounded-xl p-3 items-center"
                style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
              >
                <View
                  className="w-9 h-9 rounded-full items-center justify-center mb-2"
                  style={{ backgroundColor: item.bgOpacity }}
                >
                  <Ionicons name={item.icon} size={16} color={item.tint} />
                </View>
                <Text className="text-white text-sm font-bold">{item.value}</Text>
              </View>
            ))}
          </View>

          {/* ===== GENRES ===== */}
          {genres.length > 0 && (
            <View className="flex-row flex-wrap gap-2 mb-5">
              {genres.map((g) => (
                <View
                  key={g}
                  className="bg-neutral-800 rounded-full px-4 py-2 border border-neutral-700/50"
                >
                  <Text className="text-neutral-300 text-xs font-medium">{g}</Text>
                </View>
              ))}
            </View>
          )}

          {/* ===== SYNOPSIS ===== */}
          <View className="mb-5">
            <Text className="text-neutral-400 text-sm font-semibold mb-2">Story</Text>
            <Text className="text-neutral-500 text-sm leading-7">
              {show.description}
            </Text>
          </View>

          {/* ===== CREATOR / DETAILS ===== */}
          <View className="mb-5">
            <Text className="text-neutral-400 text-sm font-semibold mb-3">Details</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5">
              <View className="flex-row gap-5 px-5">
                <View className="items-center" style={{ width: 80 }}>
                  <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-700/50">
                    <Image
                      source={{ uri: creatorImage }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <Text className="text-neutral-300 text-xs mt-2 text-center font-medium leading-4" numberOfLines={2}>
                    {creator}
                  </Text>
                  <Text className="text-neutral-600 text-[9px] text-center mt-0.5">Creator</Text>
                </View>
              </View>
            </ScrollView>
            <View className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 mt-4">
              <View className="flex-row flex-wrap">
                {[
                  { label: "Seasons", value: `${seasons}` },
                  { label: "Episodes", value: `${episodes}` },
                  { label: "Status", value: status },
                ].map((d, i) => (
                  <View key={i} className="w-1/3 mb-3">
                    <Text className="text-neutral-600 text-[10px] uppercase tracking-wider">{d.label}</Text>
                    <Text className="text-neutral-200 text-sm mt-0.5">{d.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ===== MORE LIKE THIS ===== */}
          {related.length > 0 && (
            <View>
              <Text className="text-neutral-400 text-sm font-semibold mb-3">More Like This</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5">
                <View className="flex-row gap-3 px-5">
                  {related.map((r) => (
                    <TouchableOpacity
                      key={r.id}
                      className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800"
                      style={{ width: 120 }}
                      onPress={() => router.push(`/tv/${r.id}`)}
                    >
                      <Image
                        source={{ uri: r.poster_path }}
                        className="w-full h-44"
                        resizeMode="cover"
                      />
                      <View className="px-2.5 py-2">
                        <Text className="text-neutral-200 text-xs font-medium" numberOfLines={1}>
                          {r.title}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-0.5">
                          <Ionicons name="star" size={10} color={colors.star} />
                          <Text className="text-[10px]" style={{ color: colors.star }}>
                            {r.rating}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
