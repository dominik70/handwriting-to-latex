import { useState } from 'react';
import { API_URL } from '../utils/constants';

export const useTranslate = () => {
  const [expression, setExpression] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const translate = async (canvasRef: HTMLCanvasElement) => {
    setIsLoading(true);
    try {
      const url = canvasRef.toDataURL();
      const blob = await (await fetch(url)).blob();

      const fd = new FormData();
      fd.append('file', blob);

      const response = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        body: fd,
      });

      setExpression(await response.json());
    } catch {
      setExpression(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { translate, expression, isLoading };
};
