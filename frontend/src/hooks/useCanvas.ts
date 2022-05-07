import { useState, useRef, useEffect } from 'react';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../utils/constants';

export const useCanvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const context = canvas.getContext('2d');

      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.fillStyle = 'white';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.lineWidth = 1.5;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: { nativeEvent: any }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const finishDrawing = async () => {
    if (contextRef.current && canvasRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
    if (!isDrawing) {
      return;
    }

    const { offsetX, offsetY } = nativeEvent;

    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && contextRef.current) {
      contextRef.current.fillStyle = 'white';
      contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return {
    canvasRef,
    startDrawing,
    finishDrawing,
    draw,
    clearCanvas,
  };
};
