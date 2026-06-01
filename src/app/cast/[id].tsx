import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchPersonDetails, fetchPersonCredits } from "../../services/api";
import { useSettings } from "../../context/SettingsContext";
import Skeleton from "../../components/ui/Skeleton";

const { width } = Dimensions.get("window");
const POSTER_W = (width - 48 - 12) / 2;
const POSTER_H = POSTER_W * 1.5;

type Credit = {
  id: number;
  title: string;
  poster_path: string;
  rating: number;
  releaseDate: string;
};

export default function CastDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { currentColors: colors } = useSettings();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [department, setDepartment] = useState("");
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const personId = Number(id);
    Promise.all([
      fetchPersonDetails(personId),
      fetchPersonCredits(personId),
    ])
      .then(([details, creditsData]) => {
        setName(details.name);
        setBio(details.bio);
        setImage(details.image);
        setBirthplace(details.birthplace);
        setDepartment(details.department);
        setCredits(creditsData);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <SafeAreaView className="flex-row items-center gap-3 mx-4 mb-6">
          <View className="w-9 h-9" />
          <Skeleton className="rounded-lg" style={{ width: 150, height: 20 }} />
        </SafeAreaView>
        <View className="items-center mb-6">
          <Skeleton className="rounded-full" style={{ width: 120, height: 120 }} />
        </View>
        <View className="px-6">
          <Skeleton className="rounded-lg mb-3" style={{ width: "100%", height: 14 }} />
          <Skeleton className="rounded-lg mb-3" style={{ width: "100%", height: 14 }} />
          <Skeleton className="rounded-lg" style={{ width: "60%", height: 14 }} />
        </View>
      </View>
    );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* ===== HEADER ===== */}
        <SafeAreaView className="flex-row items-center gap-3 mx-4 mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.iconBg }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold" numberOfLines={1}>{name}</Text>
        </SafeAreaView>

        {/* ===== PROFILE ===== */}
        <View className="items-center mb-6">
          <View className="w-28 h-28 rounded-full overflow-hidden border-2" style={{ borderColor: colors.border }}>
            <Image source={{ uri: image }} className="w-full h-full" resizeMode="cover" />
          </View>
          <Text className="text-white text-xl font-bold mt-3">{name}</Text>
          <Text className="text-sm mt-1" style={{ color: colors.textMuted }}>{department}</Text>
          {birthplace !== "Unknown" && (
            <View className="flex-row items-center gap-1 mt-1">
              <Ionicons name="location-outline" size={12} color={colors.textVeryDim} />
              <Text className="text-xs" style={{ color: colors.textVeryDim }}>{birthplace}</Text>
            </View>
          )}
        </View>

        {/* ===== BIO ===== */}
        {bio !== "No biography available." && (
          <View className="mx-6 mb-6">
            <Text className="text-sm font-semibold mb-2" style={{ color: colors.textMuted }}>Biography</Text>
            <Text className="text-sm leading-6" style={{ color: colors.textDim }}>
              {bio}
            </Text>
          </View>
        )}

        {/* ===== FILMOGRAPHY ===== */}
        {credits.length > 0 && (
          <View className="mx-6">
            <Text className="text-sm font-semibold mb-3" style={{ color: colors.textMuted }}>Filmography</Text>
            <View className="flex-row flex-wrap" style={{ gap: 12 }}>
              {credits.map((credit) => (
                <TouchableOpacity
                  key={credit.id}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/movie/${credit.id}`)}
                  className="rounded-2xl overflow-hidden mb-2"
                  style={{ width: POSTER_W, height: POSTER_H, backgroundColor: colors.card }}
                >
                  <Image source={{ uri: credit.poster_path }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute bottom-0 left-0 right-0 p-2.5 bg-black/60">
                    <Text className="text-white text-xs font-bold" numberOfLines={1}>{credit.title}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <Ionicons name="star" size={10} color={colors.star} />
                      <Text className="text-white text-[9px]">{credit.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
