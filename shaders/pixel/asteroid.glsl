uniform float albedo;

// same name and type as VS
varying vec3 vNormal;
varying vec3 vNewNormal;

void main() {

  // calc the dot product and clamp
  // 0 -> 1 rather than -1 -> 1
  vec3 light = vec3(500.5, 200.2, 400.0);

  // ensure it's normalized
  light = normalize(light);

  vec3 newNormal = normalize(vNewNormal);
  float lightIntensity = max(0.0, dot(newNormal, light) * albedo);

  // feed into our frag colour
  gl_FragColor = vec4(lightIntensity, // R
                      lightIntensity, // G
                      lightIntensity, // B
                      1.0);  // A

}
