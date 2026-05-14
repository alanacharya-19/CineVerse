import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Movie } from "../../types/movie";
import { colors } from "../../constants/colors";

type Props = {
  movies: Movie[];
};

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 16;
const CARD_W = (width - H_PADDING * 2 - GAP) / 2;
const CARD_H = CARD_W * 1.5;

const genreOptions = [
  "Action",
  "Adventure",
  "Comedy",
  "Crime/Drama",
  "Fantasy",
  "History",
  "Sci-Fi",
  "Thriller",
];

const ratingOptions = ["1-3", "3-5", "5-7", "7-9", "9-10"];

type DropdownId = "genre" | "year" | "rating";

export default function CategoryMovies({ movies }: Props) {
  const [genre, setGenre] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    movies.forEach((m) => {
      const y = parseInt(m.releaseDate.slice(0, 4), 10);
      if (!isNaN(y)) years.add(y);
    });
    return Array.from(years)
      .sort((a, b) => b - a)
      .map(String);
  }, [movies]);

  const filtered = useMemo(() => {
    let result = [...movies];

    if (genre) {
      if (genre === "Crime/Drama")
        result = result.filter(
          (m) => m.genre.includes("Crime") || m.genre.includes("Drama")
        );
      else result = result.filter((m) => m.genre.includes(genre));
    }

    if (year)
      result = result.filter((m) => m.releaseDate.startsWith(year));

    if (rating) {
      const [lo, hi] = rating.split("-").map(Number);
      result = result.filter((m) => m.rating >= lo && m.rating <= hi);
    }

    return result;
  }, [movies, sort, genre, year, rating]);

  const items: Record<DropdownId, { options: string[] }> = {
    sort: { options: sortOptions },
    genre: { options: genreOptions },
    year: { options: yearOptions },
    rating: { options: ratingOptions },
  };

  const currentDisplay: Record<DropdownId, string> = {
    sort,
    genre: genre ?? "Genre",
    year: year ?? "Year",
    rating: rating ?? "Rating",
  };

  return (
    <View className="mb-8">
      <Text className="text-white text-2xl font-bold mx-4 mb-4">
        Browse Movies
      </Text>

      {/* ===== DROPDOWN ROW ===== */}
      <View className="flex-row gap-2 mx-4 mb-4">
        {(Object.keys(items) as DropdownId[]).map((id) => {
          const value = currentDisplay[id];
          return (
            <TouchableOpacity
              key={id}
              activeOpacity={0.7}
              onPress={() =>
                setOpenDropdown(openDropdown === id ? null : id)
              }
              className="flex-row items-center rounded-xl px-3 py-2.5"
              style={{
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor:
                  openDropdown === id ? colors.accent : colors.border,
              }}
            >
              <Text
                className="text-[11px]"
                style={{ color: colors.textMuted }}
                numberOfLines={1}
              >
                {value}
              </Text>
              <Ionicons
                name={openDropdown === id ? "chevron-up" : "chevron-down"}
                size={12}
                color={colors.textMuted}
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ===== DROPDOWN MODAL ===== */}
      <Modal
        visible={openDropdown !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenDropdown(null)}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setOpenDropdown(null)}
        >
          <View className="flex-1 justify-start pt-28">
            <View
              className="mx-4 rounded-2xl overflow-hidden"
              style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }}
            >
              <ScrollView bounces={false}>
                {(openDropdown
                  ? items[openDropdown].options
                  : []
                ).map((option, i, arr) => {
                  const currentVal = currentDisplay[openDropdown!];
                  const active = option === currentVal;
                  return (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.6}
                      onPress={() => {
                        if (openDropdown === "sort") setSort(option);
                        else if (openDropdown === "genre")
                          setGenre(option === "Genre" ? null : option);
                        else if (openDropdown === "year")
                          setYear(option === "Year" ? null : option);
                        else if (openDropdown === "rating")
                          setRating(option === "Rating" ? null : option);
                        setOpenDropdown(null);
                      }}
                      className="flex-row items-center px-4 py-3.5"
                      style={{
                        backgroundColor: active
                          ? colors.accent + "15"
                          : "transparent",
                        borderBottomWidth:
                          i < arr.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <Text
                        className="text-sm flex-1"
                        style={{
                          color: active ? colors.accent : colors.textMuted,
                          fontWeight: active ? "700" : "400",
                        }}
                      >
                        {option}
                      </Text>
                      {active && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={colors.accent}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===== MOVIE GRID ===== */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          paddingHorizontal: H_PADDING,
          gap: GAP,
        }}
      >
        {filtered.map((movie) => (
          <TouchableOpacity
            key={movie.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/movie/${movie.id}`)}
            className="rounded-2xl overflow-hidden"
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
        ))}
      </View>
    </View>
  );
}
