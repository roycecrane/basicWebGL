import React from "react";
import { useRenderer } from "./Renderer";
const VS = `#version 300 es
layout(location = 1) in vec3 pos;
// out vec2 vel_v;
// out vec2 pos_v;
out vec3 C;
void main(void) {
  C = pos;
  gl_Position = vec4(pos ,1.0);
}
`;
const FS = `#version 300 es
precision highp float;
in vec3 C;
out vec4 color;
void main(void) {
   float w_h = 100000.0;
  vec2 z = vec2(0.0);
  vec2 res = vec2(w_h,w_h);
  vec2 uv = 5. *C.xy - 0.5*res/w_h;
  vec2 c = uv * (0.1);
  float iter = 0.0;
  float max_iter = 100.0;
  for(float i = 0.0; i<max_iter;i++){
    z =vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y)+c;
    if(length(z)>2.0) break;
    iter++;
  }
  float f =  iter/max_iter;
  if(mod(iter,2.0)==0.0)f*=0.0;
  color = vec4(f,f,f,1.0);
}
`;
function WebglReact(){
  const{ canvasRef } = useRenderer(VS,FS,function setUniforms(gl, start, prog) {
        let time = (11.75 * (Date.now() - start)) / 1000.0;
        gl.uniform1f(gl.getUniformLocation(prog, "time"), time);
        gl.uniform2fv(gl.getUniformLocation(prog, "res"),[ gl.canvas.width, gl.canvas.height]);
      }
    );    
  return <canvas ref={canvasRef}></canvas>;
}
export default WebglReact;
