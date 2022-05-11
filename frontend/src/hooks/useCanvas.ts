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

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    let x;
    let y;

    if ('touches' in e) {
      const touch = e.touches[0];
      const rect = canvasRef.current!.getBoundingClientRect();

      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const finishDrawing = async () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement, MouseEvent>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) {
      return;
    }

    let x;
    let y;

    if ('touches' in e) {
      var touch = e.touches[0];

      const rect = canvasRef.current!.getBoundingClientRect();

      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    if (contextRef.current) {
      contextRef.current.lineTo(x, y);
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
