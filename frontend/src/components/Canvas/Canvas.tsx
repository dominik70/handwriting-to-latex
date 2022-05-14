import styles from './Canvas.module.scss';
import { useState } from 'react';
import { useCanvas } from '../../hooks/useCanvas';
import { useTranslate } from '../../hooks/useTranslate';
import { Button } from '../Button/Button';
import { Error } from '../Error/Error';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

export const Canvas = () => {
  const { canvasRef, startDrawing, finishDrawing, draw, clearCanvas } =
    useCanvas();
  const { expression, translate, isLoading, error } = useTranslate();
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
      <p id='label' className={styles.label}>
        Write mathematical expression:
      </p>
      <canvas
        className={styles.canvas}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
        onTouchStart={startDrawing}
        aria-labelledby='label'
      >
        Canvas
      </canvas>
      <div className={styles.buttonContainer}>
        <Button
          type='button'
          variant='outlined'
          size='small'
          onClick={clearCanvas}
        >
          clear board
        </Button>
        <Button type='submit' onClick={handleTranslate} disabled={isLoading}>
          Translate to LaTeX
        </Button>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        expression &&
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
        )
      )}
      {error.length > 0 && <Error message={error} />}
    </>
  );
};
