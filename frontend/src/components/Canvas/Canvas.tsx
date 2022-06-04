import styles from './Canvas.module.scss';
import { useCanvas } from '../../hooks/useCanvas';
import { useTranslate } from '../../hooks/useTranslate';
import { Button } from '../Button/Button';
import { Error } from '../Error/Error';
import { Output } from '../Output/Output';

export const Canvas = () => {
  const { canvasRef, startDrawing, finishDrawing, draw, clearCanvas } =
    useCanvas();
  const { expression, translate, isLoading, error } = useTranslate();

  const handleTranslate = async () => {
    const canvas = canvasRef?.current;

    if (canvas) {
      translate(canvas);
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
        onTouchStart={startDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={draw}
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
      {error.length > 0 ? (
        <Error message={error} />
      ) : (
        <Output isLoading={isLoading} expression={expression} />
      )}
    </>
  );
};
