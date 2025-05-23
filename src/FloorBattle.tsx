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
  Iconic_World_Landmarks: [
    'src/imgs/Iconic_World_Landmarks/01_Statue_of_Liberty.avif',
    'src/imgs/Iconic_World_Landmarks/02_Eiffel_Tower.jpg',
    'src/imgs/Iconic_World_Landmarks/03_Taj_Mahal.avif',
    'src/imgs/Iconic_World_Landmarks/04_Colosseum-Rome-Italy.webp',
    'src/imgs/Iconic_World_Landmarks/05_White-House-Washington-DC.webp',
    'src/imgs/Iconic_World_Landmarks/06_Sydney-Opera-House-Port-Jackson.webp',
    'src/imgs/Iconic_World_Landmarks/07_Big_Ben.jpg',
    'src/imgs/Iconic_World_Landmarks/08_Leaning-Tower-of-Pisa-Italy.webp',
    'src/imgs/Iconic_World_Landmarks/09_Pyramids_at_Giza.jpg',
    'src/imgs/Iconic_World_Landmarks/10_Stonehenge.jpg',
    'src/imgs/Iconic_World_Landmarks/11_Mount_Rushmore.png',
    'src/imgs/Iconic_World_Landmarks/12_Golden_Gate_Bridge.jpg',
    'src/imgs/Iconic_World_Landmarks/13_Machu_Picchu.jpg',
    'src/imgs/Iconic_World_Landmarks/14_Empire_State_Building.jpg',
    'src/imgs/Iconic_World_Landmarks/15_Trevi_Fountain.avif',
    'src/imgs/Iconic_World_Landmarks/16_Grand_Canyon.jpg',
    'src/imgs/Iconic_World_Landmarks/17_Christ_the_Redeemer.jpg',
    'src/imgs/Iconic_World_Landmarks/18_Uluru_or_Ayers_Rock .jpg',
    'src/imgs/Iconic_World_Landmarks/19_Moai_Statues_Easter_Island.jpg',
    'src/imgs/Iconic_World_Landmarks/20_Victoria_Falls.webp',
    'src/imgs/Iconic_World_Landmarks/21_St_Peters_Basilica.avif',
    'src/imgs/Iconic_World_Landmarks/22_Sagrada_Familia.jpg',
    'src/imgs/Iconic_World_Landmarks/23_Great_Wall_of_China.jpg',
    'src/imgs/Iconic_World_Landmarks/24_Arc_de_Triomphe.webp',
    'src/imgs/Iconic_World_Landmarks/25_Little_Mermaid_Denmark.webp',
    'src/imgs/Iconic_World_Landmarks/26_The_Forbidden_City.webp',
    'src/imgs/Iconic_World_Landmarks/27_Louvre_Museum.webp',
    'src/imgs/Iconic_World_Landmarks/28_Mt_Fuji_Japan.webp',
    'src/imgs/Iconic_World_Landmarks/29_Petra_Jordan.jpg',
    'src/imgs/Iconic_World_Landmarks/30_Terracotta_Warriors.jpg',
    'src/imgs/Iconic_World_Landmarks/31_Wailing_Wall.jpg',
    'src/imgs/Iconic_World_Landmarks/32_Mecca.jpg',
    'src/imgs/Iconic_World_Landmarks/33_Taipei_101.webp',
    'src/imgs/Iconic_World_Landmarks/34_Burj_Khalifa.webp',
    'src/imgs/Iconic_World_Landmarks/35_Parthenon-Athens.webp',
  ],
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
  animated_characters: [
    'src/imgs/Animated Characters/aang.jpg',
    'src/imgs/Animated Characters/batman.jpg',
    'src/imgs/Animated Characters/bugs_bunny.jpg',
    'src/imgs/Animated Characters/buzzlight_year.jpg',
    'src/imgs/Animated Characters/charlie_brown.jpg',
    'src/imgs/Animated Characters/courage_the_cowardly_dog.jpg',
    'src/imgs/Animated Characters/dora_the_explorer.jpg',
    'src/imgs/Animated Characters/fred_flinstone.jpg',
    'src/imgs/Animated Characters/garfield.jpg',
    'src/imgs/Animated Characters/goku.jpg',
    'src/imgs/Animated Characters/goofy.jpg',
    'src/imgs/Animated Characters/hinata_shoyo.jpg',
    'src/imgs/Animated Characters/jimmy_neutron.jpg',
    'src/imgs/Animated Characters/johnny_bravo.jpg',
    'src/imgs/Animated Characters/kuroko_tetsuya.jpg',
    'src/imgs/Animated Characters/levi.jpg',
    'src/imgs/Animated Characters/luffy.jpg',
    'src/imgs/Animated Characters/minato.jpg',
    'src/imgs/Animated Characters/mulan.jpg',
    'src/imgs/Animated Characters/naruto.jpg',
    'src/imgs/Animated Characters/omni_man.jpg',
    'src/imgs/Animated Characters/pink_panther.jpg',
    'src/imgs/Animated Characters/popeye.jpg',
    'src/imgs/Animated Characters/snoopy.jpg',
    'src/imgs/Animated Characters/sonic.jpg',
    'src/imgs/Animated Characters/spongebob.jpg',
    'src/imgs/Animated Characters/superman.jpg',
    'src/imgs/Animated Characters/tanjiro.jpg',
    'src/imgs/Animated Characters/tarazan.jpg',
    'src/imgs/Animated Characters/timmy_turner.jpg',
    'src/imgs/Animated Characters/winnie_the_pooh.jpg',
    'src/imgs/Animated Characters/zuko.jpg',
    'src/imgs/Animated Characters/Danny_Phantom.jpg',
    'src/imgs/Animated Characters/Homer_simpson.jpg',
    'src/imgs/Animated Characters/Mickey_Mouse.jpg',
  ],
} as const;

const FloorBattle: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>('animals');
  const [queue, setQueue] = useState<string[]>([...CATEGORIES['animals']]);
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
          <div className="image-container">
            {activePlayer !== null ? (
              <img
                src={currentImage}
                alt="Guess the picture"
                className="max-h-[calc(100vh-200px)] max-w-full object-contain select-none"
                width="800px"
                height="800px"
              />
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
