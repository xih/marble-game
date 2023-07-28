import { OrbitControls } from "@react-three/drei";
import GameLights from "./GameLights";
import { Level, BlockSpinner } from "./Level";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import useGame from "~/stores/useGame";
import * as THREE from "three";

import { Color } from "three";

type RGB = `rgb(${number}, ${number}, ${number})`;

export default function GameExperience() {
  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <>
      <OrbitControls makeDefault />

      <color args={["#bdedfc"]} attach="background" />

      <Physics debug>
        <GameLights />
        <Level count={blocksCount} seed={blocksSeed} />
        <Player />
      </Physics>
    </>
  );
}
