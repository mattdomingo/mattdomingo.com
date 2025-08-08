"use client"

import { Canvas } from '@react-three/fiber'
import { Suspense, useMemo, useState, useEffect } from 'react'
import { Environment, Float, PresentationControls, RoundedBox, Text, useTexture, Stars, useCursor } from '@react-three/drei'
import { useRouter } from 'next/navigation'

function FloatingName() {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <Text
        font="/fonts/minecraft.ttf"
        fontSize={0.75}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
        letterSpacing={0.05}
        position={[0, 1.25, 0]}
      >
        MATT DOMINGO
      </Text>
      <Text
        font="/fonts/minecraft.ttf"
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="black"
        letterSpacing={0.08}
        position={[0, 0.55, 0]}
      >
        SOFTWARE ENGINEER
      </Text>
    </Float>
  )
}

function FloatingBlocks() {
  const planks = useTexture('/textures/planks.png')
  const positions = useMemo(() => {
    return [
      [-3.2, 1.7, -2],
      [3.2, 1.3, -1.5],
      [-2.2, -0.3, -1.2],
      [2.8, -0.7, -2.4],
      [-1.4, 2.1, -1.8],
      [1.6, 2.3, -1.5],
    ] as [number, number, number][]
  }, [])

  return (
    <group>
      {positions.map((p, i) => (
        <Float key={i} speed={1 + (i % 3) * 0.4} rotationIntensity={0.3} floatIntensity={0.8}>
          <mesh position={p} castShadow receiveShadow>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial map={planks} roughness={0.9} metalness={0.05} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function Button3D({ label, onClick, position }: { label: string; onClick: () => void; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered)
  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.1} floatIntensity={hovered ? 0.9 : 0.5}>
        <RoundedBox
          args={[2.6, 0.8, 0.7]}
          radius={0.12}
          smoothness={6}
          castShadow
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.06 : 1}
        >
          <meshStandardMaterial color={hovered ? '#9a9a9a' : '#868686'} roughness={0.6} metalness={0.15} />
        </RoundedBox>
        <Text
          font="/fonts/minecraft.ttf"
          position={[0, 0, 0.38]}
          fontSize={0.24}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="black"
        >
          {label}
        </Text>
      </Float>
    </group>
  )
}

function Splash3D() {
  const phrases = useMemo(() => [
    'Also try... hiring me!',
    'Looking for opportunities!',
    'Open to new roles!',
    'Seeking employment!',
    'Available for work!',
    'Ready to contribute!',
    'Exploring opportunities!',
    'Open for business!',
    'Actively job hunting!',
    'Ready for challenges!',
    'Seeking new adventures!',
    'Available for hire!'
  ], [])
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % phrases.length), 3000)
    return () => clearInterval(id)
  }, [phrases.length])

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.8}>
      <group rotation={[0, 0, -0.35]} position={[2.9, 1.3, 0.2]}>
        <Text
          font="/fonts/minecraft.ttf"
          fontSize={0.3}
          color="#ffff55"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="black"
        >
          {phrases[idx]}
        </Text>
      </group>
    </Float>
  )
}

export default function Hero3D() {
  const router = useRouter()
  return (
    <div className="hero3d-root" style={{ position: 'absolute', inset: 0 }}>
      <Canvas
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.6, 7], fov: 40 }}
      >
        <color attach="background" args={["#0b0b0b"]} />
        <fog attach="fog" args={["#0b0b0b", 10, 22]} />

        <ambientLight intensity={0.6} />
        <directionalLight
          castShadow
          position={[5, 6, 4]}
          intensity={1.1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={null}>
          <Stars radius={100} depth={30} count={3500} factor={4} saturation={0} fade speed={0.8} />
          <PresentationControls global snap damping={0.2} speed={1.2} polar={[-0.2, 0.3]} azimuth={[-0.4, 0.4]}>
            <group position={[0, 0, 0]}>
              <FloatingName />
              <Splash3D />
              <FloatingBlocks />
              <group position={[0, -1.1, 0]}>
                <Button3D label="ABOUT ME" position={[-2.8, 0, -0.9]} onClick={() => router.push('/about')} />
                <Button3D label="MY PROJECTS" position={[0, 0, -0.9]} onClick={() => router.push('/projects')} />
                <Button3D label="CONTACT" position={[2.8, 0, -0.9]} onClick={() => router.push('/contact')} />
              </group>
            </group>
          </PresentationControls>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
} 