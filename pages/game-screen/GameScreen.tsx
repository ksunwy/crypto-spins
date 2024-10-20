"use client";
import { FC, useState } from 'react';
import Image from 'next/image';
import Button from '@/shared/ui/buttons/button/Button';
import { decimalFormat } from '@/styles/ui/lib/formatNumber.ts';
import styles from '@/styles/pages/game-screen/gameScreen.module.scss';
import classNameWhite from "@/styles/ui/buttons/white-button/whiteButton.module.scss";
import Input from '@/shared/ui/inputs/Input';

const GameScreen: FC = () => {

    const [type, setType] = useState<string>("");
    const [betSize, setBestSize] = useState<string | number>(0.01);
    const [winnings, seWinnings] = useState<string | number>(0.01);
    const [pay, setPay] = useState<string | number>(0.01);
    const [change, seChange] = useState<string | number>(0.01);

    const coinImages = [
        { src: "/static/png/main-screen/coin2.png", alt: "coin", sizes: "(max-width: 1440px) 54px, 74px" },
        { src: "/static/png/main-screen/coin4.png", alt: "coin", sizes: "(max-width: 1440px) 38px, 52px" },
        { src: "/static/png/main-screen/coin3.png", alt: "coin", sizes: "(max-width: 1440px) 104.83px, 104px" },
        { src: "/static/png/main-screen/coin7.png", alt: "coin", sizes: "(max-width: 1440px) 61.19px, 83.9px" },
        { src: "/static/png/main-screen/coin5.png", alt: "coin", sizes: "65.13px" },
    ];

    const handleBetClick = () => {

    }
      
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
            <Image src={"/static/png/game-screen/astronaut.png"} alt='astronaut' fill sizes="(max-width: 1440px) 478.44px, 656px" aria-hidden="true" />
          </div>
      </div>

      <div className={styles.content}>
        <div className={styles.content__left}>
            <div>
                <div className={styles.content__prize}><Image src={"/static/png/game-screen/prize.png"} alt="prize" fill sizes="(max-width: 458px) 24.56px, 36px" /></div>
                <span aria-live="polite">{decimalFormat(5698.88)}</span>
            </div>
            <div>
                <div>
                    <div><Image src={"/static/png/game-screen/game__icon1.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                    <div><Image src={"/static/png/game-screen/game__icon2.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                    <div><Image src={"/static/png/game-screen/game__icon3.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                </div>
                <div>
                    <div><Image src={"/static/png/game-screen/game__icon3.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                    <div><Image src={"/static/png/game-screen/game__icon2.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                    <div><Image src={"/static/png/game-screen/game__icon1.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                </div>
                <div>
                    <div><Image src={"/static/png/game-screen/game__icon4.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                    <div><Image src={"/static/png/game-screen/game__icon2.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                    <div><Image src={"/static/png/game-screen/game__icon5.png"} alt='coin' fill sizes="(max-width: 458px) 61.59px, 87.41px" /></div>
                </div>
            </div>
        </div>
        <div className={styles.content__right}>
            <form>
                <div>
                    <div>
                        <span>Bet size</span>
                        <Input id='betSize' value={betSize} onChange={(e) => setBestSize(e.target.value)} className={styles.input__first} />
                    </div>
                    <div className={styles.content__buttons}>
                        <button onClick={(e) => {e.preventDefault(); setType("1/2")}} className={type === "1/2" ? styles.active__button : ""}><span>1/2</span></button>
                        <button onClick={(e) => {e.preventDefault(); setType("2")}} className={type === "2" ? styles.active__button : ""}><span>2x</span></button>
                        <button onClick={(e) => {e.preventDefault(); setType("Max")}} className={type === "Max" ? styles.active__button : ""}><span>Max</span></button>
                    </div>
                </div>
                <div className='desktop'>
                    <label htmlFor="winnings">Income with winnings</label>
                    <Input id='winnings' value={winnings} onChange={(e) => seWinnings(e.target.value)} className={`${styles.input__second}`} />
                </div>
                <div>
                    <div>
                        <label htmlFor="pay" className='desktop'>Pay</label>
                        <Input id='pay' value={pay} onChange={(e) => setPay(e.target.value)} className={`${styles.input__third}`} />
                        <Input id='winnings__mobile' value={winnings} onChange={(e) => seWinnings(e.target.value)} className={`${styles.input__second} mobile`} />
                    </div>
                    <div>
                        <label htmlFor="change" className='desktop'>Chance</label>
                        <Input id='change' value={change} onChange={(e) => seChange(e.target.value)} className={styles.input__fourth} />
                    </div>
                </div>
            </form>
            <Button onClick={handleBetClick} className={classNameWhite.button}>MAKE A BET</Button>
        </div>
      </div>
    </section>
  )
}

export default GameScreen