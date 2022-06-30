import { webglStatus } from './global';

/**
 * thresholding, optional thresholds are [0,100]
 */
export async function thresholding(
  ctx: WebGL2RenderingContext,
  image: HTMLImageElement,
  value: number
) {
  const program = webglStatus.thresholding;
  if (!program) {
    alert('Program is null');
    return;
  }

  ctx.useProgram(program);

  const threshold = value / 100;
  const uniformThreshold = ctx.getUniformLocation(program, 'u_Threshold');
  ctx.uniform1f(uniformThreshold, threshold);

  ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT);

  ctx.texImage2D(
    ctx.TEXTURE_2D,
    0,
    ctx.RGBA,
    ctx.RGBA,
    ctx.UNSIGNED_BYTE,
    image
  );
  ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
}
