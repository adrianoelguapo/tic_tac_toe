import { Layout, Text } from "@ui-kitten/components";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import { HexBackground } from "../components/HexBackground";
import { ImageButton } from "../components/ImageButton";
import { saveScore } from "../utils/database";
import { Board, Player, checkWinner, getEasyAIMove, getHardAIMove, isBoardFull } from "../utils/game-logic";

/* --- Dimensiones del tablero --- */
const BOARD_SIZE = Math.min(Dimensions.get("window").width - 80, 400);

/* --- Tamaño de cada celda --- */
const CELL_SIZE = BOARD_SIZE / 3;

/* --- Vista de juego --- */
export default function GameScreen() {

  /* --- Se crea una instancia del Router de React para poder navegar entre vistas --- */
  const router = useRouter();

  /* --- Guardar los parámetros de la ruta de la pantalla anterior --- */
  const params = useLocalSearchParams();

  /* --- Guardar el nombre del jugador y la dificultad del juego --- */
  const playerName = (params.name as string) || "Player";
  const difficulty = (params.mode as string) || "easy";

  /* --- Iniciar el tablero con las celdas vacías --- */
  const [board, setBoard] = useState<Board>(Array(9).fill(null));

  /* --- Determinar si es el turno del jugador --- */
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  /* --- Determinar si el juego ha terminado --- */
  const [gameOver, setGameOver] = useState(false);

  /* --- Determinar el ganador --- */
  const [winner, setWinner] = useState<Player>(null);

  /* --- Mensaje de estado --- */
  const [statusMessage, setStatusMessage] = useState("Your turn");

  /* --- Tiempo del juego --- */
  const [timer, setTimer] = useState(0);

  /* --- Referencia al temporizador --- */
  const timerRef = useRef<number | null>(null);

  /* --- Iniciar el temporizador --- */
  useEffect(() => {

    /* --- Si el juego no ha terminado, se inicia el temporizador --- */
    if (!gameOver) {

      /* --- Se inicia el temporizador --- */
      timerRef.current = setInterval(() => {

        setTimer((prev) => prev + 1);

      }, 1000);

    } else {

      /* --- Si el juego ha terminado, se detiene el temporizador --- */
      if (timerRef.current) {

        /* --- Se detiene el temporizador --- */
        clearInterval(timerRef.current);

      }

    }

    return () => {

      /* --- Si el temporizador está activo, se detiene en caso de que el componente rompa --- */
      if (timerRef.current) {

        /* --- Se detiene el temporizador --- */
        clearInterval(timerRef.current);

      }

    };

  }, [gameOver]);

  /* --- Iniciar el turno de la máquina --- */
  useEffect(() => {

    /* --- Si no es el turno del jugador y el juego no ha terminado, se inicia el turno de la máquina --- */
    if (!isPlayerTurn && !gameOver) {

      /* --- Se inicia el temporizador --- */
      const timer = setTimeout(() => {

        /* --- Se hace la jugada de la máquina --- */
        makeAIMove();

      }, 500);

      /* --- Se detiene el temporizador --- */
      return () => clearTimeout(timer);

    }

  }, [isPlayerTurn, gameOver]);

  /* --- Verificar si hay un ganador o empate --- */
  useEffect(() => {

    /* --- Se verifica si hay un ganador --- */
    const currentWinner = checkWinner(board);

    /* --- Si hay un ganador, se actualizan las variables del ganador y se detiene el juego --- */
    if (currentWinner) {

      /* --- Se actualiza el ganador --- */
      setWinner(currentWinner);

      /* --- Se actualiza el estado del juego --- */
      setGameOver(true);

      /* --- Si el ganador es el jugador, se actualiza el mensaje y se guarda la puntuación --- */
      if (currentWinner === "O") {

        /* --- Se actualiza el mensaje --- */
        setStatusMessage("You Win!");

        /* --- Se guarda la puntuación --- */
        saveGameScore();

      } else {

        /* --- Si el ganador es la máquina, se actualiza el mensaje --- */
        setStatusMessage("CPU Wins");

      }

    } else if (isBoardFull(board)) {

      /* --- Si el tablero está lleno, se actualiza el estado del juego y el mensaje --- */
      setGameOver(true);

      /* --- Se actualiza el mensaje --- */
      setStatusMessage("Draw");

    }

  }, [board]);

  /* --- Método que guarda una puntuación --- */
  const saveGameScore = async () => {

    try {

      /* --- Se almacena la puntuación en la base de datos --- */
      await saveScore({

        name: playerName,
        mode: difficulty as "easy" | "hard",
        time: timer,

      });

    } catch (error) {

      /* --- En caso de error, se envía un log de error a la consola--- */
      console.error("Failed to save score:", error);

    }

  };

  /* --- Método que maneja la jugada de la máquina --- */
  const makeAIMove = () => {

    /* --- Dependiendo de la dificultad, se elige llama al método para hacer una jugada aleatoria (modo fácil) o una jugada pensada (modo difícil) --- */
    const move = difficulty === "easy" ? getEasyAIMove(board) : getHardAIMove(board);

    /* --- Si la jugada es válida, se actualiza el tablero y se cambia el turno --- */
    if (move !== -1) {

      const newBoard = [...board];
      newBoard[move] = "X";
      setBoard(newBoard);
      setIsPlayerTurn(true);
      setStatusMessage("Your turn");

    }

  };

  /* --- Método que maneja la selección de una celda --- */
  const handleCellPress = (index: number) => {

    /* --- Si el juego ha terminado, la celda está ocupada o no es el turno del jugador, no se hace nada --- */
    if (gameOver || board[index] !== null || !isPlayerTurn) return;

    /* --- Crea un nuevo tablero con la jugada del jugador --- */
    const newBoard = [...board];
    newBoard[index] = "O";

    /* --- Actualiza el tablero y cambia el turno --- */
    setBoard(newBoard);
    setIsPlayerTurn(false);
    setStatusMessage("CPU turn...");

  };

  /* --- Método que maneja el reinicio del juego --- */
  const handleReset = () => {

    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setStatusMessage("Your turn");
    setTimer(0);

  };

  /* --- Método que formatea el tiempo --- */
  const formatTime = (seconds: number) => {

    /* --- Calcula los minutos y los segundos --- */
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    /* --- Formatea el tiempo a formato mm:ss poniendo ceros a la izquierda para rellenar si es necesario --- */
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  };

  /* --- Método que carga cada celda del tablero --- */
  const renderCell = (index: number) => {

    /* --- Calcula la fila y la columna de la celda --- */
    const row = Math.floor(index / 3);
    const col = index % 3;
    const value = board[index];

    return (

      /* --- Celda del tablero --- */
      <TouchableOpacity key = {index} style = {[styles.cellContainer, {top: row * CELL_SIZE, left: col * CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE,}]} onPress = {() => handleCellPress(index)} activeOpacity = {0.7}>

        {/* --- Imagen de fondo de la celda --- */}
        <ImageBackground source = {require("../assets/game-images/board-cell.png")} style = {styles.cell} resizeMode = "contain">

          {/* --- Si la celda está ocupada por la máquina, se muestra la ficha de la máquina --- */}
          {value === "X" && (<Image source = {require("../assets/game-images/red_bee.png")} style = {styles.beeImage} resizeMode = "contain"/>)}

          {/* --- Si la celda está ocupada por el jugador, se muestra la ficha del jugador --- */}
          {value === "O" && (<Image source = {require("../assets/game-images/blue-bee.png")} style = {styles.beeImage} resizeMode = "contain"/>)}

        </ImageBackground>

      </TouchableOpacity>

    );

  };

  return (

    /* --- Componente que añade la foto de fondo --- */
    <HexBackground>

      {/* --- Layout que contiene los elementos de la vista --- */}
      <Layout style = {styles.container}>

        {/* --- Contenedor que ocupa toda el alto de la vista --- */}
        <View style = {styles.fullHeight}>

          {/* --- Header de la vista --- */}
          <View style = {styles.header}>

            {/* --- Imagen de título --- */}
            <Image source = {require("../assets/game-images/buzzboard.png")} style = {styles.headerTitle} resizeMode = "contain"/>

            {/* --- Crono para llevar el tiempo --- */}
            <Text style = {styles.timer}>{formatTime(timer)}</Text>

          </View>

          {/* --- Contenedor de todos los elementos del juego --- */}
          <View style = {styles.gameContainer}>

            {/* --- Tablero --- */}
            <View style = {[styles.board, {width: BOARD_SIZE, height: BOARD_SIZE}]}>

              {/* --- Se cargan las nueve celdas --- */}
              {Array.from({length: 9}).map((_, index) => renderCell(index))}

            </View>

            {/* --- Mensaje ya sea de turno, de victoria o de empate --- */}
            <Text style = {styles.statusText}>{statusMessage}</Text>

            {/* --- Contenedor de la información de los jugadores --- */}
            <View style = {styles.playersContainer}>

              {/* --- Información del jugador --- */}
              <View style = {styles.playerInfo}>

                <Image source = {require("../assets/game-images/blue-bee.png")} style = {styles.playerBee} resizeMode = "contain"/>{/* --- Imagen de la ficha del jugador --- */}
                <Text style = {styles.playerLabel}>YOU</Text>{/* --- Label del jugador --- */}

              </View>

              {/* --- Información de la máquina --- */}
              <View style = {styles.playerInfo}>

                <Image source = {require("../assets/game-images/red_bee.png")} style = {styles.playerBee} resizeMode = "contain"/>{/* --- Imagen de la ficha de la máquina --- */}
                <Text style = {styles.playerLabel}>CPU</Text>{/* --- Label de la máquina --- */}

              </View>

            </View>

            {/* --- Contenedor de los botones --- */}
            <View style = {styles.buttonContainer}>

              {/* --- Contenedor auxiliar para que la altura del botón sea la correcta --- */}
              <View style = {styles.buttonWrapper}>

                <ImageButton onPress = {() => router.push("/menu")}>Back</ImageButton>{/* --- Botón para volver al menú --- */}

              </View>

              {/* --- Contenedor auxiliar para que la altura del botón sea la correcta --- */}
              <View style = {styles.buttonWrapper}>

                <ImageButton onPress = {handleReset}>Reset</ImageButton>{/* --- Botón para reiniciar la partida --- */}

              </View>

            </View>

          </View>

        </View>

      </Layout>

    </HexBackground>

  );

}

