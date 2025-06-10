import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import ratImage from './assets/ratImage.png';
import Cheese from './assets/cheese.png';
import winImage from './assets/RatCheese.png';

// Maze component
const Maze = ({ matrix, ratPosition, showCheese }) => {
  return (
    <div className="matrix-container">
      {matrix.map((row, rowIndex) => (
        <div className="row" key={`row-${rowIndex}`}>
          {row.map((cell, cellIndex) => (
            <Cell
              key={`cell-${rowIndex}-${cellIndex}`}
              isPath={cell === 0}
              hasRat={rowIndex === ratPosition.row && cellIndex === ratPosition.col}
              hasCheese={showCheese && rowIndex === matrix.length - 1 && cellIndex === row.length - 1}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

Maze.propTypes = {
  matrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  ratPosition: PropTypes.shape({
    row: PropTypes.number,
    col: PropTypes.number
  }).isRequired,
  showCheese: PropTypes.bool
};

// Cell component
const Cell = ({ isPath, hasRat, hasCheese }) => {
  return (
    <div className={`cell ${isPath ? 'path' : 'wall'}`}>
      {hasRat && <img src={ratImage} alt="Rat" className="image" height={20} />}
      {hasCheese && <img src={Cheese} alt="Cheese" className="image" height={20} />}
    </div>
  );
};

Cell.propTypes = {
  isPath: PropTypes.bool,
  hasRat: PropTypes.bool,
  hasCheese: PropTypes.bool
};

// WinModal component
const WinModal = ({ onRestart }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <img src={winImage} alt="You Win" />
        <p>You've found the cheese! Congratulations!</p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  );
};

WinModal.propTypes = {
  onRestart: PropTypes.func.isRequired
};

// Main App component
function App() {
  const [ratPosition, setRatPosition] = useState({ row: 0, col: 0 });
  const [isGameWon, setIsGameWon] = useState(false);
  const [moveCount, setMoveCount] = useState(0);

  const checkWinCondition = useCallback((position) => {
    return position.row === matrix.length - 1 && position.col === matrix[0].length - 1;
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (isGameWon) return;

    const { row, col } = ratPosition;
    let newPosition = { ...ratPosition };

    switch (e.key) {
      case 'ArrowUp':
        if (row > 0 && matrix[row - 1][col] === 0) newPosition = { row: row - 1, col };
        break;
      case 'ArrowDown':
        if (row < matrix.length - 1 && matrix[row + 1][col] === 0) newPosition = { row: row + 1, col };
        break;
      case 'ArrowLeft':
        if (col > 0 && matrix[row][col - 1] === 0) newPosition = { row, col: col - 1 };
        break;
      case 'ArrowRight':
        if (col < matrix[0].length - 1 && matrix[row][col + 1] === 0) newPosition = { row, col: col + 1 };
        break;
      default:
        return;
    }

    if (newPosition.row !== ratPosition.row || newPosition.col !== ratPosition.col) {
      setRatPosition(newPosition);
      setMoveCount(prev => prev + 1);
      
      if (checkWinCondition(newPosition)) {
        setIsGameWon(true);
      }
    }
  }, [ratPosition, isGameWon, checkWinCondition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleRestart = () => {
    setRatPosition({ row: 0, col: 0 });
    setIsGameWon(false);
    setMoveCount(0);
  };

  return (
    <div className="container">
      <div className="game-info">Moves: {moveCount}</div>
      <Maze 
        matrix={matrix} 
        ratPosition={ratPosition} 
        showCheese={!isGameWon} 
      />
      {isGameWon && <WinModal onRestart={handleRestart} />}
    </div>
  );
}

export default App;
