import React, { useState, useEffect } from 'react';
import './App.css';

const Leaderboard = ({ showLeaderboard, setShowLeaderboard }) => {
  const [leaderboardData, setLeaderboardData] = useState({});

  useEffect(() => {
    const leaderboard = localStorage.getItem('leaderboard');
    if (leaderboard) {
      const parsedLeaderboard = JSON.parse(leaderboard);
      // Tri des joueurs selon la difficulté et le nombre de tentatives
      const sortedLeaderboard = {};
      Object.keys(parsedLeaderboard).forEach((difficulty) => {
        sortedLeaderboard[difficulty] = parsedLeaderboard[difficulty].sort((a, b) => {
          if (a.attempts === b.attempts) {
            return 0;
          }
          return a.attempts < b.attempts ? -1 : 1;
        });
      });
      setLeaderboardData(sortedLeaderboard);
    }
  }, []);
//Affiche le classement
  return (
    <div>
      <h2>Leaderboard</h2>
      <button onClick={() => setShowLeaderboard(!showLeaderboard)}>Retour au jeu</button>
      {Object.entries(leaderboardData).map(([difficulty, players]) => (
        <div key={difficulty}>
          <h3>{difficulty}</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {index + 1}. {player.username} - {player.attempts} attempts
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const Game = () => {
  const [username, setUsername] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [intervalStart, setIntervalStart] = useState(1);
  const [intervalEnd, setIntervalEnd] = useState(10);
  const [randomNumber, setRandomNumber] = useState(null);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [leaderboardData, setLeaderboardData] = useState({});
  const [gameStarted, setGameStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fonction pour démarrer le jeu
  const startGame = () => {
    if (username === '') {
      setError('Veuillez entrer un nom d\'utilisateur.');
      return;
    }
    setError('');
    setGameStarted(true);
    setRandomNumber(generateRandomNumber(intervalStart, intervalEnd));
    setAttempts(0);
    setGuess('');
    setMessage('');
  };

  // Charger le leaderboard depuis le stockage local
  useEffect(() => {
    const leaderboard = localStorage.getItem('leaderboard');
    if (leaderboard) {
      setLeaderboardData(JSON.parse(leaderboard));
    }
  }, []);

  // Mettre à jour le nombre aléatoire lorsqu'on change les intervalles
  useEffect(() => {
    setRandomNumber(generateRandomNumber(intervalStart, intervalEnd));
  }, [intervalStart, intervalEnd]);

  // Fonction pour générer un nombre aléatoire dans un intervalle
  const generateRandomNumber = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  };

  //Gestion des tentatives
  const getAttemptsLimit = (difficulty, intervalStart, intervalEnd) => {
    const minValue = intervalStart;
    const maxValue = intervalEnd;
    const easyAttempts = Math.floor(Math.log2(maxValue - minValue )+ 1);
    const hardAttempts = Math.floor(easyAttempts / 2);
    const mediumAttempts = Math.floor((easyAttempts + hardAttempts) / 2);
  
    switch (difficulty) {
      case 'easy':
        return easyAttempts;
      case 'medium':
        return mediumAttempts;
      case 'hard':
        return hardAttempts;
      default:
        return easyAttempts;
    }
  };

  // Gestion des changements de valeur des inputs
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleIntervalStartChange = (e) => {
    setIntervalStart(Number(e.target.value));
  };

  const handleIntervalEndChange = (e) => {
    setIntervalEnd(Number(e.target.value));
  };

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
  };

  // Gestion de la soumission du formulaire de devinette
  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess === '') {
      return;
    }

    setAttempts(attempts + 1);

    if (Number(guess) === randomNumber) {
      // Ajouter le joueur au leaderboard
      const updatedLeaderboard = {
        ...leaderboardData,
        [difficulty]: [
          ...(leaderboardData[difficulty] || []),
          { username, attempts: attempts + 1 },
        ],
      };

      setLeaderboardData(updatedLeaderboard);
      localStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));

      setUsername('');
      setGuess('');
      setAttempts(0);
      setGameStarted(false);
      setMessage('Félicitations! Vous avez deviné le bon nombre!');
    } else {
      if (attempts + 1 === getAttemptsLimit(difficulty)) {
        alert('Vous avez atteint la limite des tentatives!');
        setGuess('');
        setAttempts(0);
        setGameStarted(false);
      } else {
        const message = Number(guess) < randomNumber ? 'Essayez un nombre plus grand!' : 'Essayez un nombre plus petit!';
        setMessage(message);
        setGuess('');
      }
    }
  };

  return (
    <div>
      <center>
        <h1>Bienvenue au jeu GET THE NUMBER GAME🎮👾</h1>
        <h2>Surpassez-vous en devinant le nombre secret qui se cache derrière notre système !</h2>
      </center>
      {!gameStarted && !showLeaderboard && (
        <center>
          <div className="startgame">
            {error && <p className="error">{error}</p>}
            <label>
              Nom d'utilisateur:
              <input type="text" value={username} onChange={handleUsernameChange} />
            </label>
            <br /><br />
            <label>
              Difficulté:
              <select value={difficulty} onChange={handleDifficultyChange}>
                <option value="easy">Facile</option>
                <option value="medium">Moyenne</option>
                <option value="hard">Difficile</option>
              </select>
            </label>
            <br /><br />
            <label>
              Intervalle de départ:
              <input type="number" value={intervalStart} onChange={handleIntervalStartChange} />
            </label>
            <br /><br />
            <label>
              Intervalle de fin:
              <input type="number" value={intervalEnd} onChange={handleIntervalEndChange} />
            </label>
            <br /><br /><center>
            <button onClick={startGame}>JOUER</button>
            <br /><br />
            <button onClick={() => setShowLeaderboard(true)}>Voir le tableau des scores</button></center>
          </div>
        </center>
      )}
      {gameStarted && (
        <center>
          <div className="jeu">
            <form onSubmit={handleGuessSubmit}>
              <label>
                Devinette:
                <input type="number" value={guess} onChange={handleGuessChange} />
              </label>
              <br />
              <center><button type="submit">Soumettre</button></center>
            </form>
            <p>{message}</p>
          </div>
        </center>
      )}
      {showLeaderboard && (
        <Leaderboard showLeaderboard={showLeaderboard} setShowLeaderboard={setShowLeaderboard} />
      )}
    </div>
  );
};

export default Game;
