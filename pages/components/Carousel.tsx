import { ReactNode, useState, useEffect, useRef } from "react";
import styles from "../../styles/Home.module.css";

const Carousel = ({
  leftComponent,
  rightComponent,
  loadSize,
  setLoadSize,
}: {
  leftComponent: ReactNode;
  rightComponent: ReactNode;
  loadSize: number;
  setLoadSize: Function;
}) => {
  const [left, _setLeft] = useState(true);
  const leftRef = useRef(left);
  const setLeft = (data: boolean) => {
    leftRef.current = data;
    _setLeft(data);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" && leftRef.current) setLeft(false);
    if (event.key === "ArrowLeft" && !leftRef.current) setLeft(true);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.previous} ${left && styles.left}`}
        onClick={() => {
          setLeft(true);
        }}
      >
        &lt;
      </button>

      <div className={styles.content}>
        {left && (
          <div className={`${styles.content} ${styles.left}`}>
            {leftComponent}
          </div>
        )}
        {!left && (
          <div className={`${styles.content} ${styles.right}`}>
            {rightComponent}
          </div>
        )}
        <h3 className={styles.title} onClick={() => setLoadSize(loadSize + 1)}>
          LOAD MORE...
        </h3>
      </div>

      <button
        className={`${styles.next} ${!left && styles.right}`}
        onClick={() => {
          setLeft(false);
        }}
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
