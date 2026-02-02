import { Layout, List, Text } from "@ui-kitten/components";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { HexBackground } from "../components/HexBackground";
import { ImageButton } from "../components/ImageButton";
import { formatTime, getScoresByMode } from "../utils/database";

/* --- Estructura que tendrá cada puntuación --- */
interface Score {

  id?: number;
  name: string;
  mode: "easy" | "hard";
  time: number;

}

/* --- Vista de puntuaciones --- */
export default function ScoresScreen() {

  /* --- Se crea una instancia del Router de React para poder navegar entre vistas --- */
  const router = useRouter();

  /* --- Guardar el modo seleccionado --- */
  const [selectedMode, setSelectedMode] = useState<"easy" | "hard">("easy");

  /* --- Guardar las puntuaciones del modo fácil --- */
  const [easyScores, setEasyScores] = useState<Score[]>([]);

  /* --- Guardar las puntuaciones del modo difícil --- */
  const [hardScores, setHardScores] = useState<Score[]>([]);

  /* --- Cuando se monte la vista, se cargan las puntuaciones --- */
  useEffect(() => {

    loadScoresData();

  }, []);

  /* --- Función que carga las puntuaciones --- */
  const loadScoresData = async () => {

    const easy = await getScoresByMode("easy");
    const hard = await getScoresByMode("hard");

    setEasyScores(easy);
    setHardScores(hard);

  };

  const currentScores = selectedMode === "easy" ? easyScores : hardScores;

  /* --- Función que renderiza cada puntuación --- */
  const renderScoreItem = ({item, index}: {item: Score; index: number}) => (

    /* --- Añadir la imagen de fondo de cada puntuación --- */
    <ImageBackground source = {require("../assets/game-images/button.png")} style = {styles.scoreCard} resizeMode = "stretch">

      {/* --- Contenedor donde se encuentran los elementos de la puntuación --- */}
      <View style = {styles.scoreContent}>

        {/* --- Posición, nombre y tiempo del jugador que ha puntuado --- */}
        <Text style = {styles.rank}>#{index + 1}</Text>
        <Text style = {styles.playerName}>{item.name}</Text>
        <Text style = {styles.time}>{formatTime(item.time)}</Text>

      </View>

    </ImageBackground>

  );

  return (

    /* --- Componente que añade la foto de fondo --- */
    <HexBackground>

      {/* --- Layout que contiene los elementos de la pantalla --- */}
      <Layout style = {styles.container}>

        {/* --- Contenedor que centra los elementos --- */}
        <View style = {styles.content}>

          {/* --- Contenedor del título --- */}
          <View style = {styles.titleContainer}>

            {/* --- Imagen del título --- */}
            <Image source = {require("../assets/game-images/scores.png")} style = {styles.titleImage} resizeMode = "contain"/>

          </View>

          {/* --- Contenedor de los botones --- */}
          <View style = {styles.tabContainer}>

            {/* --- Botón para ver las puntuaciones del modo fácil --- */}
            <TouchableOpacity onPress = {() => setSelectedMode("easy")} style = {styles.tabButton} activeOpacity = {0.8}>

              {/* --- Imagen del texto del modo fácil --- */}
              <Image source = {require("../assets/game-images/easy_mode.png")} style = {[styles.tabImage,selectedMode === "easy" && styles.tabImageActive]} resizeMode = "contain"/>
            
            </TouchableOpacity>

            {/* --- Botón para ver las puntuaciones el modo difícil --- */}
            <TouchableOpacity onPress = {() => setSelectedMode("hard")} style = {styles.tabButton} activeOpacity = {0.8}>

              {/* --- Imagen del texto del modo difícil --- */}
              <Image source = {require("../assets/game-images/hard_mode.png")} style = {[styles.tabImage,selectedMode === "hard" && styles.tabImageActive]} resizeMode = "contain"/>

            </TouchableOpacity>

          </View>

          {/* --- Contenedor de las puntuaciones --- */}
          <View style = {styles.scoresContainer}>

            {/* --- Si no hay puntuaciones, muestra un mensaje --- */}
            {currentScores.length === 0 ? (<Text style = {styles.emptyText}>No scores yet</Text>) : (<List data = {currentScores} renderItem = {renderScoreItem} style = {styles.list}/>)}

          </View>

          {/* --- Contenedor del botón de volver --- */}
          <View style = {styles.buttonContainer}>

            {/* --- Botón para volver al menú principal --- */}
            <ImageButton onPress = {() => router.back()}>Back</ImageButton>

          </View>

        </View>

      </Layout>

    </HexBackground>

  );

}

/* --- Estilos de la pantalla de puntuaciones --- */
const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: "transparent",

  },

  content: {

    flex: 1,
    padding: 20,

  },

  titleContainer: {

    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,

  },

  titleImage: {

    width: 250,
    height: 60,

  },

  tabContainer: {

    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 20,

  },

  tabButton: {

    flex: 1,
    maxWidth: 150,

  },

  tabImage: {

    width: "100%",
    height: 50,
    opacity: 0.6,

  },

  tabImageActive: {

    opacity: 1,

  },

  scoresContainer: {

    flex: 1,

  },

  list: {

    backgroundColor: "transparent",

  },

  scoreCard: {

    height: 70,
    marginVertical: 6,
    justifyContent: "center",

  },

  scoreContent: {

    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16,

  },

  rank: {

    fontFamily: "Jersey10_400Regular",
    fontSize: 28,
    color: "#FFFFFF",
    width: 50,
    marginTop: -6,
    marginLeft: 10,

  },

  playerName: {

    flex: 1,
    fontFamily: "Jersey10_400Regular",
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: -6,

  },

  time: {

    fontFamily: "Jersey10_400Regular",
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: -6,
    marginRight: 10,

  },

  emptyText: {

    fontFamily: "Jersey10_400Regular",
    fontSize: 20,
    textAlign: "center",
    marginTop: 40,
    color: "#FFFFFF",

  },

  buttonContainer: {

    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
    marginTop: 20,

  },

});