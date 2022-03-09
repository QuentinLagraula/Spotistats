import styles from "../../styles/Home.module.css";

const ThemeSwitch = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: Function;
}) => {
  return (
    <label id="switch" className={styles.switch}>
      <input
        type="checkbox"
        checked={theme !== "dark"}
        onChange={() => {
          setTheme(theme !== "dark" ? "dark" : "light");
        }}
        id="slider"
      />
      <span className={styles.slider} />
    </label>
  );
};

export default ThemeSwitch;
