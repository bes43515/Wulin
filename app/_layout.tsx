import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GameProvider } from "@/lib/game-store";
import "../global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </GameProvider>
    </GestureHandlerRootView>
  );
}
