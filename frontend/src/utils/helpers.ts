export const isCanvasBlank = (canvas: HTMLCanvasElement) => {
  return !canvas
    .getContext('2d')
    ?.getImageData(0, 0, canvas.width, canvas.height)
    .data.some((channel) => channel !== 255);
};
