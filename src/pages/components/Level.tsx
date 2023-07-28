import { Text, Float, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  type RapierRigidBody,
  RigidBody,
  CuboidCollider,
} from "@react-three/rapier";
import { FC, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { type Vector3 } from "@react-three/fiber";
import { type Group } from "three";
import { type ElementType } from "react";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "greenyellow" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "orangered" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slategrey" });

// interface BlockDefinition {
//   props: ({
//     position,
//   }: {
//     position: [x: number, y: number, z: number];
//   }) => JSX.Element;
// }

// type BlockDefinition = {
//   (props: { position: [x: number, y: number, z: number] }): JSX.Element;
// };

// interface BlockDefinition {
//   (position: [number, number, number]): JSX.Element;
// }

// interface BlockDefinition {
//   (props: { position: [x: number, y: number, z: number] }): Element;
// }

// type BlockDefinition = (a: string) => Promise<boolean>;
type BlockDefinition = (props: {
  position: [x: number, y: number, z: number];
}) => JSX.Element;

// Argument of type '({ position, }: { position: [number, number, number]; }) => JSX.Element' is not assignable to parameter of type 'BlockDefinition'.ts(2345)

// ("({ position, }: [x: number, y: number, z: number]) => Element");

// Type '({ position, }: [x: number, y: number, z: number]) => Element' is not assignable to type 'Blocks'.

// interface BlockFunction {
//   (position: Vector3): Group;
// }
/**
 *
 * @param blockstart takes a position and
 * @returns a floor
 */
const BlockStart = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Floor */}
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./fonts/bebas-neue-v9-latin-regular.woff"
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
          scale={0.5}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  );
};

const BlockEnd = ({ position }: { position: [number, number, number] }) => {
  const hamburger2 = useGLTF("./hamburger2.glb");

  hamburger2.scene.children.forEach((mesh) => (mesh.castShadow = true));

  return (
    <group position={position}>
      <Text
        font="./fonts/bebas-neue-v9-latin-regular.woff"
        position={[0, 2.25, 2]}
        scale={1}
      >
        Finish
        <meshBasicMaterial toneMapped={false} />
      </Text>

      {/* Floor */}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        position={[0, 0.25, 0]}
        colliders="hull"
        restitution={0.2}
        friction={0}
      >
        <primitive object={hamburger2.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
};

export const BlockSpinner = ({
  position,
}: {
  position: [number, number, number];
}): JSX.Element => {
  const obstacle = useRef<RapierRigidBody>(null);

  const [speed] = useState<number>(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const clock = state.clock.getElapsedTime();

    const eulerRotation = new THREE.Euler(0, speed * clock, 0);
    const quaternionRotation = new THREE.Quaternion();
    quaternionRotation.setFromEuler(eulerRotation);

    obstacle.current?.setNextKinematicRotation(quaternionRotation);
  });

  return (
    <>
      <group position={position}>
        {/* Floor */}
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
        <RigidBody
          type="kinematicPosition"
          ref={obstacle}
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.5, 0.3, 0.3]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      </group>
    </>
  );
};

export const BlockLimbo = ({
  position,
}: {
  position: [number, number, number];
}): JSX.Element => {
  const obstacle = useRef<RapierRigidBody>(null);

  const [timeOffset] = useState<number>(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    // const clock = state
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;

    obstacle.current?.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <>
      <group position={position}>
        {/* Floor */}
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
        <RigidBody
          type="kinematicPosition"
          ref={obstacle}
          position={position}
          restitution={0.2}
          friction={0}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.5, 0.3, 0.3]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      </group>
    </>
  );
};

export const BlockAxe = ({
  position,
}: {
  position: [number, number, number];
}): JSX.Element => {
  const obstacle = useRef<RapierRigidBody>(null);

  const [timeOffset] = useState<number>(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    // const clock = state
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current?.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <>
      <group position={position}>
        {/* Floor */}
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
        <RigidBody
          type="kinematicPosition"
          ref={obstacle}
          position={position}
          restitution={0.2}
          friction={0}
        >
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 0.3]} />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
      </group>
    </>
  );
};

const Bounds = ({ length = 1 }) => {
  return (
    <>
      {/* <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, length * 4]} />
        <meshStandardMaterial color="orange" />
      </mesh> */}
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          castShadow
        />
        <mesh
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
          receiveShadow
        />
        <mesh
          position={[0, 0.75, -(length * 4) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
          receiveShadow
        />
        <CuboidCollider
          restitution={0.2}
          friction={1}
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
        />
      </RigidBody>
    </>
  );
};

export const Level = ({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks: BlockDefinition[] = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      if (!!type) {
        blocks.push(type);
      }
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => {
        return <Block key={index} position={[0, 0, -(index + 1) * 4]} />;
      })}
      <BlockEnd position={[0, 0, (count + 1) * -4]} />
      <Bounds length={count + 2} />
    </>
  );
};
