import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Typography } from '@mui/material';

function DiceMesh({ roll, result }) {
  const meshRef = useRef();

  // 랜덤한 각도로 회전시키기 위한 상태
  const [rotation, setRotation] = useState([0, 0, 0]);

  // 주사위가 굴러갈 때 회전
  useFrame(() => {
    if (roll) {
      meshRef.current.rotation.x += 0.1;
      meshRef.current.rotation.y += 0.1;
    }
  });

  // 주사위를 클릭하면 새로운 회전값을 설정하여 결과를 보여줌
  useEffect(() => {
    if (!roll && result !== null) {
      const randomRotation = [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ];
      setRotation(randomRotation);
      meshRef.current.rotation.set(...randomRotation);
    }
  }, [roll, result]);

  return (
    <mesh ref={meshRef} rotation={rotation}>
      {/* 주사위의 모양 (정20면체) */}
      <icosahedronGeometry args={[2, 0]} />
      <meshStandardMaterial />
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.IcosahedronGeometry(2, 0)]} />
        <lineBasicMaterial attach="material" color="white" />
      </lineSegments>
    </mesh>
  );
}

function Dice({handleClose, prob}) {
  const [diceResult, setDiceResult] = useState(null);
  const [roll, setRoll] = useState(false); 
  const [buttonVisible, setButtonVisible] = useState(true);
  const [closeVisible, setCloseVisible] = useState(false);
  const rollDice = () => {
    setRoll(true);
    setButtonVisible(false);
    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setDiceResult(result);
      setRoll(false);
      setCloseVisible(true)
    }, 1000); // 1초 후에 결과 표시
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant='h5'>{prob}</Typography>
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <DiceMesh roll={roll} /> {/* 주사위 메쉬 */}
      </Canvas>
      <div>
        <h1>{diceResult !== null ? `You rolled: ${diceResult}` : 'Click the dice to roll'}</h1>
        {buttonVisible && <button onClick={rollDice}>Roll the dice</button>}
        {closeVisible && <button onClick={()=>handleClose(diceResult)}>Close</button>}
      </div>
    </div>
  );
}

export default Dice;
