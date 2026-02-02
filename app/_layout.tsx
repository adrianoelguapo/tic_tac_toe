import * as eva from "@eva-design/eva";
import { Jersey10_400Regular, useFonts } from "@expo-google-fonts/jersey-10";
import { ApplicationProvider } from "@ui-kitten/components";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { initDatabase } from "../utils/database";

/* --- Esto evita que la pantalla de inicio se cierre automáticamente --- */
SplashScreen.preventAutoHideAsync();

/* --- Configuración de la pantalla de inicio --- */
export const unstable_settings = {

  /* --- Ruta de la pantalla de inicio --- */
  anchor: "/",

};

/* --- Componente principal de la aplicación --- */
export default function RootLayout() {

  /* --- Importar fuente --- */
  const [fontsLoaded] = useFonts({Jersey10_400Regular});

  /* --- Cuando se monte el componente, se inicia la base de datos si la fuente se ha cargado --- */
  useEffect(() => {

    if (fontsLoaded) {

      initDatabase().then(() => {

          SplashScreen.hideAsync();

        }).catch((error) => {

          /* --- En caso de error, log de error --- */
          console.error("Failed to initialize database:", error);
          SplashScreen.hideAsync();

        });

    }

  }, [fontsLoaded]);

  /* --- Si la fuente no se ha cargado, no se mostrará nada --- */
  if (!fontsLoaded) {

    return null;

  }

  return (

    /* --- Componente que envuelve toda la aplicación --- */
    <ApplicationProvider {...eva} theme={eva.light}>

      <Stack screenOptions = {{ headerShown: false }}>

        {/* --- Vistas de la aplicación --- */}
        <Stack.Screen name = "index"/>{/* --- Vista de inicio --- */}
        <Stack.Screen name = "menu"/>{/* --- Vista de menú --- */}
        <Stack.Screen name = "new-game"/>{/* --- Vista de nueva partida --- */}
        <Stack.Screen name = "scores"/>{/* --- Vista de puntuaciones --- */}
        <Stack.Screen name = "game"/>{/* --- Vista de juego --- */}

      </Stack>

      <StatusBar style = "dark" />

    </ApplicationProvider>

  );

}