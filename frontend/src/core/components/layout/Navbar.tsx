import { useSnapshot } from "valtio";
import { authStore } from "../../store/authStore";
import { api } from "../../utils/api.service";
import styles from "../../styles/Navbar.module.scss";
import Button from "../ui/Button";
import { useEffect } from "react";

export default function Navbar() {
  const snap = useSnapshot(authStore);

  useEffect(() => {
    authStore.loadFromCookies();
  }, []);

  useEffect(() => {
    if (snap.access && !snap.user) {
      const fetchUser = async () => {
        try {
          const userData = await api.getUser();
          if (userData.username) {
            authStore.user = {
              username: userData.username,
              email: userData.email || "",
            };
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          authStore.logout();
        }
      };
      fetchUser();
    }
  }, [snap.access, snap.user]);

  const handleLogout = () => {
    authStore.logout();
    window.location.href = "/";
  };

  return (
    <nav className={styles.Navbar}>
      <div className={styles.NavbarContent}>
        <div className={styles.NavbarLeft}>
          <span className={styles.Logo}>BtYslf</span>
        </div>
        <div className={styles.NavbarCenter}>
          <Button href="/profile" className={styles.PillBtn}>
            Profile
          </Button>
          <Button href="/" className={styles.PillBtn}>
            Home
          </Button>
        </div>
        <div className={styles.NavbarRight}>
          {snap.access && snap.user ? (
            <>
              <span className={styles.WelcomeText}>
                Hello, {snap.user.username}
              </span>
              <button onClick={handleLogout} className={styles.ActionBtnLogin}>
                &gt; Logout &lt;
              </button>
            </>
          ) : (
            <>
              <a href="/auth/login" className={styles.ActionBtnLogin}>
                &gt; Login &lt;
              </a>
              <Button href="/auth/register" className={styles.ActionBtn}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
