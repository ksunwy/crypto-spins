"use client";
import gsap from "gsap";
import { FC, useEffect } from 'react';
import GameScreen from '@/pages/game-screen/GameScreen.tsx';

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

    gsap.to(".coin1", { y: 25, duration: 2.5, scale: .9, ease: "expoScale(0.5,7,none)",  repeat: -1, yoyo: true, });
    gsap.to(".coin2", { y: -30, duration: 3,  ease: "power2.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin3", { y: -30, duration: 2.4, scale: .8,  ease: "power1.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin4", { y: 30, duration: 3,  ease: "power2.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin5", { y: -25, duration: 2.5,  ease: "power2.out",  repeat: -1, yoyo: true, });
  }, []);
  return (
    <section>
      <GameScreen />
    </section>
  )
}

export default Game