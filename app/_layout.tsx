import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemeProvider } from "@/context/ThemeContext";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="index" />
          <Stack.Screen name="todos/[id]" />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
