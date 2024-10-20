import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from "@/styles/widgets/footer/footer.module.scss";

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__left}>
        <Link href={"/"} className={styles.footer__logo}>
          <Image src={"/static/svg/logo.svg"} alt="logo" aria-label="logo" fill />
        </Link>
        <span aria-label="All rights reserved">2024 © All rights reserved</span>
      </div>
      <Link href={"/"} className={styles.footer__right} aria-label="Privacy policy">Privacy policy</Link>
    </footer>
  )
}

export default Footer