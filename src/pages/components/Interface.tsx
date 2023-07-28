import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect } from "react";

import useGame from "~/stores/useGame";
import React from "react";
import { addEffect } from "@react-three/fiber";

const Interface = () => {
  const time = useRef<HTMLDivElement>(null);

  enum Controls {
    forward = "forward",
    backward = "backward",
    leftward = "leftward",
    rightward = "rightward",
    jump = "jump",
  }

  // const controls = useKeyboardControls((state) => state);
  const forward = useKeyboardControls<Controls>((state) => state.forward);
  const backward = useKeyboardControls<Controls>((state) => state.backward);
  const leftward = useKeyboardControls<Controls>((state) => state.leftward);
  const rightward = useKeyboardControls<Controls>((state) => state.rightward);
  const jump = useKeyboardControls<Controls>((state) => state.jump);

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();

      let elapsedTime = 0;

      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }

      elapsedTime /= 1000;

      const elapsedTimeString = elapsedTime.toFixed(2);

      if (time.current) {
        time.current.textContent = elapsedTimeString;
      }
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className="interface">
      {/* time */}
      <div ref={time} className="time">
        0.00
      </div>
      {/* Restart */}
      {phase === "ended" && (
        <div className="restart" onClick={restart}>
          Restart
        </div>
      )}
      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${leftward ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${rightward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
