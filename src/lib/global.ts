export interface WebGLStatus {
  ctx: WebGL2RenderingContext | null;
  renderImage: WebGLProgram | null;
  thresholding: WebGLProgram | null;
}

export const webglStatus: WebGLStatus = {
  ctx: null,
  renderImage: null,
  thresholding: null,
};
