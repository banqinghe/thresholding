import React, { useState, useEffect, useRef } from 'react';
import { loadImage } from '../utils';
import {
  getWebGLPrograms,
  renderImage,
  thresholding,
  webglStatus,
} from '../lib';
import { isMobile } from '../utils';
import cn from 'classnames';

export interface CanvasImageProps {
  imageUrl: string;
  threshold: number;
  className?: string;
}

export default React.memo(function CanvasImage(props: CanvasImageProps) {
  const { className, imageUrl, threshold } = props;

  const imageRef = useRef<HTMLImageElement | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const executeThresholding = (
    ctx: WebGL2RenderingContext,
    image: HTMLImageElement
  ) => {
    thresholding(ctx, image, threshold);
  };

  const calculateZoomRatio = (
    imageWidth: number,
    imageHeight: number,
    containerWidth: number
  ) => {
    if (isMobile()) {
      return containerWidth / imageWidth;
    }
    if (imageWidth > imageHeight) {
      return containerWidth / imageWidth;
    } else {
      const main = document.querySelector('main')!;
      const mainStyle = getComputedStyle(main);
      const paddingHeight =
        parseInt(mainStyle.getPropertyValue('padding-top'), 10) +
        parseInt(mainStyle.getPropertyValue('padding-bottom'), 10);
      const clientHeight = main.clientHeight - paddingHeight - 2;
      return clientHeight / imageHeight;
    }
  };

  const createAutoSizeCanvas = (
    container: HTMLElement,
    imageWidth: number,
    imageHeight: number,
    zoomRatio: number
  ) => {
    canvasRef.current = container.appendChild(document.createElement('canvas'));

    const canvas = canvasRef.current;
    canvas.width = imageWidth;
    canvas.height = imageHeight;

    // scale but still maintain precision
    canvas.style.width = imageWidth * zoomRatio + 'px';
    canvas.style.height = imageHeight * zoomRatio + 'px';
    canvas.style.border = '1px solid #e5e7eb';

    return canvas;
  };

  const renderCanvas = (image: HTMLImageElement) => {
    const { width, height } = image;

    if (canvasRef.current) {
      canvasRef.current.remove();
    }

    const canvasContainer = canvasContainerRef.current!;
    const zoomRatio = calculateZoomRatio(
      width,
      height,
      canvasContainer.clientWidth
    );

    const canvas = createAutoSizeCanvas(
      canvasContainer,
      width,
      height,
      zoomRatio
    );

    const ctx = canvas.getContext('webgl2', {
      preserveDrawingBuffer: true,
    })!;

    if (webglStatus.ctx !== ctx) {
      const programs = getWebGLPrograms(ctx);

      webglStatus.ctx = ctx;
      webglStatus.renderImage = programs.renderImage;
      webglStatus.thresholding = programs.thresholding;
    }

    renderImage(ctx, image);
    executeThresholding(ctx, image);
  };

  useEffect(() => {
    loadImage(imageUrl)
      .then(image => {
        imageRef.current = image;
        renderCanvas(image);
      })
      .catch(console.error);
  }, [imageUrl]);

  useEffect(() => {
    if (!webglStatus.ctx || !imageRef.current) {
      return;
    }
    executeThresholding(webglStatus.ctx, imageRef.current);
  }, [threshold]);

  return (
    <div
      className={cn(className, 'flex justify-center items-center')}
      ref={canvasContainerRef}
    >
      {/* <canvas id="render-canvas"> */}
    </div>
  );
});
