"use client"; // top to the file

import Main from "../components/main";
import { ConfirmProvider } from "material-ui-confirm";
import styles from "../styles/page.module.css";


export default function Home() {
  return (
    <main className={styles.main}>
      <ConfirmProvider>
        <Main/>
      </ConfirmProvider>
    </main>
  );
}
