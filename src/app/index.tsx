import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sampleMovies } from "../../sample/data";
import { upcomingMovies } from "../../sample/upcoming-data";
import { colors } from "../constants/colors";
import TrendingMovie from "../components/section/TrendingMovie";
import UpcomingMovies from "../components/section/UpcomingMovies";
import CategoryMovies from "../components/section/CategoryMovies";

export default function Index() {
  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView className="mb-3">
        <StatusBar barStyle="light-content" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity>
            <Ionicons name="menu" size={30} color={colors.text} />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-extrabold">
            <Text style={{ color: colors.accent }}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => router.push("/search")}>
            <Ionicons name="search" size={30} color={colors.text} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TrendingMovie movies={sampleMovies} />
        <UpcomingMovies movies={upcomingMovies} />
        <CategoryMovies movies={sampleMovies} />
      </ScrollView>
    </View>
  );
}
