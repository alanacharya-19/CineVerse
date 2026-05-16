import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { colors } from "../../constants/colors";

type Props = {
  className?: string;
  style?: any;
};

export default function Skeleton({ className, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      className={className}
      style={[{ opacity, backgroundColor: colors.border }, style]}
    />
  );
}
