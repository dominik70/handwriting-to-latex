import styles from './Symbols.module.scss';
import { SYMBOLS } from '../../utils/constants';

export const Symbols = () => {
  return (
    <section>
      <h2 className={styles.heading}>Following symbols can be recognized</h2>
      <div className={styles.symbols}>
        {SYMBOLS.map((symbol) => (
          <figure className={styles.symbol} key={symbol}>
            <figcaption className={styles.label}>{symbol}</figcaption>
            <img
              src={`./img/sample_data/${symbol}.jpg`}
              alt={symbol}
              className={styles.img}
            />
          </figure>
        ))}
      </div>
    </section>
  );
};
