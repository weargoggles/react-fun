uniform vec3 light;

varying vec3 vNormal;
varying vec3 vNewNormal;
varying vec3 vLight;

void main() {

  // set the vNormal value with
  // the attribute value passed
  // in by Three.js
  vNormal = normal;
  // vLight = normalize(light - position);

  vNewNormal = normalMatrix * normal;

  gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position, 1.0);

  vLight = normalize(light - (modelMatrix * vec4(position, 1.0)).xyz);
}
