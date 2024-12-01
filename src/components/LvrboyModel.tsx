'use client';

import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import type { ThreeEvent } from '@react-three/fiber';

export default function LvrboyModel() {
  const group = useRef<THREE.Group>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const lastClickTime = useRef(0);
  const faceMesh = useRef<THREE.Mesh | null>(null);
  const originalMaterial = useRef<THREE.Material | null>(null);

  const { scene } = useGLTF('/base_basic_shaded.glb');

  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toLowerCase();
        if (name.includes('wing') || name.includes('feet') || name.includes('shoe')) {
          child.visible = false;
        }

        if (name.includes('face') || name.includes('head')) {
          faceMesh.current = child;

          if (child.material instanceof THREE.Material) {
            const newMaterial = child.material.clone();
            originalMaterial.current = newMaterial.clone();
            
            if (newMaterial instanceof THREE.MeshStandardMaterial) {
              newMaterial.color.setHSL(
                newMaterial.color.getHSL({ h: 0, s: 0, l: 0 }).h,
                0.05,
                0.9
              );
              
              newMaterial.metalness = 0.2;
              newMaterial.roughness = 0.2;
              
              newMaterial.emissive = new THREE.Color('#ffffff');
              newMaterial.emissiveIntensity = 0.2;
            }
            
            child.material = newMaterial;
          }
        }
      }
    });

    setModelLoaded(true);

    return () => {
      if (originalMaterial.current) originalMaterial.current.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  useFrame((state) => {
    if (!faceMesh.current || !hovered) return;

    const time = state.clock.getElapsedTime();
    
    const scale = 1 + Math.sin(time * 3) * 0.01;
    faceMesh.current.scale.setScalar(scale);

    if (faceMesh.current.material instanceof THREE.MeshStandardMaterial) {
      faceMesh.current.material.emissiveIntensity = 0.2 + Math.sin(time * 2) * 0.1;
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (!e.object) return;
    const mesh = e.object as THREE.Mesh;
    
    if (mesh === faceMesh.current) {
      setHovered(true);
      document.body.style.cursor = 'pointer';

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material, {
          emissiveIntensity: 0.4,
          roughness: 0.1,
          duration: 0.3
        });
        gsap.to(mesh.scale, {
          x: 1.02,
          y: 1.02,
          z: 1.02,
          duration: 0.3
        });
      }
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    if (!e.object) return;
    const mesh = e.object as THREE.Mesh;
    
    if (mesh === faceMesh.current) {
      setHovered(false);
      document.body.style.cursor = 'auto';

      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material, {
          emissiveIntensity: 0.2,
          roughness: 0.2,
          duration: 0.3
        });
        gsap.to(mesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3
        });
      }
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!e.object) return;
    const mesh = e.object as THREE.Mesh;
    
    if (mesh !== faceMesh.current) return;

    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;

    if (timeSinceLastClick < 300) {
      if (mesh.material instanceof THREE.MeshStandardMaterial) {
        gsap.to(mesh.material, {
          emissiveIntensity: 0.8,
          roughness: 0.1,
          duration: 0.2,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            gsap.to(mesh.material, {
              emissiveIntensity: 0.2,
              roughness: 0.2,
              duration: 0.3
            });
          }
        });

        gsap.to(mesh.scale, {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1
        });
      }
    }
    
    lastClickTime.current = currentTime;
  };

  if (!scene || !modelLoaded) {
    return null;
  }

  return (
    <group ref={group}>
      <pointLight
        position={[0, 0.5, 2]}
        intensity={1}
        distance={4}
        decay={1.5}
        color="#ffffff"
      />
      
      <pointLight
        position={[1, 0.5, -1]}
        intensity={0.5}
        distance={3}
        decay={2}
        color="#ffffff"
      />
      
      <pointLight
        position={[-1, 0, 1]}
        intensity={0.3}
        distance={3}
        decay={2}
        color="#ffffff"
      />
      
      <primitive 
        object={scene} 
        scale={1.2} 
        position={[0, 0, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />
    </group>
  );
}

useGLTF.preload('/base_basic_shaded.glb');

