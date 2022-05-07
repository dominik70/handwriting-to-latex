import styles from './Heading.module.scss';

interface Props {
  children: React.ReactNode;
}

export const Heading = ({ children }: Props) => {
  return <h1 className={styles.heading}>{children}</h1>;
};
