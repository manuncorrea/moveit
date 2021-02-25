import { createContext, useState, ReactNode, useEffect } from 'react';
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
  completeChallenge: () => void;
}

interface ChallengesProviderProps {
  children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengesCompleted] = useState(9);

  //armazenar os desafios do json
  const [activeChallenge, setActiveChallenge] = useState(null);

  // calcular xp para o proximo nivel
  const experienceToNextLevel = Math.pow((level + 1)  * 4, 2);

  //Exibir caixa de permissão
  useEffect(() => {
    Notification.requestPermission();
  },[])

  function levelUp() {
    setLevel(level + 1);
  }

  function startNewChallenge() {
     // Retornar os desafios do arquivo json
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge);

    new Audio("/notification.mp3").play();

    if (Notification.permission === "granted") {
      new Notification("Novo Desafio", {
        body: `Valendo ${challenge.amount}xp`,
      });
    }
  };


  function resetChallenge() {
    setActiveChallenge(null);
  }

  function completeChallenge() {
    if(!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if(finalExperience >= experienceToNextLevel) {
      finalExperience = finalExperience - experienceToNextLevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengesCompleted(challengesCompleted +1);

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
      resetChallenge,
      completeChallenge
    }}>
      {children} 
    </ChallengesContext.Provider>
  );
}