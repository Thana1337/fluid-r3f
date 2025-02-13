// RiverMaterial.js
import * as THREE from "three";
import { ShaderMaterial } from "three";
import { extend } from "@react-three/fiber";

class RiverMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        waterColor: { value: new THREE.Color(296510) }, // default water color (light blue)
        lineColor: { value: new THREE.Color(0xffffff) },   // white for stripes
        speed: { value: 0.1 },
        stripeFrequency: { value: 10.0 },
        segmentLength: { value: 0.3 }, // fraction of the vertical cycle for the stripe appearance
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float time;
        uniform vec3 waterColor;
        uniform vec3 lineColor;
        uniform float speed;
        uniform float stripeFrequency;
        uniform float segmentLength;
        varying vec2 vUv;

        // A simple pseudo-random function.
        float rand(vec2 co) {
          return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
        }
        
        void main() {
          // Determine the stripe column and generate randomness per stripe.
          float stripeIndex = floor(vUv.x * stripeFrequency);
          float randomWidth = rand(vec2(stripeIndex, 0.0));
          float timeOffset = rand(vec2(stripeIndex, 1.0));
          
          // Compute the horizontal stripe mask.
          float localUv = fract(vUv.x * stripeFrequency);
          float stripeWidth = mix(0.03, 0.07, randomWidth);
          float stripeMask = smoothstep(0.5 - stripeWidth * 0.5, 0.5 + stripeWidth * 0.5, localUv);
          
          // Compute the vertical position within this repeating segment.
          float t = fract(vUv.y + time * speed + timeOffset);
          // Instead of a rectangle, create a triangular mask:
          // The mask peaks at t = segmentLength/2 and tapers to 0 at t = 0 and t = segmentLength.
          float verticalMask = step(t, segmentLength) * (1.0 - abs(t / segmentLength - 0.5) * 2.0);
          
          // Combine the horizontal stripe and the tapered vertical mask.
          float pattern = stripeMask * verticalMask;
          
          // Mix the base water color with the line color.
          vec3 color = mix(waterColor, lineColor, pattern);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }
  
  // Update the shader's time uniform for animation.
  update(delta) {
    this.uniforms.time.value += delta;
  }
}

extend({ RiverMaterial });
export default RiverMaterial;
