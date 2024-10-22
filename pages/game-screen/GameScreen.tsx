"use client";

import { FC, useState, useRef } from 'react';
import Image from 'next/image';
import Button from '@/shared/ui/buttons/button/Button';
import Input from '@/shared/ui/inputs/Input';
import Modal from "@/features/modal/Modal.tsx";
import { usePrincipal } from "@/app/providers/PrincipalContext.tsx";
import { decimalFormat } from '@/styles/ui/lib/formatNumber.ts';
import { authenticateWithIC, initAgent } from '@/features/modal/Modal.tsx';
import { useBalance } from '@/app/providers/BalanceContext.tsx';
import { gsap } from 'gsap';
import styles from '@/styles/pages/game-screen/gameScreen.module.scss';
import classNameWhite from "@/styles/ui/buttons/white-button/whiteButton.module.scss";

const GameScreen: FC = () => {
  const { principalId, play, deposit, getBalance, setActor } = usePrincipal();
  const { balance } = useBalance();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [userBalance, setUserBalance] = useState<bigint | null>(balance ?? null);
  const [type, setType] = useState<string>("");
  const [betSize, setBetSize] = useState<string | number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const slotRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const coinImages = [
    { src: "/static/png/main-screen/coin2.png", alt: "coin", sizes: "(max-width: 1440px) 54px, 74px" },
    { src: "/static/png/main-screen/coin4.png", alt: "coin", sizes: "(max-width: 1440px) 38px, 52px" },
    { src: "/static/png/main-screen/coin3.png", alt: "coin", sizes: "(max-width: 1440px) 104.83px, 104px" },
    { src: "/static/png/main-screen/coin7.png", alt: "coin", sizes: "(max-width: 1440px) 61.19px, 83.9px" },
    { src: "/static/png/main-screen/coin5.png", alt: "coin", sizes: "65.13px" },
  ];

  const playImages = [
    { src: "/static/png/game-screen/game__icon1.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon2.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon3.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon4.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon5.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon1.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon2.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon3.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon4.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
    { src: "/static/png/game-screen/game__icon5.png", alt: "coin", sizes: "(max-width: 458px) 61.59px, 87.41px" },
  ];

  const handleBetChange = (betType: string) => {
    setType(betType);
  
    switch (betType) {
      case "1/2":
        setBetSize((prev) => +prev * 0.5); 
        break;
      case "2":
        setBetSize((prev) => +prev * 2);
        break;
      case "Max":
        setBetSize(Number(balance));
        break;
      default:
        break;
    }
};

  const { setBalance } = useBalance();

  const handleBetClick = async () => {
    if (!principalId) {
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      await deposit(BigInt(+betSize));
      const result = await play(BigInt(+betSize));
      console.log("Result from play:", result);

      const outcome = result.Ok?.result;
      if (outcome) {
        setResults(Array.from(outcome));
        animateSlots(outcome);
      }

      const updatedBalance = await getBalance();
      console.log("Updated balance:", updatedBalance);
      setBalance(updatedBalance);

    } catch (error) {
      console.error("Error:", error);

      try {
        const identity = await authenticateWithIC();
        const newActor = await initAgent(identity);
        setActor(newActor);
      } catch (error) {
        console.error("Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleArray = (array: any[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const animateSlots = (results: number[]) => {
    results.forEach((result, index) => {
      const slot = slotRefs[index].current;
      if (!slot) return;

      const options = Array.from(slot.querySelectorAll('div'));
      const totalItems = options.length;

      const selectedOption = result;
      const itemHeight = 117;
      const animationSpeed = 0.5;

      gsap.to(slot, {
        y: `-${itemHeight * totalItems}px`,
        duration: animationSpeed,
        ease: "power2.in",
        onComplete: () => {
          gsap.fromTo(slot, {
            y: '0%',
          }, {
            y: `-${(selectedOption + 1) * itemHeight}px`,
            duration: 2 + index,
            ease: "power2.out",
            onUpdate: () => {
              if (parseFloat(String(gsap.getProperty(slot, 'y'))) > -(totalItems * itemHeight - itemHeight)) {
                gsap.set(slot, { y: `+=${itemHeight}px` });
              }
            }
          });
        }
      });
    });
  };

  const handleBetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBetSize = parseFloat(e.target.value);
  
    if (!isNaN(newBetSize)) {
      setBetSize(Math.min(newBetSize, Number(balance)));
    } 
  };

  return (
    <section className={styles.game}>
      <Image src="/static/jpg/game-bg.jpg" alt="Background Image" fill sizes="100dvw" className={styles.game__background} priority />
      <div className={styles.game__blur} />

      {coinImages.map((coin, index) => (
        <div key={index} className={`${styles[`coin${index + 1}`]} coin${index + 1}`}>
          <div className={styles[`coin${index + 1}__wrapper`]}>
            <Image src={coin.src} alt={coin.alt} fill sizes={coin.sizes} />
          </div>
        </div>
      ))}

      <div className={styles.astronaut}>
        <div className={styles.astronaut__wrapper}>
          <Image src={"/static/png/game-screen/astronaut.png"} alt='astronaut' fill sizes="(max-width: 1440px) 478.44px, 656px" aria-hidden="true" priority />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.content__left}>
          <div>
            <div className={styles.content__prize}>
              <Image src={"/static/png/game-screen/prize.png"} alt="prize" fill sizes="(max-width: 458px) 24.56px, 36px" />
            </div>
            <span aria-live="polite">{decimalFormat(5698.88)}</span>
          </div>
          <div className='images'>
            <div ref={slotRefs[0]}>
              {shuffleArray(playImages).map((coin, index) => (
                <div key={index}>
                  <Image className='item' src={coin.src} alt={coin.alt} fill sizes="(max-width: 458px) 61.59px, 87.41px" />
                </div>
              ))}
            </div>
            <div ref={slotRefs[1]}>
              {shuffleArray(playImages).map((coin, index) => (
                <div key={index}>
                  <Image className='item' src={coin.src} alt={coin.alt} fill sizes="(max-width: 458px) 61.59px, 87.41px" />
                </div>
              ))}
            </div>
            <div ref={slotRefs[2]}>
              {shuffleArray(playImages).map((coin, index) => (
                <div key={index}>
                  <Image className='item' src={coin.src} alt={coin.alt} fill sizes="(max-width: 458px) 61.59px, 87.41px" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.content__right}>
          <form>
            <div>
              <div>
                <label htmlFor='bestSize'>Bet size</label>
                <Input id='betSize' max={Number(balance)} value={betSize} min={0}  onChange={handleBetValueChange} className={styles.input__first} />
              </div>
              <div className={styles.content__buttons}>
              <button onClick={(e) => {e.preventDefault(); handleBetChange("1/2")}} className={type === "1/2" ? styles.active__button : ""}><span>1/2</span></button>
              <button onClick={(e) => {e.preventDefault(); handleBetChange("2")}} className={type === "2" ? styles.active__button : ""}><span>2x</span></button>
              <button onClick={(e) => {e.preventDefault(); handleBetChange("Max")}} className={type === "Max" ? styles.active__button : ""}><span>Max</span></button>
              </div>
            </div>
          </form>

          <Button onClick={handleBetClick} className={classNameWhite.button} disabled={isLoading}>MAKE A BET</Button>

          <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
    </section>
  );
};

export default GameScreen;
