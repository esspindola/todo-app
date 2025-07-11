import styles from "../../styles/Searchbar.module.scss";
import Button from "./Button";

export default function Searchbar() {
  return (
    <div className={styles.SearchbarWrapper}>
      <input
        className={styles.SearchInput}
        type="text"
        placeholder="Search tasks..."
        disabled
      />
      <Button className={styles.FilterButton} disabled>
        Filters
      </Button>
    </div>
  );
}
