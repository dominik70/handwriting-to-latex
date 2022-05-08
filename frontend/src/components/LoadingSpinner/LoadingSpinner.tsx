import styles from './LoadingSpinner.module.scss';

export const LoadingSpinner = ({ width = 75 }) => (
  <svg
    className={styles.svg}
    viewBox='0 0 24 24'
    xmlns='<http://www.w3.org/2000/svg>'
    width={width}
  >
    <title id='svg-icon-loading'>Loading</title>
    <circle
      className={styles.path}
      cx='12'
      cy='12'
      r='8'
      strokeLinecap='round'
      strokeWidth={2}
      fill='none'
    />
  </svg>
);
