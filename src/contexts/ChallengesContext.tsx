import { createContext, useState, ReactNode } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
  type: 'body' | 'eye';
  description: string;
  amount: string;
}

interface ChallengesContextData {
  level: number; 
  currentExperience: number; 
  experienceToNextLevel: number;
  activeChallenge: Challenge;
  challengesCompleted: number; 
  levelUp: () => void; 
  startNewChallenge: () => void; 
  resetChallenge: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(30);
  const [challengesCompleted, setChallengesCompleted] = useState(9);

  //armazenar os desafios do json
  const [activeChallenge, setActiveChallenge] = useState(null);

  // calcular xp para o proximo nivel
  const experienceToNextLevel = Math.pow((level + 1)  * 4, 2)

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {
     // Retornar os desafios do arquivo json
    const randowChallangeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randowChallangeIndex];

    setActiveChallenge(challenge);
  }

  function resetChallenge() {
    setActiveChallenge(null);
  }

  return(
    // Quando criamo um component, esse componente rece conteuddo dentro dele precisamos utlizar as childrens
    <ChallengesContext.Provider 
    value={{ 
      level, 
      currentExperience, 
      challengesCompleted, 
      levelUp, 
      startNewChallenge, 
      experienceToNextLevel,
      activeChallenge,
      resetChallenge
    }}>
      {children} 
    </ChallengesContext.Provider>
  );
}