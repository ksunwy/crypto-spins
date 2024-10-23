"use client";
import { FC, useEffect, useState } from 'react';
import gsap from 'gsap';
import Image from "next/image";
import Modal from "@/features/modal/Modal.tsx";
import Button from '@/shared/ui/buttons/button/Button.tsx';
import TransparentButton from "@/shared/ui/buttons/transparent-button/TransparentButton.tsx";
import styles from "@/styles/pages/main-screen/mainScreen.module.scss";
import classNameWhite from "@/styles/ui/buttons/white-button/whiteButton.module.scss";
import classNameTransparent from "@/styles/ui/buttons/transparent-button/transparentButton.module.scss";

const coinImages = [
  { src: "/static/png/main-screen/coin1.png", alt: "coin", sizes: "(max-width: 320px) 57px, (max-width: 1440px) 114px, 164px" },
  { src: "/static/png/main-screen/coin2.png", alt: "coin", sizes: "(max-width: 744px) 108px, 128px" },
  { src: "/static/png/main-screen/coin3.png", alt: "coin", sizes: "(max-width: 320px) 47.12px, (max-width: 1440px) 116px, 189.13px" },
  { src: "/static/png/main-screen/coin4.png", alt: "coin", sizes: "(max-width: 744px) 58px, (max-width: 1440px) 108px, 119.56px" },
  { src: "/static/png/main-screen/coin5.png", alt: "coin", sizes: "(max-width: 744px) 114.31px, (max-width: 1440px) 114.31px, 187.1px" },
  { src: "/static/png/main-screen/coin6.png", alt: "coin", sizes: "(max-width: 320px) 39.92px, (max-width: 1440px) 117px, 154.34px" },
  { src: "/static/png/main-screen/coin7.png", alt: "coin", sizes: "(max-width: 320px) 43.09px, (max-width: 744px) 93.91px, (max-width: 1440px) 93.91px, 152.63px" },
];

