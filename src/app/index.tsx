import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { sampleMovies } from "../../sample/data";
import TrendingMovie from "../components/section/TrendingMovie";

export default function Index() {
  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className="mb-3">
        <StatusBar barStyle="light-content" />
        <View className="flex-row justify-between items-center mx-4">
          <TouchableOpacity>
            <Ionicons size={30} color="white" name="menu" />
          </TouchableOpacity>
          <Text className="text-white text-3xl font-extrabold">
            <Text className="text-yellow-500">M</Text>ovies
          </Text>
          <TouchableOpacity>
            <Ionicons name="search" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TrendingMovie movies={sampleMovies} />
      </ScrollView>
    </View>
  );
}
