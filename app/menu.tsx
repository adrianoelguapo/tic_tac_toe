import { Layout } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
import { HexBackground } from "../components/HexBackground";
import { ImageButton } from "../components/ImageButton";

/* --- Vista del menú --- */
export default function MenuScreen() {

  /* --- Se crea una instancia del Router de React para poder navegar entre vistas --- */
  const router = useRouter();

  return (

    /* --- Componente que añade la imagen de fondo --- */
    <HexBackground>

      {/* --- Layout que contiene los elementos de la pantalla --- */}
      <Layout style = {styles.container}>

        {/* --- Contenedor que centra los elementos --- */}
        <View style = {styles.content}>

          {/* --- Contenedor del título --- */}
          <View style = {styles.titleContainer}>

            {/* --- Imagen del título --- */}
            <Image source = {require("../assets/game-images/mainmenu.png")} style = {styles.titleImage} resizeMode = "contain"/>

          </View>

          {/* --- Contenedor de los botones --- */}
          <View style = {styles.buttonContainer}>

            <ImageButton onPress = {() => router.push("/new-game")}>Play</ImageButton>{/* --- Botón para iniciar una nueva partida --- */}
            <ImageButton onPress = {() => router.push("/scores")}>Scores</ImageButton>{/* --- Botón para ver las puntuaciones --- */}
            <ImageButton onPress = {() => router.push("/")}>Back</ImageButton>{/* --- Botón para volver al menú principal --- */}

          </View>

        </View>

      </Layout>

    </HexBackground>

  );

}

/* --- Estilos de la pantalla de menú --- */
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

  titleContainer: {

    alignItems: "center",
    marginBottom: 60,

  },

  titleImage: {

    width: 300,
    height: 80,

  },

  buttonContainer: {

    width: "100%",
    maxWidth: 300,

  },

});