const MainScreen: FC = () => {

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConnectClick = () => {
    setIsOpen(true);
  };


  useEffect(() => {
    const paths = document.querySelectorAll('svg path');

    paths.forEach((path, index) => {
      const direction = index % 2 === 0 ? 1 : -1; 
      const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: index * 0.2 }); 

      tl.fromTo(
        path,
        { y: direction * 150 },
        { y: 0, duration: 1.5, ease: 'power2.inOut', }
      ).to(path, {  y: direction * -150, duration: 1.5,  ease: 'power2.inOut', });
    });

    gsap.to(".coin1", { y: 25, duration: 2.5, scale: .9, ease: "expoScale(0.5,7,none)",  repeat: -1, yoyo: true, });
    gsap.to(".coin2", { y: -30, duration: 3,  ease: "power2.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin3", { y: -30, duration: 2.4, scale: .8,  ease: "power1.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin4", { y: 30, duration: 3,  ease: "power2.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin5", { y: -25, duration: 2.5,  ease: "power2.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin6", { y: -18, duration: 1.8,  ease: "power2.out",  repeat: -1, yoyo: true, });
    gsap.to(".coin7", { y: -18, duration: 1.9,  ease: "power1.out",  repeat: -1, yoyo: true, });
  }, []);

  return (
    <section className={styles.main}>
      <Image src="/static/jpg/main-screen/bg.jpg" alt="Background Image" fill sizes="100dvw" className={styles.main__background} priority />
      <Image src="/static/jpg/main-screen/mobile__bg.jpg" alt="Background Image" fill sizes="100dvw" className={styles.main__background_mobile} priority />
      <div className={styles.main__blur} />
      {/* sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" */}

      {coinImages.map((coin, index) => (
        <div key={index} className={`${styles[`coin${index + 1}`]} coin${index + 1}`}>
          <div className={styles[`coin${index + 1}__wrapper`]}>
            <Image src={coin.src} alt={coin.alt} fill sizes={coin.sizes} />
          </div>
        </div>
      ))}

      <div className={styles.chest}>
        <div className={styles.chest__wrapper}>
          <Image src="/static/png/main-screen/treasure_chest.png" alt="coin" fill sizes="(max-width: 320px) 142.71px, (max-width: 1440px) 311px, 373px" />
        </div>
      </div>

      <div className={styles.main__content}>
        <div className={styles.main__titles}>
          <div>
            <div className={styles.main__image}>
              <svg width="100%" height="100%" viewBox="0 0 272 134" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5604 123.046C28.0906 123.046 20.1233 120.951 13.6583 116.763C7.19339 112.483 2.64061 106.701 0 99.4166L16.1168 89.9923C19.8501 99.7353 27.1801 104.607 38.1068 104.607C43.388 104.607 47.2578 103.651 49.7163 101.739C52.1748 99.8263 53.4041 97.4134 53.4041 94.4996C53.4041 91.1305 51.9017 88.5354 48.8968 86.7143C45.892 84.8022 40.5197 82.7534 32.78 80.5681C28.5004 79.2933 24.8582 78.0185 21.8533 76.7437C18.9396 75.469 15.9803 73.7844 12.9754 71.6902C10.0616 69.5048 7.83078 66.7732 6.28283 63.4952C4.73489 60.2172 3.96092 56.3928 3.96092 52.0222C3.96092 43.3719 7.01128 36.4972 13.112 31.3981C19.3038 26.2079 26.7248 23.6128 35.3751 23.6128C43.1148 23.6128 49.8984 25.525 55.726 29.3493C61.6446 33.0826 66.2429 38.3183 69.5209 45.0564L53.6773 54.2075C49.8529 46.0125 43.7522 41.915 35.3751 41.915C31.4597 41.915 28.3638 42.8256 26.0874 44.6467C23.9021 46.3767 22.8094 48.6531 22.8094 51.4758C22.8094 54.4807 24.0387 56.9392 26.4972 58.8513C29.0467 60.6724 33.8727 62.6757 40.975 64.861C43.8888 65.7716 46.0741 66.5 47.531 67.0463C49.0789 67.5016 51.1277 68.2756 53.6773 69.3683C56.3179 70.3699 58.3211 71.3259 59.6869 72.2365C61.1438 73.1471 62.7828 74.3763 64.6039 75.9242C66.425 77.4722 67.7909 79.0657 68.7014 80.7047C69.703 82.3437 70.5225 84.3469 71.1599 86.7143C71.8884 88.9907 72.2526 91.4948 72.2526 94.2264C72.2526 103.059 69.0201 110.07 62.5552 115.26C56.1813 120.45 47.8497 123.046 37.5604 123.046Z" fill="white" />
                <path d="M118.162 0.691666C127.358 0.691666 135.098 3.78756 141.381 9.97934C147.664 16.1711 150.805 23.7743 150.805 32.7888C150.805 41.8033 147.664 49.4064 141.381 55.5982C135.098 61.7899 127.358 64.8858 118.162 64.8858H101.362V96.3H82.5134V0.691666H118.162ZM118.162 47.2666C122.168 47.2666 125.492 45.9008 128.132 43.1691C130.773 40.3464 132.093 36.8863 132.093 32.7888C132.093 28.6002 130.773 25.1401 128.132 22.4084C125.492 19.6768 122.168 18.3109 118.162 18.3109H101.362V47.2666H118.162Z" fill="white" />
                <path d="M161.71 37.9417H180.559V133.55H161.71V37.9417Z" fill="white" />
                <path d="M252.208 16.8333H271.056V112.442H256.715L215.74 53.984V112.442H196.891V16.8333H211.233L252.208 75.1544V16.8333Z" fill="white" />
              </svg>
            </div>
            <h1>& Win </h1>
          </div>
          <h2>with Crypto</h2>
        </div>
        <p className={styles.main__description}>
          Experience the thrill of CryptoSpins — the ultimate crypto casino.
          Play now and hit the jackpot with your favorite cryptocurrency!
        </p>
        <div className={styles.main__buttons}>
          <Button onClick={handleConnectClick} className={classNameWhite.button}>
            CONNECT
          </Button>
          <TransparentButton href="/game" className={classNameTransparent.link}>
            START APP
          </TransparentButton>
        </div>
      </div>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
    </section>
  );
};

export default MainScreen;
