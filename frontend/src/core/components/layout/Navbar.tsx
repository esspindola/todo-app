import styles from "../../styles/Navbar.module.scss";
import Button from "../ui/Button";

export default function Navbar() {
  return (
    <nav className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        <div className={styles.NavbarLeft}>
          <span className={styles.Logo}>BtYslf</span>
        </div>
        <div className={styles.NavbarCenter}>
          <Button className={styles.PillBtn}>Profile</Button>
          <Button className={styles.PillBtn}>Home</Button>
        </div>
        <div className={styles.NavbarRight}>
          <button className={styles.ActionBtnLogin}>&gt; Login &lt;</button>
          <Button className={styles.ActionBtn}>Sign Up</Button>
        </div>
      </div>
    </nav>
  );
}
