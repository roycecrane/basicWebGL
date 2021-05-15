
import { useEffect, useRef } from "react";

export function useRenderer(VS,FS, setUniforms) {
  const canvasRef = useRef(null);
  useEffect(function initWebGL(){
  const canvas = canvasRef.current;
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
  
    window.addEventListener("resize", handleResize);
    handleResize();
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });
    const renderer = createRenderer(gl, VS,FS, setUniforms);
    requestAnimationFrame(renderer);
  });
  return { canvasRef };
}
function createRenderer(gl, VS,FS, setUniforms, start = Date.now()) {
  const buffer = gl.createBuffer();
  const P = compileProgram(gl, VS,FS);
  const bufferData = new Float32Array("-1,-1,1,-1,-1,1,-1,1,1,-1,1,1".split(",").map(x => parseInt(x, 10)))
  return function render(){
  setUniforms(gl, start, P);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  let loc = gl.getAttribLocation(P,"pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render)
  }
}

function compileProgram(gl,VS,FS){
  let prog = gl.createProgram();
  let vtx = loadShader(gl, gl.VERTEX_SHADER,VS);let frag = loadShader(gl, gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vtx);gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.deleteShader(vtx);gl.deleteShader(frag);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS))alert('SHADER PROGRAM ERROR: ' + gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  return prog;
}

function loadShader(gl, shaderType, src) {let shader = gl.createShader(shaderType);
  gl.shaderSource(shader, src);gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){alert('SHADER ERROR! ' + gl.getShaderInfoLog(shader));gl.deleteShader(shader);return}
  return shader;
}
