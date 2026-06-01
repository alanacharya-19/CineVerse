import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Movie } from "../../types/movie";
import { useSettings } from "../../context/SettingsContext";

type Props = {
  movies: Movie[];
};

const { width } = Dimensions.get("window");
const GAP = 12;
const H_PADDING = 16;
const CARD_W = (width - H_PADDING * 2 - GAP) / 2;
const CARD_H = CARD_W * 1.5;
const BTN_GAP = 8;
const BTN_W = (width - H_PADDING * 2 - BTN_GAP * 2) / 3;

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

const yearOptions = Array.from({ length: 2026 - 1950 + 1 }, (_, i) =>
  String(2026 - i)
);

const ratingOptions = Array.from({ length: 9 }, (_, i) => `\u2605 ${i + 1}+`);

type DropdownId = "genre" | "year" | "rating";

const DROPDOWN_LABEL: Record<DropdownId, string> = {
  genre: "Genre",
  year: "Year",
  rating: "Rating",
};

const resetLabel: Record<DropdownId, string> = {
  genre: "All Genres",
  year: "All Years",
  rating: "All Ratings",
};

const DROPDOWN_OPTIONS: Record<DropdownId, string[]> = {
  genre: genreOptions,
  year: yearOptions,
  rating: ratingOptions,
};

const BTN_LEFT: Record<DropdownId, number> = {
  genre: H_PADDING,
  year: H_PADDING + BTN_W + BTN_GAP,
  rating: H_PADDING + (BTN_W + BTN_GAP) * 2,
};

export default function CategoryMovies({ movies }: Props) {
  const { currentColors: colors } = useSettings();
  const [genre, setGenre] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null);
  const [btnTop, setBtnTop] = useState(0);
  const rowRef = useRef<View>(null);

  const measureTop = () => {
    rowRef.current?.measureInWindow((x, y) => setBtnTop(y));
  };

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
      const num = parseInt(rating.replace(/\D/g, ""), 10);
      if (!isNaN(num)) result = result.filter((m) => m.rating >= num && m.rating < num + 1);
    }

    return result;
  }, [movies, genre, year, rating]);

  const currentDisplay: Record<DropdownId, string> = {
    genre: genre ?? resetLabel.genre,
    year: year ?? resetLabel.year,
    rating: rating ?? resetLabel.rating,
  };

  const getOptions = (id: DropdownId) => {
    return [resetLabel[id], ...DROPDOWN_OPTIONS[id]];
  };

  const setFilter = (id: DropdownId, value: string) => {
    if (id === "genre") setGenre(value === resetLabel.genre ? null : value);
    else if (id === "year") setYear(value === resetLabel.year ? null : value);
    else if (id === "rating") setRating(value === resetLabel.rating ? null : value);
    setOpenDropdown(null);
  };

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center mx-4 mb-4">
        <Text className="text-white text-2xl font-bold">Browse Movies</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/browse")}>
          <Text style={{ color: colors.accent }} className="text-sm font-semibold">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===== DROPDOWN ROW ===== */}
      <View
        ref={rowRef}
        className="flex-row gap-2 mx-4 mb-4"
      >
        {(Object.keys(DROPDOWN_OPTIONS) as DropdownId[]).map((id) => (
          <TouchableOpacity
            key={id}
            activeOpacity={0.7}
            onPress={() => {
              if (openDropdown !== id) measureTop();
              setOpenDropdown(openDropdown === id ? null : id);
            }}
            className="flex-row items-center justify-between rounded-xl px-3 py-3"
            style={{
              width: BTN_W,
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor:
                openDropdown === id ? colors.accent : colors.border,
            }}
          >
            <Text
              className="text-xs"
              style={{
                color:
                  currentDisplay[id] === resetLabel[id]
                    ? colors.textDim
                    : colors.text,
              }}
              numberOfLines={1}
            >
              {currentDisplay[id]}
            </Text>
            <Ionicons
              name={openDropdown === id ? "chevron-up" : "chevron-down"}
              size={14}
              color={colors.textMuted}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* ===== DROPDOWN MODAL ===== */}
      <Modal visible={openDropdown !== null} transparent animationType="none" onRequestClose={() => setOpenDropdown(null)}>
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={() => setOpenDropdown(null)}
        >
          <View className="flex-1">
            {openDropdown && (
              <View
                className="rounded-2xl overflow-hidden"
                style={{
                  position: "absolute",
                  top: btnTop + 52,
                  left: BTN_LEFT[openDropdown],
                  width: BTN_W,
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  maxHeight: 240,
                }}
              >
                <FlatList
                  data={getOptions(openDropdown)}
                  keyExtractor={(item) => item}
                  nestedScrollEnabled
                  bounces={false}
                  showsVerticalScrollIndicator
                  renderItem={({ item: option, index: i }) => {
                    const active = option === currentDisplay[openDropdown];
                    const arr = getOptions(openDropdown);
                    return (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => setFilter(openDropdown, option)}
                        className="flex-row items-center px-3"
                        style={{
                          height: 44,
                          backgroundColor: active
                            ? colors.accent + "15"
                            : "transparent",
                          borderBottomWidth: i < arr.length - 1 ? 1 : 0,
                          borderBottomColor: colors.border,
                        }}
                      >
                        <Text
                          className="text-xs flex-1"
                          style={{
                            color: active
                              ? colors.accent
                              : colors.textMuted,
                            fontWeight: active ? "700" : "400",
                          }}
                          numberOfLines={1}
                        >
                          {option}
                        </Text>
                        {active && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color={colors.accent}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===== MOVIE GRID / EMPTY ===== */}
      {filtered.length === 0 ? (
        <View className="items-center py-16">
          <Ionicons name="film-outline" size={48} color={colors.textVeryDim} />
          <Text className="text-sm mt-4" style={{ color: colors.textDim }}>
            No movie available
          </Text>
        </View>
      ) : (
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
      )}
    </View>
  );
}
