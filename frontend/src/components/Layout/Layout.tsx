import styles from './Layout.module.scss';

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return <div className={styles.layout}>{children}</div>;
};