/* --- Estilos de la vista de juego --- */
const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: "transparent",

  },

  fullHeight: {

    flex: 1,

  },

  header: {

    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 20,
    marginTop: 40,

  },

  headerTitle: {

    width: 300,
    height: 60,
    marginBottom: 8,

  },

  timer: {

    fontSize: 60,
    fontFamily: "Jersey10_400Regular",
    color: "#ffc825ff",
    marginTop: 4,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    textShadowColor: "#000000",

  },

  gameContainer: {

    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,

  },

  board: {

    position: "relative",
    marginBottom: 20,

  },

  cellContainer: {

    position: "absolute",
    padding: 4,

  },

  cell: {

    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  beeImage: {

    width: "80%",
    height: "80%",

  },

  statusText: {

    fontSize: 32,
    fontFamily: "Jersey10_400Regular",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFFFFF",

  },

  playersContainer: {

    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 300,
    marginBottom: 20,

  },

  playerInfo: {

    alignItems: "center",
    gap: 8,

  },

  playerBee: {

    width: 50,
    height: 50,

  },

  playerLabel: {

    fontFamily: "Jersey10_400Regular",
    fontSize: 24,
    color: "#FFFFFF",

  },

  buttonContainer: {

    width: "100%",
    maxWidth: 300,
    flexDirection: "row",
    gap: 10,

  },

  buttonWrapper: {

    flex: 1,

  },

});