import styles from "../styles/TitleHeader.module.scss";
import Button from "./ui/Button";

export default function TitleHeader() {
  return (
    <div className={styles.TitleSection}>
      <h1 className={styles.TitleHeader}>Beat Yourself</h1>
      <p className={styles.HeroSubtitle}>
        A simple todo app to help you beat your procrastination habits.
      </p>
      <Button className={styles.Button}>Get Started</Button>
    </div>
  );
}
