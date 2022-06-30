import { webglStatus } from './global';

function initVertexBuffers(ctx: WebGL2RenderingContext, program: WebGLProgram) {
  const verticesTexCoords = new Float32Array([
    -1.0, 1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
    1.0, 0.0,
  ]);

  const ELEMENT_SIZE = verticesTexCoords.BYTES_PER_ELEMENT;

  const vertexTexCoordBuffer = ctx.createBuffer();
  ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexTexCoordBuffer);
  ctx.bufferData(ctx.ARRAY_BUFFER, verticesTexCoords, ctx.STATIC_DRAW);

  const attrPosition = ctx.getAttribLocation(program, 'a_Position');
  ctx.vertexAttribPointer(
    attrPosition,
    2,
    ctx.FLOAT,
    false,
    ELEMENT_SIZE * 4,
    0
  );
  ctx.enableVertexAttribArray(attrPosition);

  const attrTexCoord = ctx.getAttribLocation(program, 'a_TexCoord');
  ctx.vertexAttribPointer(
    attrTexCoord,
    2,
    ctx.FLOAT,
    false,
    ELEMENT_SIZE * 4,
    ELEMENT_SIZE * 2
  );
  ctx.enableVertexAttribArray(attrTexCoord);
}

function loadTexture(
  ctx: WebGL2RenderingContext,
  texture: WebGLTexture,
  uniformSampler: WebGLUniformLocation,
  image: HTMLImageElement
) {
  ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 1);
  ctx.activeTexture(ctx.TEXTURE0);

  ctx.bindTexture(ctx.TEXTURE_2D, texture);
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
  // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
  // ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.MIRRORED_REPEAT);

  ctx.texImage2D(
    ctx.TEXTURE_2D,
    0,
    ctx.RGBA,
    ctx.RGBA,
    ctx.UNSIGNED_BYTE,
    image
  );

  ctx.uniform1i(uniformSampler, 0);

  ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
}

function initTextures(
  ctx: WebGL2RenderingContext,
  program: WebGLProgram,
  image: HTMLImageElement
) {
  const texture = ctx.createTexture();
  const uniformSampler = ctx.getUniformLocation(program, 'u_Sampler');

  if (!texture || !uniformSampler) {
    alert('Failed to initialize textures');
    return;
  }

  loadTexture(ctx, texture, uniformSampler, image);
}

/**
 * render image on WebGL2 context
 */
export function renderImage(
  ctx: WebGL2RenderingContext,
  image: HTMLImageElement
) {
  const program = webglStatus.renderImage;
  if (!program) {
    alert('Program is null');
    return;
  }

  ctx.useProgram(program);
  ctx.clearColor(1.0, 1.0, 1.0, 1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT);

  initVertexBuffers(ctx, program);
  initTextures(ctx, program, image);
}
