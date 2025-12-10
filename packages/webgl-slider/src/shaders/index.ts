// Vertex shader for distortion effect
export const vertexShader = `
  varying vec2 vUv;
  uniform float uEffectValue;

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    pos.x += sin(uv.y * 3.141592) * (sin(uEffectValue / 400.0));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Fragment shader with configurable gradient
export const createFragmentShader = (gradientStrength: number = 0.8) => `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uAlpha;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    
    // Gradient oscuro en la parte inferior (0.0 = bottom, 1.0 = top)
    float gradientStart = 0.0;
    float gradientEnd = 0.5;
    float gradientStrength = smoothstep(gradientEnd, gradientStart, vUv.y);
    
    // Mezclar con negro en la parte inferior
    vec3 finalColor = mix(color.rgb, color.rgb * 0.3, gradientStrength * ${gradientStrength.toFixed(1)});
    
    gl_FragColor = vec4(finalColor, color.a * uAlpha);
  }
`

// Default fragment shader
export const fragmentShader = createFragmentShader(0.8)
