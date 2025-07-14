import React, { useState } from 'react';
import './App.css';

/**
 * Modern, minimal React Tic Tac Toe game.
 * Features:
 *  - Play vs Computer or Human
 *  - Responsive, minimal board
 *  - Game status (winner, draw, current turn)
 *  - Game mode switch and Restart
 * Color palette and styling follows project requirements.
 */

// Helper functions
const EMPTY_BOARD = () => Array(9).fill(null);
const WIN_PATTERNS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diags
];

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns 'X', 'O', or null if there is not a winner yet */
  for (let pattern of WIN_PATTERNS) {
    const [a,b,c] = pattern;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) return squares[a];
  }
  return null;
}

// PUBLIC_INTERFACE
function isBoardFull(squares) {
  return squares.every(Boolean);
}

// PUBLIC_INTERFACE
function getAvailableMoves(board) {
  return board.map((val, idx) => val ? null : idx).filter(x => x !== null);
}

// PUBLIC_INTERFACE
function getRandomComputerMove(board) {
  // Simple: random available cell - plenty for tic tac toe
  const available = getAvailableMoves(board);
  return available[Math.floor(Math.random() * available.length)];
}

// Square Component (stateless, minimal)
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : 'Empty cell'}
      tabIndex={0}
      style={{ fontWeight: highlight ? 700 : 400 }}
      data-testid="ttt-square"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onCellClick, winnerLine }) {
  // 3x3 grid
  return (
    <div className="ttt-board">
      {[0,1,2].map(r =>
        <div className="ttt-row" key={r}>
          {[0,1,2].map(c => {
            const idx = r*3 + c;
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onCellClick(idx)}
                highlight={winnerLine && winnerLine.includes(idx)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // UI State: 'player' mode or 'computer' mode
  const [mode, setMode] = useState('computer'); // 'player' | 'computer'
  const [board, setBoard] = useState(EMPTY_BOARD());
  const [xIsNext, setXIsNext] = useState(true); // X always starts
  const [gameOver, setGameOver] = useState(false);
  const [winnerLine, setWinnerLine] = useState(null);

  // Game status & logic
  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : isBoardFull(board)
      ? "It's a draw!"
      : `Turn: ${xIsNext ? "X" : "O"}`;

  // Highlight winning line
  React.useEffect(() => {
    if (!winner) {
      setWinnerLine(null);
      return;
    }
    for (let pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        setWinnerLine(pattern);
        setGameOver(true);
        return;
      }
    }
    setWinnerLine(null);
  }, [board, winner]);

  // When mode changes, always restart game
  React.useEffect(() => { handleRestart(); }, [mode]);

  // Effect for computer's turn in "vs computer" mode
  React.useEffect(() => {
    if (mode === 'computer' && !winner && !gameOver && !xIsNext) {
      // Brief delay for realism
      const timer = setTimeout(() => {
        const move = getRandomComputerMove(board);
        if (move != null) handleCellClick(move);
      }, 400);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line
  }, [board, mode, xIsNext, gameOver, winner]);

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    if (gameOver || board[idx]) return;
    // If vs computer: O = computer
    if (mode === 'computer' && !xIsNext) return;

    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);

    if (calculateWinner(nextBoard) || isBoardFull(nextBoard)) {
      setGameOver(true);
      return;
    }
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(EMPTY_BOARD());
    setXIsNext(true);
    setGameOver(false);
    setWinnerLine(null);
  }

  // PUBLIC_INTERFACE
  function handleModeChange(e) {
    setMode(e.target.value);
  }

  return (
    <div className="App">
      <div className="ttt-statusbar"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.3rem 0 0.6rem 0',
          color: 'var(--text-primary)',
          fontWeight: 500,
          fontSize: '1.3rem'
        }}>
        {status}
      </div>
      <main className="ttt-main">
        <section className="ttt-board-area">
          <Board squares={board} onCellClick={handleCellClick} winnerLine={winnerLine} />
        </section>
        <section className="ttt-controls">
          <div className="ttt-mode-picker">
            <label>
              <input
                type="radio"
                value="computer"
                checked={mode === 'computer'}
                onChange={handleModeChange}
                aria-label="Play against computer"
                name="mode"
              />
              Vs Computer
            </label>
            <label>
              <input
                type="radio"
                value="player"
                checked={mode === 'player'}
                onChange={handleModeChange}
                aria-label="Play against another player"
                name="mode"
              />
              Two Players
            </label>
          </div>
          <button className="ttt-btn" onClick={handleRestart} aria-label="Restart game">
            Restart
          </button>
        </section>
      </main>
      <footer className="ttt-footer" style={{marginTop:'1.5rem',color:'#bdbdbd',fontSize:'0.96rem'}}>
        Tic Tac Toe – Light modern UI (React)
      </footer>
    </div>
  );
}

export default App;
