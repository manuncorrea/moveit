import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContaxtData  {
  minutos: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountdown: () => void;
  resetCountdown: () => void;
}

interface CountdownProviderProps {
  children: ReactNode
}

let countdownTimeout: NodeJS.Timeout;

export const CountdownContext = createContext({} as CountdownContaxtData)

export function CountdownProvider({ children }: CountdownProviderProps) {
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(0.1 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutos = Math.floor(time/60);
  const seconds = time % 60;

  // Disparar os minutos quando clicar no botão
  function startCountdown(){
    setIsActive(true);
  }

  // Parar o button
  function resetCountdown(){
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(0.1 * 60);//resetar button
  }


  useEffect(() => { 
    if(isActive && time > 0 ){
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000)
    } else if( isActive && time === 0){
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);
  // fim da função do botão

  return(
    <CountdownContext.Provider value={{
      minutos,
      seconds,
      hasFinished,
      isActive,
      startCountdown,
      resetCountdown,
    }}>
      {children}
    </CountdownContext.Provider>
  )
}