import React, { useState, useEffect, useRef } from 'react';

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

const CATEGORIES = {
  animals: [
    'https://source.unsplash.com/featured/1600x900?lion',
    'https://source.unsplash.com/featured/1600x900?tiger',
    'https://source.unsplash.com/featured/1600x900?elephant',
    'https://source.unsplash.com/featured/1600x900?giraffe',
    'https://source.unsplash.com/featured/1600x900?zebra',
  ],
  fruits: [
    'https://source.unsplash.com/featured/1600x900?apple',
    'https://source.unsplash.com/featured/1600x900?banana',
    'https://source.unsplash.com/featured/1600x900?orange',
    'https://source.unsplash.com/featured/1600x900?pineapple',
    'https://source.unsplash.com/featured/1600x900?grapes',
  ],
  sports: [
    'https://source.unsplash.com/featured/1600x900?soccer',
    'https://source.unsplash.com/featured/1600x900?basketball',
    'https://source.unsplash.com/featured/1600x900?tennis',
    'https://source.unsplash.com/featured/1600x900?golf',
    'https://source.unsplash.com/featured/1600x900?baseball',
  ],
} as const;

const FloorBattle: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>('animals');
  const [queue, setQueue] = useState<string[]>([...CATEGORIES['animals']]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timers, setTimers] = useState<TimerState['timers']>([INITIAL_TIME, INITIAL_TIME]);
  const [scores, setScores] = useState<TimerState['scores']>([0, 0]);
  const [activePlayer, setActivePlayer] = useState<TimerState['activePlayer']>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    if (activePlayer === null) return;
    setScores(prev => {
      const next = [...prev] as typeof prev;
      next[activePlayer] += 1;
      return next;
    });
    setCurrentIdx(prev => (prev + 1) % queue.length);
    stopInterval();
    const opp: 0 | 1 = activePlayer === 0 ? 1 : 0;
    if (timers[opp] > 0) startIntervalFor(opp);
    else if (timers[activePlayer] > 0) startIntervalFor(activePlayer);
    else setActivePlayer(null);
  };

  useEffect(() => () => stopInterval(), []);

  // ===== Render =====
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-900 text-white overflow-x-hidden">
      {/* Header / Controls */}
      <header className="flex-none p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">The Floor — Picture Battle</h1>
        <div className="flex gap-4 items-center flex-wrap">
          <label htmlFor="category" className="font-semibold">Category:</label>
          <select
            id="category"
            className="text-black p-2 rounded-lg"
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
        {/* Timers */}
        <div className="flex gap-8 self-start md:self-auto">
          {[0, 1].map(p => (
            <div key={p} className="flex flex-col items-center gap-1">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${activePlayer === p ? 'bg-green-600' : 'bg-gray-700'}`}>{timers[p]}s</div>
              <span className="text-sm">P{p + 1} • {scores[p]}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Image + Correct button */}
      {activePlayer !== null && (
        <main className="flex-grow flex flex-col items-center justify-center gap-4 p-2">
          <div className="flex-grow flex items-center justify-center w-full">
            <img
              src={currentImage}
              alt="Guess the picture"
              className="max-h-full max-w-full object-contain select-none"
            />
          </div>
          <button
            onClick={handleCorrect}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-xl font-semibold mb-4"
          >
            Correct!
          </button>
        </main>
      )}
    </div>
  );
};

export default FloorBattle;
