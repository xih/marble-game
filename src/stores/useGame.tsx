// import { number } from "zod";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

import type { StateCreator, StoreMutatorIdentifier } from "zustand";

interface State {
  blocksCount: number;
  blocksSeed: number;
  phase: string;
  startTime: number;
  endTime: number;
  start: () => void;
  restart: () => void;
  end: () => void;
}

type Logger = <
  T extends State,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>;

const subscribeWithSelector2 = subscribeWithSelector as Logger;

// import { create } from "zustand";
// import { subscribeWithSelector } from "zustand/middleware";

export default create<State>()(
  subscribeWithSelector2((set) => ({
    blocksCount: 10,
    blocksSeed: 0,

    /**
     * Time
     */
    startTime: 0,
    endTime: 0,

    /**
     * Phases
     */
    phase: "ready",

    start: () => {
      set((state) => {
        if (state.phase === "ready")
          return { phase: "playing", startTime: Date.now() };

        return {};
      });
    },

    restart: () => {
      set((state) => {
        if (state.phase === "playing" || state.phase === "ended")
          return { phase: "ready", blocksSeed: Math.random() };

        return {};
      });
    },

    end: () => {
      set((state) => {
        if (state.phase === "playing")
          return { phase: "ended", endTime: Date.now() };

        return {};
      });
    },
  }))
);
