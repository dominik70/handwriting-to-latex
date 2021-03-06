import { useState } from 'react';
import { isCanvasBlank } from '../utils/helpers';

export const useTranslate = () => {
  const [expression, setExpression] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const translate = async (canvasRef: HTMLCanvasElement) => {
    if (isCanvasBlank(canvasRef)) {
      setError('The board cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const url = canvasRef.toDataURL();
      const blob = await (await fetch(url)).blob();

      const fd = new FormData();
      fd.append('file', blob);

      const response = await fetch(`/api/translate`, {
        method: 'POST',
        body: fd,
      });

      setExpression(await response.json());
      setError('');
    } catch {
      setExpression(null);
      setError('Failed to translate an expression');
    } finally {
      setIsLoading(false);
    }
  };

  return { translate, expression, isLoading, error };
};
