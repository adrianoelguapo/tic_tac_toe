import { Layout } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { HexBackground } from "../components/HexBackground";
import { ImageButton } from "../components/ImageButton";

/* --- Vista de inicio --- */
export default function HomeScreen() {

  /* --- Se crea una instancia del Router de React para poder navegar entre vistas --- */
  const router = useRouter();

  return (

    /* --- Componente que añade la imagen de fondo --- */
    <HexBackground>

      {/* --- Layout que contiene los elementos de la pantalla --- */}
      <Layout style = {styles.container}>

        {/* --- Contenedor que centra los elementos --- */}
        <View style = {styles.content}>

          {/* --- Contenedor de la imagen principal --- */}
          <View style = {styles.logoContainer}>

            {/* --- Imagen principal --- */}
            <Image source = {require("../assets/game-images/hero-image.png")} style = {styles.heroImage} resizeMode = "contain" />

          </View>

          {/* --- Contenedor del botón --- */}
          <View style = {styles.buttonContainer}>

            {/* --- Botón para ir al menú --- */}
            <ImageButton onPress = {() => router.push("/menu")}>Start</ImageButton>

          </View>

        </View>

      </Layout>

    </HexBackground>

  );

}

/* --- Estilos de la pantalla de inicio --- */
const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: "transparent",

  },

  content: {

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,

  },

  logoContainer: {

    alignItems: "center",
    marginBottom: 60,
    width: "100%",

  },

  heroImage: {

    width: 350,
    height: 250,

  },

  buttonContainer: {

    width: "100%",
    maxWidth: 300,

  },

});