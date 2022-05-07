import styles from './Canvas.module.scss';
import { useCanvas } from '../../hooks/useCanvas';
import { Button } from '../Button/Button';

export const Canvas = () => {
  const { canvasRef, startDrawing, finishDrawing, draw, clearCanvas } =
    useCanvas();

  return (
    <>
      <p>Draw expression:</p>
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
        <Button
          type='button'
          variant='outlined'
          size='small'
          onClick={clearCanvas}
        >
          clear board
        </Button>
      </div>
    </>
  );
};
