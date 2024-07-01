import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faPlay, faPause, faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import beepSound from '../beep-01a.wav'; 
function Clock() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isSession, setIsSession] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const increment = (id) => {
    if (isRunning) return;

    if (id === 'break-increment') {
      setBreakLength((prev) => Math.min(prev + 1, 60));
    } else if (id === 'session-increment') {
      setSessionLength((prev) => {
        const newLength = Math.min(prev + 1, 60);
        if (!isRunning) {
          setTimeLeft(newLength * 60);
        }
        return newLength;
      });
    }
  };

  const decrement = (id) => {
    if (isRunning) return;

    if (id === 'break-decrement') {
      setBreakLength((prev) => Math.max(prev - 1, 1));
    } else if (id === 'session-decrement') {
      setSessionLength((prev) => {
        const newLength = Math.max(prev - 1, 1);
        if (!isRunning) {
          setTimeLeft(newLength * 60);
        }
        return newLength;
      });
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            playBeep();
            setIsSession((prevSession) => !prevSession);
            const nextTime = (isSession ? breakLength : sessionLength) * 60;
            return nextTime;
          }
        });
      }, 1000);
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const playBeep = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-900 text-white">
      <div className=" p-6 rounded-lg shadow-lg w-5/12">
        <div className="text-5xl font-bold text-center mb-4">25 + 5 Clock</div>
        <div className="mb-6 flex space-x-28 items-center justify-center">
          <div className="flex-1">
            <div id="break-label" className="text-2xl font-semibold">
              Break Length
            </div>
            <div className="flex items-center space-x-4">
              <button
                id="break-decrement"
                className="p-2 bg-transparent text-white rounded"
                onClick={() => decrement('break-decrement')}
              >
                <FontAwesomeIcon className='text-4xl' icon={faArrowDown} />
              </button>
              <div id="break-length" className="text-2xl">
                {breakLength}
              </div>
              <button
                id="break-increment"
                className="p-2 bg-transparent text-white rounded"
                onClick={() => increment('break-increment')}
              >
                <FontAwesomeIcon className='text-4xl' icon={faArrowUp} />
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div id="session-label" className="text-2xl font-semibold">
              Session Length
            </div>
            <div className="flex items-center space-x-4">
              <button
                id="session-decrement"
                className="p-2 bg-transparent text-white rounded"
                onClick={() => decrement('session-decrement')}
              >
                <FontAwesomeIcon className='text-4xl' icon={faArrowDown} />
              </button>
              <div id="session-length" className="text-2xl">
                {sessionLength}
              </div>
              <button
                id="session-increment"
                className="p-2 bg-transparent  text-white rounded"
                onClick={() => increment('session-increment')}
              >
                <FontAwesomeIcon className='text-4xl' icon={faArrowUp} />
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6 border-4 border-cyan-500 rounded-lg py-10 text-center">
          <div id="timer-label" className="text-2xl font-semibold">
            {isSession ? "Session" : "Break"}
          </div>
          <div id="time-left" className="text-4xl font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <button
            id="start_stop"
            className={`px-4 py-2 ${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}
            onClick={toggleTimer}
          >
            <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
          </button>
          <button
            id="reset"
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={reset}
          >
            <FontAwesomeIcon icon={faUndoAlt} />
          </button>
        </div>
      </div>
      <footer className="mt-4 text-sm font-serif text-center">
        Designed and Coded by 
        <p className='text-center font-serif'>Anum</p>
      </footer>
      <audio id="beep" ref={audioRef} src={beepSound}></audio>
    </div>
  );
}

export default Clock;
