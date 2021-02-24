import { useState, useEffect, useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Countdown.module.css';

let countdownTimeout: NodeJS.Timeout;

export function Countdown () {
  const { startNewChallenge } = useContext(ChallengesContext);

  const [time, setTime] = useState(0.1 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutos = Math.floor(time/60);
  const seconds = time % 60;

  const [minuteLeft, minuteRight] = String(minutos).padStart(2, '0').split('');
  const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

  // Disparar os minutos quando clicar no botão
  function startCountdown(){
    setIsActive(true);
  }

  // Parar o button
  function resetCountdown(){
    clearTimeout(countdownTimeout);
    setIsActive(false);
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
    <div>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      { hasFinished ? (
        <button 
        disabled
        className={styles.countdownButton} 
      >
        Ciclo encerrado
      </button>
      ) : (
        <>
          {isActive ? (
          <button 
            onClick={resetCountdown}
            type="button" 
            className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
          >
            Abandonar ciclo
          </button>
      ): (
          <button 
            onClick={startCountdown}
            type="button" 
            className={styles.countdownButton}
          >
            Iniar ciclo
          </button>
          )}
        </>
      )}

      
    </div>
  );
}

