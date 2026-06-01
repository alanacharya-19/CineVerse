import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const SCHEDULED_KEY = "cineverse_notified_movies";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermission() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (final !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Movie Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  return true;
}

export async function scheduleReleaseNotification(
  movieId: number,
  title: string,
  releaseDate: string
) {
  const hasPermission = await requestPermission();
  if (!hasPermission) return false;

  const stored = await AsyncStorage.getItem(SCHEDULED_KEY);
  const scheduled: number[] = stored ? JSON.parse(stored) : [];

  if (scheduled.includes(movieId)) return false;

  const release = new Date(releaseDate);
  const now = new Date();

  if (release <= now) return false;

  const trigger = release;
  trigger.setHours(9, 0, 0, 0);

  if (trigger <= now) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Coming Soon to CineVerse",
      body: `${title} releases today!`,
      data: { movieId },
    },
    trigger: { date: trigger },
  });

  scheduled.push(movieId);
  await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(scheduled));
  return true;
}

export async function isScheduled(movieId: number) {
  const stored = await AsyncStorage.getItem(SCHEDULED_KEY);
  if (!stored) return false;
  const scheduled: number[] = JSON.parse(stored);
  return scheduled.includes(movieId);
}

export async function cancelNotification(movieId: number) {
  const stored = await AsyncStorage.getItem(SCHEDULED_KEY);
  if (!stored) return;
  const scheduled: number[] = JSON.parse(stored);
  const updated = scheduled.filter((id) => id !== movieId);
  await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(updated));
  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const id of updated) {
    const data = await AsyncStorage.getItem(`notify_data_${id}`);
    if (data) {
      const { title, releaseDate } = JSON.parse(data);
      await scheduleReleaseNotification(id, title, releaseDate);
    }
  }
}
