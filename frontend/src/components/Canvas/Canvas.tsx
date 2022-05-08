import styles from './Canvas.module.scss';
import { useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useTranslate } from '../../hooks/useTranslate';
import { Button } from '../Button/Button';

export const Canvas = () => {
  const { canvasRef, startDrawing, finishDrawing, draw, clearCanvas } =
    useCanvas();
  const { expression, translate, isLoading } = useTranslate();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleTranslate = async () => {
    const url = canvasRef?.current;

    if (url) {
      translate(url);
      setIsCopied(false);
    }
  };

  const copyExpression = () => {
    if (expression) {
      navigator.clipboard.writeText(expression);
      setIsCopied(true);
    }
  };

  return (
    <>
      <p>Draw mathematical expression:</p>
      <canvas
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      >
        Canvas
      </canvas>
      <div className={styles.buttonContainer}>
        <Button type='submit' onClick={handleTranslate} disabled={isLoading}>
          Translate to LaTeX
        </Button>
        <Button
          type='button'
          variant='outlined'
          size='small'
          onClick={clearCanvas}
        >
          clear board
        </Button>
      </div>
      {isLoading
        ? 'Loading...'
        : expression &&
          expression.length > 0 && (
            <>
              <div className={styles.expression}>
                <span>Output: </span>
                {expression}
                <Button
                  type='button'
                  variant='outlined'
                  size='small'
                  onClick={copyExpression}
                >
                  <span>{isCopied ? 'copied' : <span>Copy</span>}</span>
                </Button>
              </div>
            </>
          )}
    </>
  );
};
