import { createContext, useState, ReactNode } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

export interface ThemeContextType {
    colorScheme: "light" | "dark" | null | undefined;
    setColorScheme: React.Dispatch<React.SetStateAction<"light" | "dark" | null | undefined>>;
    theme: typeof Colors.light | typeof Colors.dark;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

    const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ colorScheme, setColorScheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};
