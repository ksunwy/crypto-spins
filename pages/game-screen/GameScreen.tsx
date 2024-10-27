"use client";

import { FC, useState, useRef, useEffect, use } from 'react';
import Image from 'next/image';
import Button from '@/shared/ui/buttons/button/Button';
import Input from '@/shared/ui/inputs/Input';
import Modal from "@/features/modal/Modal.tsx";
import { usePrincipal } from "@/app/providers/PrincipalContext.tsx";
import { decimalFormat } from '@/styles/ui/lib/formatNumber.ts';
import { authenticateWithIC, initAgent } from '@/features/modal/Modal.tsx';
import { coinImages, playImages } from '@/shared/lib/ImagesLinks.ts';
import { gsap } from 'gsap';
import styles from '@/styles/pages/game-screen/gameScreen.module.scss';
import classNameWhite from "@/styles/ui/buttons/white-button/whiteButton.module.scss";

const GameScreen: FC = () => {
  const context = usePrincipal();
if (!context) {
  return
}
// GameScreen.tsx:90 Error: RangeError: The number 0.1 cannot be converted to a BigInt because it is not an integer
const { principalId, play, deposit, getBalance, setActor,  setBalance } = context;
// balance,
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [betSize, setBetSize] = useState<string | number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<number[]>([]);
let balance = 10000000000;
  const [shuffledImages, setShuffledImages] = useState<number[][]>([[], [], []]);

  useEffect(() => {
    const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5);

    const shuffled = [shuffleArray([...playImages]), shuffleArray([...playImages]), shuffleArray([...playImages])];
    setShuffledImages(shuffled);

    gsap.to(".coin1", { y: 25, duration: 2.5, scale: .9, ease: "expoScale(0.5,7,none)",  repeat: -1, yoyo: true });
    gsap.to(".coin2", { y: -30, duration: 3, ease: "power2.out",  repeat: -1, yoyo: true });
    gsap.to(".coin3", { y: -30, duration: 2.4, scale: .8, ease: "power1.out",  repeat: -1, yoyo: true });
    gsap.to(".coin4", { y: 30, duration: 3, ease: "power2.out",  repeat: -1, yoyo: true });
    gsap.to(".coin5", { y: -25, duration: 2.5, ease: "power2.out",  repeat: -1, yoyo: true });
  }, []);

  const slotRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

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

  const handleBetClick = async () => {
    if (!principalId) {
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const betSizeInt = BigInt(Math.floor(Number(betSize)));

      await deposit(betSizeInt);
      const result = await play(betSizeInt);
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
        setIsOpen(false);
      } catch (error) {
        console.error("Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   animateSlots([4, 4, 1]);


  //   setTimeout(() => {
  //     animateSlots([1, 4, 1]);
  //   }, 3000);
  // }, [])

  const animateSlots = (results: number[]) => {
    const itemHeight = 73;
    const itemLastHeight = 63;
    const baseAnimationDuration = 2;
    const animationSpeed = 0.2;
  
    results.forEach((result, index) => {
      const slot = slotRefs[index].current;
      if (!slot) return;
  
      const options = Array.from(slot.querySelectorAll('div'));
      const totalItems = options.length;
  
      const isMiddleSlot = index === 1;
      const isLastSlot = index === results.length - 1;
  
      const initialY = isMiddleSlot ? -itemHeight * totalItems : '0%';
      const targetY = isMiddleSlot
        ? (result + 1) * itemHeight
        : -(result + 1) * itemHeight;
  
      const duration = isLastSlot ? 0.5 : baseAnimationDuration + index;
  
      gsap.fromTo(
        slot,
        { y: initialY },
        {
          y: targetY,
          duration: duration,
          ease: "power1.out(1, 0.3)",
          onComplete: () => {
            const finalY = isMiddleSlot
              ? (result + 1) * itemHeight
              : isLastSlot
              ? -(result + 1) * itemLastHeight
              : -(result + 1) * itemHeight;
            gsap.set(slot, { y: finalY });
          },
        }
      );
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
            {shuffledImages.map((images, columnIndex) => (
              <div key={columnIndex} ref={slotRefs[columnIndex]}>
                {images.map((coin, index) => (
                  <div key={index}>
                    {/* @ts-ignore */}
                    <Image className='item' src={coin.src} alt={coin.alt} fill sizes="(max-width: 458px) 61.59px, 87.41px" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.content__right}>
          <form>
            <div>
              <div>
                <label htmlFor='betSize'>Bet size</label>
                <Input id='betSize' max={Number(balance)} value={betSize} min={0.1}  onChange={handleBetValueChange} className={styles.input__first} />
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
