"use client";
// export const dynamic = "force-dynamic";
import gsap from "gsap";
import { FC, useEffect } from 'react';
// import MainScreen from "@/pages/main-screen/MainScreen.tsx";
import styles from "./page.module.scss";

import dynamic from "next/dynamic";

const MainScreen = dynamic(() => import("@/pages/main-screen/MainScreen.tsx"), {
  ssr: false
});

const Home: FC = () => {
  const linksPreventDefault = () => {
    const links = Array.from(document.querySelectorAll('a[href="#"]'));
    links.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  };

  useEffect(() => {
    linksPreventDefault();
  }, []);

  return (
    <main className={styles.page}>
      <MainScreen />
    </main>
  );
};

export default Home;