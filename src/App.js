import React, { useState, useEffect } from 'react';
import './App.css'; // Create a CSS file for styling if needed
import ratImage from './assets/ratImage.png';
import Cheese from './assets/cheese.png';
import winImage from './assets/RatCheese.png';


const matrix1 = [
  [0, 0, 0, 1],
  [1, 1, 0, 0],
  [0, 1, 1, 0],
  [0, 0, 1, 0]
];
const matrix = [
  [0,0,0,0,1,1,0,0],
  [1,1,1,0,0,1,1,1],
  [1,0,0,0,1,0,0,0],
  [1,0,1,0,1,0,1,0],
  [0,0,0,1,1,0,1,0],
  [0,1,0,0,0,0,1,0],
  [0,1,0,1,0,1,1,0],
  [0,1,0,1,0,0,1,0]
  
];

function App() {


  const [ratPosition, setRatPosition] = useState({ row: 0, col: 0 });

  const [isGameWon, setIsGameWon] = useState(false);




  // Handle keydown event
  useEffect(() => {
    const handleKeyDown = (e) => {
      const { row, col } = ratPosition;
      switch (e.key) {
        case 'ArrowUp':
          if (row > 0 && matrix[row - 1][col] === 0) {
            setRatPosition({ row: row - 1, col });
          }
          break;
        case 'ArrowDown':
          if (row < matrix.length - 1 && matrix[row + 1][col] === 0) {
            setRatPosition({ row: row + 1, col });
          }
          break;
        case 'ArrowLeft':
          if (col > 0 && matrix[row][col - 1] === 0) {
            setRatPosition({ row, col: col - 1 });
          }
          break;
        case 'ArrowRight':
          if (col < matrix[0].length - 1 && matrix[row][col + 1] === 0) {
            setRatPosition({ row, col: col + 1 });
          }
          break;
        default:
          break;
      }
    };
    if (ratPosition.row === 7 && ratPosition.col === 7) {
      setIsGameWon(true);
      window.removeEventListener('keydown', handleKeyDown); // Stop listening for further moves
    }

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

  }, [ratPosition]);

  const handleRestart = () => {
    setRatPosition({ row: 0, col: 0 });
    setIsGameWon(false);

  };
  

  return (
   <div className='container'> 
    <div className="matrix-container">
   {matrix.map((row, rowIndex) => (
     <div className="row" key={rowIndex}>
       {row.map((cell, cellIndex) => (
         <div
           className="cell"
           key={cellIndex}
           style={{
             backgroundColor: cell === 0 ? 'white' : 'black',

           }}
         >
           {/* Display the rat image based on its position */}
           {rowIndex === ratPosition.row && cellIndex === ratPosition.col ? (
             <img src={ratImage} alt="Rat" className="image" height={20} />
           ) : null}

           {/* Display the cheese image in the last cell */}
           {rowIndex === 7 && cellIndex === 7 && !isGameWon ? (
             <img src={Cheese} alt="Cheese" className="image" height={20} />
           ) : null}
         </div>
       ))}
     </div>
   ))}

   {/* Render win pop-up if game is won */}
   {isGameWon && (
     <div className="modal">
       <div className="modal-content">
         <img src={winImage} alt="You Win" />
         <p>You've found the b cheese! Congratulations!</p>
         <button onClick={handleRestart}>Restart</button>
       </div>
     </div>
   )}
 </div>
 </div>
  );
}

export default App;

