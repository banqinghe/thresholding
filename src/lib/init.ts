import vsText from './glsl/shader.vs?raw';
import renderImageFsText from './glsl/renderImage.fs?raw';
import thresholdingFsText from './glsl/thresholding.fs?raw';

function loadShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    alert('Failed to create shader');
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * loader vertex shader and fragment shader from file
 */
export function loadShaderSource(vsSourceUrl: string, fsSourceUrl: string) {
  return Promise.all([
    fetch(vsSourceUrl).then(res => res.text()),
    fetch(fsSourceUrl).then(res => res.text()),
  ]);
}

/**
 * initialize shaders
 */
export function initShaders(
  gl: WebGL2RenderingContext,
  vsText: string,
  fsText: string
) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsText);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsText);

  const shaderProgram = gl.createProgram();

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  if (!shaderProgram) {
    alert('Failed to create program');
    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      'Unable to initialize the shader program: ' +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }

  return shaderProgram;
}

/**
 * compile shader and return WebGL programs
 */
export function getWebGLPrograms(ctx: WebGL2RenderingContext) {
  return {
    renderImage: initShaders(ctx, vsText, renderImageFsText),
    thresholding: initShaders(ctx, vsText, thresholdingFsText),
  };
}
