import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState({});

  useEffect(() => {
    const leaderboard = localStorage.getItem('leaderboard');
    if (leaderboard) {
      setLeaderboardData(JSON.parse(leaderboard));
    }
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      {Object.entries(leaderboardData).map(([difficulty, players]) => (
        <div key={difficulty}>
          <h3>{difficulty}</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                {player.username} - {player.attempts} attempts
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

  useEffect(() => {
    const leaderboard = localStorage.getItem('leaderboard');
    if (leaderboard) {
      setLeaderboardData(JSON.parse(leaderboard));
    }
  }, []);

  useEffect(() => {
    setRandomNumber(generateRandomNumber(intervalStart, intervalEnd));
  }, [intervalStart, intervalEnd]);

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

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess === '') {
      return;
    }

    setAttempts(attempts + 1);

    if (Number(guess) === randomNumber) {
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
    } else {
      if (attempts === getAttemptsLimit(difficulty)) {
        alert('You reached the attempts limit!');
        setGuess('');
        setAttempts(0);
      } else {
        const message = Number(guess) < randomNumber ? 'Try a higher number!' : 'Try a lower number!';
        alert(message);
        setGuess('');
      }
    }
  };

  const generateRandomNumber = (start, end) => {
    return Math.floor(Math.random() * (end - start + 1)) + start;
  };

  const getAttemptsLimit = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 8;
      case 'medium':
        return 6;
      case 'hard':
        return 4;
      default:
        return 8;
    }
  };

  return (
    <div>
      <h2>Guess the Number</h2>
      <form onSubmit={handleGuessSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={handleUsernameChange} />
        </label>
        <br />
        <label>
          Difficulty:
          <select value={difficulty} onChange={handleDifficultyChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <br />
        <label>
          Interval Start:
          <input type="number" value={intervalStart} onChange={handleIntervalStartChange} />
        </label>
        <br />
        <label>
          Interval End:
          <input type="number" value={intervalEnd} onChange={handleIntervalEndChange} />
        </label>
        <br />
        <label>
          Guess:
          <input type="number" value={guess} onChange={handleGuessChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <Leaderboard />
    </div>
  );
};

export default Game;