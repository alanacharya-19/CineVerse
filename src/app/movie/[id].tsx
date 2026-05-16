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
import { fetchMovieCredits, fetchMovieRuntime, fetchSimilarMovies } from "../../services/api";
import type { Movie } from "../../types/movie";
import { colors } from "../../constants/colors";

const { width, height } = Dimensions.get("window");

export default function MovieDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [favorited, setFavorited] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [director, setDirector] = useState("N/A");
  const [writer, setWriter] = useState("N/A");
  const [directorImage, setDirectorImage] = useState("");
  const [writerImage, setWriterImage] = useState("");
  const [duration, setDuration] = useState("N/A");
  const [budget, setBudget] = useState("N/A");
  const [boxOffice, setBoxOffice] = useState("N/A");
  const [related, setRelated] = useState<Movie[]>([]);

  useEffect(() => {
    const movieId = Number(id);
    fetchSimilarMovies(movieId).then(setRelated);
    fetchMovieCredits(movieId).then((c) => {
      setDirector(c.director);
      setWriter(c.writer);
      setDirectorImage(c.directorImage);
      setWriterImage(c.writerImage);
    });
    fetchMovieRuntime(movieId).then((r) => {
      setDuration(r.duration);
      setBudget(r.budget);
      setBoxOffice(r.boxOffice);
    });
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setMovie({
          id: data.id,
          title: data.title,
          poster_path: data.poster_path
            ? "https://image.tmdb.org/t/p/w500" + data.poster_path
            : "",
          backdrop_path: data.backdrop_path
            ? "https://image.tmdb.org/t/p/w500" + data.backdrop_path
            : "",
          rating: Math.round(data.vote_average * 10) / 10,
          genre: "",
          duration: "",
          releaseDate: data.release_date || "TBA",
          description: data.overview || "No description available.",
        });
      });
  }, [id]);

  if (!movie)
    return (
      <View className="flex-1 bg-neutral-950 items-center justify-center">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );

  const genres = movie.genre ? movie.genre.split(", ") : [];
  const hasDetails = budget !== "N/A" || boxOffice !== "N/A";
  const isUpcoming =
    movie.releaseDate &&
    movie.releaseDate !== "TBA" &&
    new Date(movie.releaseDate) > new Date();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ===== HERO ===== */}
        <View className="w-full" style={{ height: height * 0.5 }}>
          <Image
            source={{ uri: movie.poster_path }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <View
            className="absolute bottom-0 left-0 right-0 h-36"
            style={{ backgroundColor: "transparent" }}
          />

          <SafeAreaView className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-5 pt-3">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFavorited(!favorited)}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.iconBg }}
            >
              <Ionicons
                name={favorited ? "heart" : "heart-outline"}
                size={18}
                color={favorited ? colors.accent : colors.text}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* ===== CURVED OVERLAY SECTION ===== */}
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
                {movie.title}
              </Text>
            </View>
          </View>

          {/* ===== PLAY/SOON + SHARE ===== */}
          <View className="flex-row gap-3 mb-5">
            <TouchableOpacity
              className="flex-[2] rounded-xl py-3.5 flex-row items-center justify-center gap-2"
              style={{
                backgroundColor: isUpcoming ? colors.accent + "25" : "white",
                borderWidth: isUpcoming ? 1 : 0,
                borderColor: isUpcoming ? colors.accent : "transparent",
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isUpcoming ? "time" : "play"}
                size={18}
                color={isUpcoming ? colors.accent : "#0a0a0f"}
              />
              <Text
                className="font-bold text-sm"
                style={{ color: isUpcoming ? colors.accent : "#0a0a0f" }}
              >
                {isUpcoming ? "Coming Soon" : "Play"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-neutral-800 rounded-xl py-3.5 flex-row items-center justify-center gap-2 border border-neutral-700/50">
              <Ionicons name="share-outline" size={18} color="white" />
              <Text className="text-white text-sm font-medium">Share</Text>
            </TouchableOpacity>
          </View>

          {/* ===== INFO CARDS ===== */}
          <View className="flex-row gap-3 mb-5">
            {[
              { icon: "star" as const, value: isUpcoming ? "N/A" : movie.rating.toString(), tint: colors.star, bgOpacity: "rgba(234,179,8,0.1)" },
              { icon: "time-outline" as const, value: duration, tint: colors.purple, bgOpacity: "rgba(167,139,250,0.1)" },
              { icon: "calendar-outline" as const, value: movie.releaseDate, tint: colors.sky, bgOpacity: "rgba(96,165,250,0.1)" },
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

          {/* ===== SYNOPSIS ===== */}
          <View className="mb-5">
            <Text className="text-neutral-400 text-sm font-semibold mb-2">Story</Text>
            <Text className="text-neutral-500 text-sm leading-7">
              {movie.description}
            </Text>
          </View>

          {/* ===== DIRECTOR / WRITER ===== */}
          <View className="mb-5">
            <Text className="text-neutral-400 text-sm font-semibold mb-3">Production</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5">
              <View className="flex-row gap-5 px-5">
                {[
                  { name: director, role: "Director", image: directorImage },
                  { name: writer, role: "Writer", image: writerImage },
                ].map((person, i) => (
                  <View key={i} className="items-center" style={{ width: 80 }}>
                    <View className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-700/50">
                      <Image
                        source={{ uri: person.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <Text
                      className="text-neutral-300 text-xs mt-2 text-center font-medium leading-4"
                      numberOfLines={2}
                    >
                      {person.name}
                    </Text>
                    <Text className="text-neutral-600 text-[9px] text-center mt-0.5">
                      {person.role}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
            {hasDetails && !isUpcoming && (
              <View className="bg-neutral-900 rounded-xl p-4 border border-neutral-800 mt-4">
                <View className="flex-row flex-wrap">
                  {[{ label: "Budget", value: budget }, { label: "Box Office", value: boxOffice }].map((d, i) => (
                    <View key={i} className="w-1/2 mb-3">
                      <Text className="text-neutral-600 text-[10px] uppercase tracking-wider">{d.label}</Text>
                      <Text className="text-neutral-200 text-sm mt-0.5">{d.value}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
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
                      onPress={() => router.push(`/movie/${r.id}`)}
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
