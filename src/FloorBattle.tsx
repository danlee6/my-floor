import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from './CATEGORIES';

/***************************************
 * Floor Picture‑Battle (TypeScript)
 * -----------------------------------
 * Full‑screen layout: header + controls
 * stay fixed at the top; the current
 * picture flex‑grows to consume the rest
 * of the viewport so contestants see the
 * largest possible image.
 **************************************/

type CategoryKey = keyof typeof CATEGORIES;

interface TimerState {
  timers: [number, number];
  scores: [number, number];
  activePlayer: 0 | 1 | null;
}

const INITIAL_TIME = 45;

const FloorBattle: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>('Chinese_Takeout');
  const [queue, setQueue] = useState<string[]>([...CATEGORIES['Chinese_Takeout']]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timers, setTimers] = useState<TimerState['timers']>([INITIAL_TIME, INITIAL_TIME]);
  const [scores, setScores] = useState<TimerState['scores']>([0, 0]);
  const [activePlayer, setActivePlayer] = useState<TimerState['activePlayer']>(null);
  const [isSkipCooldown, setIsSkipCooldown] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const skipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentImage = queue[currentIdx];

  // ===== Timer helpers =====
  const startIntervalFor = (player: 0 | 1) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActivePlayer(player);
    intervalRef.current = setInterval(() => {
      setTimers(prev => {
        if (prev[player] === 0) return prev;
        const next = [...prev] as typeof prev;
        next[player] = prev[player] - 1;
        return next;
      });
    }, 1000);
  };

  const stopInterval = () => intervalRef.current && clearInterval(intervalRef.current);

  // ===== Handlers =====
  const handleStartGame = () => {
    stopInterval();
    setQueue([...CATEGORIES[category]]);
    setCurrentIdx(0);
    setTimers([INITIAL_TIME, INITIAL_TIME]);
    setScores([0, 0]);
    startIntervalFor(0);
  };

  const handleCorrect = () => {
    if (activePlayer === null || isSkipCooldown) return;
    setScores(prev => {
      const next = [...prev] as typeof prev;
      next[activePlayer] += 1;
      return next;
    });
    nextImage();
  };

  const handleSkip = () => {
    if (isSkipCooldown || activePlayer === null) return;
    
    setIsSkipCooldown(true);
    // Don't stop the interval - let the timer keep counting down
    
    // Show the current image for 3 seconds
    skipTimeoutRef.current = setTimeout(() => {
      // Move to the next image
      setCurrentIdx(prev => (prev + 1) % queue.length);
      setIsSkipCooldown(false);
      
      // The timer is still running, so no need to restart it
      // The active player remains the same
    }, 3000);
  };

  const nextImage = () => {
    setCurrentIdx(prev => (prev + 1) % queue.length);
    stopInterval();
    
    if (activePlayer !== null) {
      const opp: 0 | 1 = activePlayer === 0 ? 1 : 0;
      if (timers[opp] > 0) startIntervalFor(opp);
      else if (timers[activePlayer] > 0) startIntervalFor(activePlayer);
      else setActivePlayer(null);
    }
  };

  // Clean up intervals and timeouts on unmount
  useEffect(() => {
    return () => {
      stopInterval();
      if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
    };
  }, []);

  // Add this effect to check for game end when timers change
  useEffect(() => {
    // Check if either player's timer has reached zero
    if (activePlayer !== null && (timers[0] === 0 || timers[1] === 0)) {
      // If any player has run out of time, end the round
      stopInterval();
      setActivePlayer(null); // This will re-enable the dropdown and Start Game button
      
      // Optional: show some indication that the game is over
      console.log('Game over! Player timers:', timers);
    }
  }, [timers]); // Only re-run this effect when timers change

  // ===== Render =====
  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white overflow-hidden">
      <header className="flex-none p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-2xl font-bold">The Floor — Picture Battle</h1>
        <div className="flex gap-4 items-center flex-wrap">
          <label htmlFor="category" className="font-semibold">Category:</label>
          <select
            id="category"
            className="text-white bg-gray-700 p-2 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={category}
            onChange={e => setCategory(e.target.value as CategoryKey)}
            disabled={activePlayer !== null}
          >
            {(Object.keys(CATEGORIES) as CategoryKey[]).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            onClick={handleStartGame}
            disabled={activePlayer !== null}
          >
            Start Game
          </button>
        </div>
      </header>

      {/* Main content with timers and image */}
      <main className="flex-grow flex flex-col items-center justify-start p-2 overflow-hidden">
        <div className="timer-container">
          {/* Player 1 Timer (Left) */}
          <div className="timer">
            <div className={`timer-display ${activePlayer === 0 ? 'bg-green-600' : 'bg-gray-700'}`}>
              {timers[0]}s
            </div>
            <span className="text-sm">P1 • {scores[0]}</span>
          </div>

          {/* Image Container */}
          <div className="image-container relative">
            {activePlayer !== null ? (
              <>
                <img
                  src={currentImage}
                  alt="Guess the picture"
                  className={`max-h-[calc(100vh-200px)] max-w-full object-contain select-none ${
                    isSkipCooldown ? 'opacity-80' : ''
                  }`}
                  width="800px"
                  height="800px"
                />
                {/* Red overlay during skip cooldown */}
                {isSkipCooldown && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(220, 38, 38, 0.4)' }} // Explicit RGBA for translucency
                  >
                    <span className="text-2xl font-bold text-white">SKIPPING...</span>
                  </div>
                )}
              </>
            ) : (
              <div className="placeholder-container">
                <p className="text-xl">Select a category and click Start Game</p>
                <div className="placeholder-box">
                  Image will appear here
                </div>
              </div>
            )}
          </div>

          {/* Player 2 Timer (Right) */}
          <div className="timer">
            <div className={`timer-display ${activePlayer === 1 ? 'bg-green-600' : 'bg-gray-700'}`}>
              {timers[1]}s
            </div>
            <span className="text-sm">P2 • {scores[1]}</span>
          </div>
        </div>

        {/* Action Buttons - Only show when game is active */}
        {activePlayer !== null && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleCorrect}
              disabled={isSkipCooldown}
              className={`bg-green-600 text-white px-6 py-3 rounded-xl text-xl font-semibold ${
                isSkipCooldown ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              Correct!
            </button>
            <button
              onClick={handleSkip}
              disabled={isSkipCooldown}
              className={`bg-red-600 text-white px-6 py-3 rounded-xl text-xl font-semibold ${
                isSkipCooldown ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
              }`}
            >
              Skip
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default FloorBattle;
