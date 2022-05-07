import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  type: 'button' | 'submit' | 'reset';
  variant?: 'contained' | 'outlined';
  size?: 'small' | 'large';
}

export const Button = ({
  children,
  type,
  onClick,
  variant = 'contained',
  size = 'large',
}: Props) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
