uniform float albedo;

// same name and type as VS
varying vec3 vNormal;
varying vec3 vNewNormal;
varying vec3 vLight;

void main() {

  // calc the dot product and clamp
  // 0 -> 1 rather than -1 -> 1
  vec3 light = vLight;

  // ensure it's normalized

  vec3 newNormal = normalize(vNewNormal);
  float lightIntensity = max(0.0, dot(vNormal, vLight) * albedo);

  // feed into our frag colour
  gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0) + vec4(lightIntensity, // R
                      lightIntensity, // G
                      lightIntensity, // B
                      1.0);  // A

}
