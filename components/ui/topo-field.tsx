"use client";

import { useEffect, useRef } from "react";

// Topographic shader adapted from MengTo/threeui (MIT).
const VERTEX_SHADER = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;
const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_dpr;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1; i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // 1px physical grid rendering
    float gridSize = 48.0 * u_dpr;
    vec2 gridSt = gl_FragCoord.xy / gridSize;
    vec2 gridFract = fract(gridSt);
    float lineThickness = 1.0 / gridSize;
    float gridLines = step(1.0 - lineThickness, gridFract.x) + step(1.0 - lineThickness, gridFract.y);
    gridLines = clamp(gridLines, 0.0, 1.0) * 0.12;

    // Ultra-thin Topographic Lines
    float noiseScale = 1.4;
    vec2 noisePos = st * noiseScale + vec2(u_time * 0.015, u_time * 0.025);
    float n = snoise(noisePos) * 0.5 + 0.5;
    float numBands = 10.0;
    float bandVal = n * numBands;
    float triangleWave = abs(fract(bandVal) - 0.5) * 2.0;

    // Thinner smoothstep constraint for fine industrial aesthetic
    float topoLines = (1.0 - smoothstep(0.00, 0.02, triangleWave)) * 0.45;

    vec3 color = vec3(0.0);
    color += vec3(1.0) * gridLines;
    color += vec3(1.0) * topoLines;

    gl_FragColor = vec4(color, 1.0);
}
`;

export default function TopoField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!canvas || !gl) return;

    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      shaders.forEach((shader) => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
    if (!vertex || !fragment || !program || !buffer) {
      dispose();
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      dispose();
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const dprLocation = gl.getUniformLocation(program, "u_dpr");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const startedAt = performance.now();
    let frame = 0;

    const render = () => {
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, motion.matches ? 0 : (performance.now() - startedAt) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!motion.matches && !document.hidden) frame = requestAnimationFrame(render);
    };
    const refresh = () => {
      cancelAnimationFrame(frame);
      render();
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.uniform1f(dprLocation, dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      refresh();
    };
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", refresh);
    motion.addEventListener("change", refresh);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", refresh);
      motion.removeEventListener("change", refresh);
      dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
