"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useExperience } from "./experience-provider";

/** A decorative, progressively enhanced field. All content lives outside WebGL. */
export default function SpatialCanvas({
  onReady,
}: {
  onReady: (ready: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const { theme, reducedMotion } = useExperience();

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onReady(false);
      return;
    }
    const light = theme === "light";
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0, 8.5);
    const assembly = new THREE.Group();
    scene.add(assembly);
    scene.add(new THREE.AmbientLight(0xffffff, light ? 2 : 1.1));
    const key = new THREE.DirectionalLight(0xe6f5ff, 4);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const rim = new THREE.PointLight(0xff5522, 50, 15);
    rim.position.set(3, -1, 2);
    scene.add(rim);

    const ringGeometry = new THREE.TorusGeometry(1, 0.006, 5, 128);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: light ? 0x273b48 : 0xc9d8dd,
      metalness: 0.65,
      roughness: 0.35,
    });
    const rings = new THREE.InstancedMesh(ringGeometry, ringMaterial, 64);
    rings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    assembly.add(rings);
    const coreGeometry = new THREE.TorusKnotGeometry(0.65, 0.2, 160, 16, 2, 3);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: light ? 0xb93312 : 0xff6338,
      emissive: light ? 0x000000 : 0x8a1705,
      emissiveIntensity: 0.2,
      metalness: 0.5,
      roughness: 0.32,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    assembly.add(core);
    const cageGeometry = new THREE.EdgesGeometry(
      new THREE.IcosahedronGeometry(1.92, 1),
    );
    const cageMaterial = new THREE.LineBasicMaterial({
      color: light ? 0x435c6a : 0x8da5b4,
      transparent: true,
      opacity: 0.2,
    });
    const cage = new THREE.LineSegments(cageGeometry, cageMaterial);
    assembly.add(cage);

    const count = 2400;
    const sphere = new Float32Array(count * 3);
    const field = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const shell = 1.98 + 0.15 * Math.sin(i * 7.3);
      sphere.set(
        [
          Math.cos(angle) * radius * shell,
          y * shell,
          Math.sin(angle) * radius * shell,
        ],
        i * 3,
      );
      const x = ((i % 60) / 59) * 9 - 4.5;
      const z = (Math.floor(i / 60) / 39) * 7 - 3.5;
      field.set([x, Math.sin(x * 0.8) * Math.cos(z * 0.65) * 0.65, z], i * 3);
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(sphere, 3),
    );
    pointGeometry.setAttribute("field", new THREE.BufferAttribute(field, 3));
    const pointMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        progress: { value: 0 },
        time: { value: 0 },
        tint: { value: new THREE.Color(light ? "#41596a" : "#b9cbd1") },
        pixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `attribute vec3 field; uniform float progress; uniform float time; uniform float pixelRatio; varying float vAlpha;
        void main(){vec3 target=field; target.y+=sin(field.x*.9+time)*cos(field.z*.7+time*.4)*.15;
        vec3 p=mix(position,target,progress); vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
        gl_PointSize=clamp(11. * pixelRatio / -mv.z,1.,3.); vAlpha=.4+.6*(position.y+2.2)/4.4;}`,
      fragmentShader: `uniform vec3 tint; varying float vAlpha; void main(){float d=length(gl_PointCoord-.5); if(d>.5) discard; gl_FragColor=vec4(tint,vAlpha*(1.-smoothstep(.15,.5,d)));}`,
    });
    const points = new THREE.Points(pointGeometry, pointMaterial);
    points.frustumCulled = false;
    assembly.add(points);

    let frame = 0;
    let visible = true;
    let contextLost = false;
    let scrollProgress = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let time = 0;
    let previousTime = 0;
    const matrixObject = new THREE.Object3D();
    const story = element.closest("[data-spatial-story]");

    function measureScroll() {
      if (!story || reducedMotion) {
        scrollProgress = 0;
        return;
      }
      const rect = story.getBoundingClientRect();
      scrollProgress = THREE.MathUtils.clamp(
        -rect.top / Math.max(1, rect.height - window.innerHeight),
        0,
        1,
      );
    }
    function draw(now = 0) {
      frame = 0;
      if (contextLost) return;
      if (previousTime) time += Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      const p = reducedMotion ? 0 : scrollProgress;
      const morph = THREE.MathUtils.smoothstep(p, 0.1, 0.95);
      const width = element!.clientWidth;
      pointerX += (targetX - pointerX) * 0.035;
      pointerY += (targetY - pointerY) * 0.035;
      assembly.position.set(
        width > 700 ? 1.45 * (1 - morph) : 0.45,
        width > 700 ? 0.05 : 0.8,
        0,
      );
      assembly.rotation.set(
        0.18 + morph * 0.4 + pointerY * 0.07,
        time * 0.035 + pointerX * 0.12,
        -0.28 * (1 - morph),
      );
      assembly.scale.setScalar(width > 700 ? 1 : 0.75);
      core.rotation.set(time * 0.13, time * 0.16, morph * 1.5);
      core.scale.setScalar(1 - morph * 0.88);
      cage.rotation.y = -time * 0.03;
      cageMaterial.opacity = 0.2 * (1 - morph);
      for (let i = 0; i < 64; i++) {
        const y = (i / 63) * 2 - 1;
        const r = Math.sqrt(Math.max(0.001, 1 - y * y)) * 1.6;
        matrixObject.position.set(
          Math.sin(i * 0.13 + time * 0.12) * morph * 0.2,
          y * 1.6 * (1 - morph * 0.7),
          0,
        );
        matrixObject.rotation.set(
          Math.PI / 2 + Math.sin(i * 0.09 + time * 0.1) * 0.11 * (1 - morph),
          morph * Math.PI * y,
          0,
        );
        matrixObject.scale.set(
          r * (1 + morph * 0.9),
          r * (1 + morph * 0.9),
          1 - morph * 0.6,
        );
        matrixObject.updateMatrix();
        rings.setMatrixAt(i, matrixObject.matrix);
      }
      rings.instanceMatrix.needsUpdate = true;
      pointMaterial.uniforms.progress.value = morph;
      pointMaterial.uniforms.time.value = time * 0.3;
      renderer.render(scene, camera);
      if (!reducedMotion && visible && !document.hidden)
        frame = requestAnimationFrame(draw);
    }
    function schedule() {
      if (frame || contextLost || !visible || document.hidden) return;
      previousTime = 0;
      frame = requestAnimationFrame(draw);
    }
    function resize() {
      const width = element!.clientWidth;
      const height = element!.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      measureScroll();
      schedule();
    }
    function pointer(event: PointerEvent) {
      if (reducedMotion || !visible || event.pointerType !== "mouse") return;
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    }
    function visibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else schedule();
    }
    function lost(event: Event) {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      onReady(false);
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) schedule();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersection.observe(story || element);
    window.addEventListener("scroll", measureScroll, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    resize();
    onReady(true);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("scroll", measureScroll);
      window.removeEventListener("pointermove", pointer);
      document.removeEventListener("visibilitychange", visibility);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      [ringGeometry, coreGeometry, cageGeometry, pointGeometry].forEach(
        (geometry) => geometry.dispose(),
      );
      [ringMaterial, coreMaterial, cageMaterial, pointMaterial].forEach(
        (material) => material.dispose(),
      );
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [theme, reducedMotion, onReady]);

  return <div ref={host} className="spatial-canvas" aria-hidden="true" />;
}
