import { Colors } from "@/constants/theme";
import React, { createContext, useState } from "react";
import { Appearance } from "react-native";

export type ColorSchemeTypes = "light" | "dark" | null | undefined;

export interface ContextTypes {
  colorScheme: ColorSchemeTypes;
  setColorScheme: React.Dispatch<
    React.SetStateAction<ColorSchemeTypes>
  >;
  theme: typeof Colors.light | typeof Colors.dark;
}

export const ThemeContext = createContext<ContextTypes>({
  colorScheme: Appearance.getColorScheme(),
  setColorScheme: () => {},
  theme: Colors.light,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeTypes>(Appearance.getColorScheme);

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
