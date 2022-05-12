import { useState, useRef, useEffect } from 'react';

export const useCanvas = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      const context = canvas.getContext('2d');

      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineWidth = 1.5;
        contextRef.current = context;
      }
    }
  }, [window.innerWidth]);

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
      const el = touch.target as HTMLElement;
      const borderX = (el.clientWidth - el.offsetWidth) / 2;
      const borderY = (el.clientHeight - el.offsetHeight) / 2;

      x = touch.clientX - rect.left + borderX;
      y = touch.clientY - rect.top + borderY;
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
      const touch = e.touches[0];
      const rect = canvasRef.current!.getBoundingClientRect();
      const el = touch.target as HTMLElement;
      const borderX = (el.clientWidth - el.offsetWidth) / 2;
      const borderY = (el.clientHeight - el.offsetHeight) / 2;

      x = touch.clientX - rect.left + borderX;
      y = touch.clientY - rect.top + borderY;
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
