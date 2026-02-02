export type Player = "X" | "O" | null;
export type Board = Player[];

/* --- Método para verificar si en ese turno hay un ganador --- */
export function checkWinner(board: Board): Player {

  /* --- Combinaciones ganadoras --- */
  const winPatterns = [

    [0, 1, 2], /* --- Fila superior --- */
    [3, 4, 5], /* --- Fila central --- */
    [6, 7, 8], /* --- Fila inferior --- */
    [0, 3, 6], /* --- Columna izquierda --- */
    [1, 4, 7], /* --- Columna central --- */
    [2, 5, 8], /* --- Columna derecha --- */
    [0, 4, 8], /* --- Primera diagonal --- */
    [2, 4, 6], /* --- Segunda diagonal --- */
    
  ];

  /* --- Se recorren las combinaciones ganadoras --- */
  for (const pattern of winPatterns) {

    /* --- Se divide la combinación ganadora en tres variables --- */
    const [a, b, c] = pattern;

    /* --- Si todas las posiciones tienen el mismo valor, se devuelve el valor de la celda del ganador --- */
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {

      return board[a];

    }

  }

  return null;

}

/* --- Método para verificar si el tablero está lleno --- */
export function isBoardFull(board: Board): boolean {

  /* --- Si ninguna celda está vacía, se devuelve true --- */
  return board.every((cell) => cell !== null);

}

/* --- Método para obtener los movimientos disponibles --- */
export function getAvailableMoves(board: Board): number[] {

  /* --- Se mapea el tablero y se devuelven los índices de las celdas vacías --- */
  return board.map((cell, index) => (cell === null ? index : -1)).filter((i) => i !== -1);

}

/* --- Método que maneja la lógica de la IA en el modo fácil (se moverá a una posición aleatoria) --- */
export function getEasyAIMove(board: Board): number {

  /* --- Se obtienen los movimientos disponibles --- */
  const availableMoves = getAvailableMoves(board);

  /* --- Si no hay movimientos disponibles, no se hará ningún movimiento --- */
  if (availableMoves.length === 0) return -1;

  /* --- Se obtiene un índice aleatorio de los movimientos disponibles --- */
  const randomIndex = Math.floor(Math.random() * availableMoves.length);

  /* --- Se devuelve el movimiento aleatorio --- */
  return availableMoves[randomIndex];

}

/* --- Método que maneja la lógica de la IA en el modo difícil (se moverá de forma óptima) --- */
/* --- El algoritmo no es mío, se ha modificado un poco pero me he basado en gran parte en: ---

        - https://github.com/LawnDrift/Tic-Tac-Toe-with-Minimax/blob/master/minimax-tic-tac-toe/tic_tac_toe.js
    
  --- Este código que he utilizado implementa el algoritmo minimax, que elige la mejor jugada suponiendo que el oponente también jugará su mejor jugada ---
*/
export function getHardAIMove(board: Board): number {
  
  const aiPlayer: Player = "X";
  const humanPlayer: Player = "O";

  function minimax(currentBoard: Board, depth: number, isMaximizing: boolean): number {

    const winner = checkWinner(currentBoard);

    if (winner === aiPlayer) return 10 - depth;
    if (winner === humanPlayer) return depth - 10;
    if (isBoardFull(currentBoard)) return 0;

    if (isMaximizing) {

      let bestScore = -Infinity;
      const moves = getAvailableMoves(currentBoard);

      for (const move of moves) {

        const newBoard = [...currentBoard];
        newBoard[move] = aiPlayer;
        const score = minimax(newBoard, depth + 1, false);
        bestScore = Math.max(score, bestScore);

      }

      return bestScore;

    } else {
      
      let bestScore = Infinity;
      const moves = getAvailableMoves(currentBoard);

      for (const move of moves) {

        const newBoard = [...currentBoard];
        newBoard[move] = humanPlayer;

        const score = minimax(newBoard, depth + 1, true);
        bestScore = Math.min(score, bestScore);

      }

      return bestScore;

    }

  }

  let bestMove = -1;
  let bestScore = -Infinity;
  const moves = getAvailableMoves(board);

  for (const move of moves) {

    const newBoard = [...board];
    newBoard[move] = aiPlayer;

    const score = minimax(newBoard, 0, false);

    if (score > bestScore) {

      bestScore = score;
      bestMove = move;

    }

  }

  return bestMove;

}
