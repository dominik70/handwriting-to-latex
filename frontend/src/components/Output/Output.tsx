import { MathJax } from 'better-react-mathjax';
import { useEffect, useState } from 'react';
import { Button } from '../Button/Button';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import styles from './Output.module.scss';

interface Props {
  isLoading: boolean;
  expression: string | null;
}

export const Output = ({ isLoading, expression }: Props) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    setIsCopied(false);
  }, [expression]);

  const copyExpression = () => {
    if (expression) {
      navigator.clipboard.writeText(expression);
      setIsCopied(true);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!expression) {
    return null;
  }

  return (
    <div>
      <p className={styles.recognizedExpression}>
        Output:
        <MathJax>{`$$${expression}{}$$`}</MathJax>
      </p>
      <div>
        LaTeX code:
        <code className={styles.code}>{expression}</code>
        <Button
          type='button'
          variant='outlined'
          size='small'
          onClick={copyExpression}
        >
          <span>{isCopied ? 'copied' : <span>Copy</span>}</span>
        </Button>
      </div>
    </div>
  );
};
