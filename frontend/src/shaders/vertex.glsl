// src/shaders/vertex.glsl
attribute vec4 position;
varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = position;
}
