import React from "react";
import { Dimensions, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import type { Movie } from "../../types/movie";
import MovieCard from "../item/MovieCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6;
const CARD_HEIGHT = CARD_WIDTH * 1.5;

type Props = {
  movies: Movie[];
};

export default function TrendingMovie({ movies }: Props) {
  return (
    <View className="">
      <View className="flex-row justify-between items-center mx-4 ">
        <Text className="text-white text-2xl font-bold">Trending</Text>
      </View>
      <Carousel
        data={movies}
        width={width}
        height={CARD_HEIGHT}
        loop
        autoPlay
        autoPlayInterval={3000}
        scrollAnimationDuration={800}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.85,
          parallaxScrollingOffset: (width - CARD_WIDTH) / 2 + 0.5 * CARD_WIDTH,
        }}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center">
            <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
              <MovieCard movie={item} />
            </View>
          </View>
        )}
      />
    </View>
  );
}
