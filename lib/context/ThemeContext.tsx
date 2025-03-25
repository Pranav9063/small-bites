// import { createContext, useState, ReactNode } from "react";
// import { Appearance } from "react-native";
// import { Colors, Theme } from "@/constants/Theme";

// export interface ThemeContextType {
//     colorScheme: "light" | "dark" | null | undefined;
//     toggleTheme: React.Dispatch<React.SetStateAction<"light" | "dark" | null | undefined>>;
//     theme: Theme;
// }

// export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const ThemeProvider = ({ children }: { children: ReactNode }) => {
//     const [colorScheme, toggleTheme] = useState(Appearance.getColorScheme());

//     const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

//     return (
//         <ThemeContext.Provider value={{ colorScheme, toggleTheme, theme }}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };
