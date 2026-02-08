import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type GamificationContextType = {
  xp: number;
  lives: number;
  streak: number;
  level: number;
  addXp: (amount: number) => void;
  loseLife: () => void;
  addLife: () => void;
};

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used inside GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [xp, setXp] = useState<number>(() => {
    const stored = localStorage.getItem('xp');
    return stored ? Number(stored) : 0;
  });

  const [lives, setLives] = useState<number>(() => {
    const stored = localStorage.getItem('lives');
    return stored ? Number(stored) : 3000;
  });

  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    localStorage.setItem('xp', String(xp));
    localStorage.setItem('lives', String(lives));
  }, [xp, lives]);

  const addXp = (amount: number) => {
    setXp(prev => prev + amount);
  };

  const loseLife = () => {
    setLives(prev => Math.max(0, prev - 1));
  };

  const addLife = () => {
    setLives(prev => prev + 1);
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        lives,
        streak,
        level,
        addXp,
        loseLife,
        addLife,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};
