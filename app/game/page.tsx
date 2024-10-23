"use client";
// export const dynamic = "force-dynamic";
import gsap from "gsap";
import { FC, useEffect } from 'react';
// import GameScreen from '@/pages/game-screen/GameScreen.tsx';
import dynamic from "next/dynamic";

const GameScreen = dynamic(() => import("@/pages/game-screen/GameScreen.tsx"), {
  ssr: false,
});

const Game: FC = () => {
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
    <section>
      <GameScreen />
    </section>
  )
}

export default Game