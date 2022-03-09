import styles from "../../styles/Home.module.css";
import { Stats } from "../interfaces";
import { convertTime } from "../utils";

const Top = ({
  stats,
  unit,
  name,
  secondaryRenderer,
}: {
  stats: [string, Stats][];
  unit: string;
  name: string;
  secondaryRenderer: Function;
}) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Top {name}</h2>
      <ol>
        {stats.map(([key, stats]) => (
          <li key={key}>
            {key}: {stats.count} listens ({convertTime(stats.msPlayed, unit)}
            {unit})
            <div className={styles.secondary}>
              {secondaryRenderer(stats)}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Top;
