import styles from './Error.module.scss';

interface Props {
  message: string;
}

export const Error = ({ message }: Props) => {
  return <p className={styles.error}>{message}</p>;
};
