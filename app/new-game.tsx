import { Layout, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ImageBackground, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { HexBackground } from "../components/HexBackground";
import { ImageButton } from "../components/ImageButton";

/* --- Vista de Nueva Partida --- */
export default function NewGameScreen() {

  /* --- Se crea una instancia del Router de React para poder navegar entre vistas --- */
  const router = useRouter();

  /* --- Guardar el nombre del jugador --- */
  const [playerName, setPlayerName] = useState("");

  /* --- Guardar la dificultad seleccionada --- */
  const [difficulty, setDifficulty] = useState<"easy" | "hard">("easy");

  /* --- Método que maneja el inicio del juego --- */
  const handleStartGame = () => {

    /* --- Se guarda el nombre del jugador --- */
    const name = playerName.trim() || "Player";

    /* --- Se navega a la vista de juego dependiendo de la dificultad seleccionada --- */
    router.push(`/game?name=${encodeURIComponent(name)}&mode=${difficulty}`);

  };

  return (

    /* --- Componente que añade la foto de fondo --- */
    <HexBackground>

      {/* --- Layout que contiene los elementos de la vista --- */}
      <Layout style = {styles.container}>

        {/* --- Contenedor que centra los elementos --- */}
        <View style = {styles.content}>

          {/* --- Contenedor del título --- */}
          <View style = {styles.titleContainer}>

            {/* --- Imagen del título --- */}
            <Image source = {require("../assets/game-images/newgame.png")} style = {styles.titleImage} resizeMode = "contain"/>

          </View>

          {/* --- Contenedor del formulario --- */}
          <View style = {styles.formContainer}>

            {/* --- Label del nombre del jugador --- */}
            <Text style = {styles.label}>Player Name</Text>

            {/* --- Fondo del input de texto --- */}
            <ImageBackground source = {require("../assets/game-images/button.png")} style = {styles.inputBackground} resizeMode = "stretch">

              {/* --- Input de texto para introducir el nombre del jugador --- */}
              <TextInput style = {styles.input} placeholder = "Enter your name" placeholderTextColor = "#CCCCCC" value = {playerName} onChangeText = {setPlayerName}/>

            </ImageBackground>

            {/* --- Label de la dificultad --- */}
            <Text style = {styles.label}>Difficulty</Text>

            {/* --- Contenedor de los botones de dificultad --- */}
            <View style = {styles.difficultyContainer}>

              {/* --- Botón para seleccionar el modo fácil --- */}
              <TouchableOpacity onPress = {() => setDifficulty("easy")} style = {styles.difficultyButton} activeOpacity = {0.8}>

                {/* --- Imagen del modo fácil --- */}
                <Image source = {require("../assets/game-images/easy_mode.png")} style = {[styles.difficultyImage, difficulty === "easy" && styles.difficultyImageActive]} resizeMode = "contain"/>

              </TouchableOpacity>

              {/* --- Botón para seleccionar el modo difícil --- */}
              <TouchableOpacity onPress = {() => setDifficulty("hard")} style = {styles.difficultyButton} activeOpacity = {0.8}>

                {/* --- Imagen del modo difícil --- */}
                <Image source = {require("../assets/game-images/hard_mode.png")} style = {[styles.difficultyImage, difficulty === "hard" && styles.difficultyImageActive]} resizeMode = "contain"/>

              </TouchableOpacity>

            </View>

          </View>

          {/* --- Contenedor de los botones --- */}
          <View style = {styles.buttonContainer}>

            <ImageButton onPress = {handleStartGame}>Start Game</ImageButton>{/* --- Botón para iniciar el juego --- */}
            <ImageButton onPress = {() => router.back()}>Back</ImageButton>{/* --- Botón para volver al menú principal --- */}

          </View>

        </View>

      </Layout>

    </HexBackground>

  );

}

/* --- Estilos de la pantalla de nueva partida --- */
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
    marginBottom: 40,

  },

  titleImage: {

    width: 300,
    height: 60,

  },

  formContainer: {

    width: "100%",
    maxWidth: 300,
    marginBottom: 40,

  },

  label: {

    marginTop: 16,
    marginBottom: 8,
    fontSize: 24,
    fontFamily: "Jersey10_400Regular",
    color: "#FFFFFF",

  },

  inputBackground: {

    width: "100%",
    height: 60,
    justifyContent: "center",
    marginBottom: 16,

  },

  input: {

    fontFamily: "Jersey10_400Regular",
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    paddingHorizontal: 20,
    marginTop: -6,

  },

  difficultyContainer: {

    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 16,

  },

  difficultyButton: {

    flex: 1,
    maxWidth: 150,

  },

  difficultyImage: {

    width: "100%",
    height: 50,
    opacity: 0.6,

  },

  difficultyImageActive: {

    opacity: 1,

  },

  buttonContainer: {

    width: "100%",
    maxWidth: 300,

  },

});