"use client";
import { FC, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Modal from "@/features/modal/Modal.tsx";
import Button from '@/shared/ui/buttons/button/Button.tsx';
import { formatString } from '@/styles/ui/lib/formatString.ts';
import { formatNumber } from '@/styles/ui/lib/formatNumber.ts';
import styles from "@/styles/widgets/nav/nav.module.scss";
import className from "@/styles/ui/buttons/purple-button/purpleButton.module.scss";

const Nav: FC = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConnectClick = () => {
    setIsOpen(true);
  };

  const handleCopyClick = (button: string | null) => {
    if (button) {
      const textToCopy = button || "";
      navigator.clipboard.writeText(textToCopy);
    }
  };

  return (
    <>
      <nav className={`${styles.nav} ${pathname === "/game" && styles.game}`}>
        <Link href={"/"} className={`${styles.nav__logo}`}>
          <Image src={"/static/svg/logo.svg"} alt='logo' aria-label="logo" fill priority sizes="100dvw" />
        </Link>
        {pathname === '/game' ? (
          <div className={styles.game__left}>
            <div>
              <div>
                <div><Image src={"/static/png/game-screen/balance__icon.png"} alt="coin" fill sizes="(max-width: 458px) 24px, 40px" /></div>
                <span>{formatNumber(83567.43)}</span>
              </div>
              <Button onClick={() => handleCopyClick("0x3ВАffffKAS")} className={`${styles.game__code}`} ariaHasPopup>{formatString("0x3ВАffffKAS")}</Button>
            </div>
            <div className={styles.user}>
              <div className={styles.user__logo}>
                <Image src={"/static/png/game-screen/user__icon.png"} alt='user__logo' fill sizes="(max-width: 458px) 24px, 40px" />
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={handleConnectClick} className={className.button} ariaHasPopup>Connect</Button>
        )}
      </nav>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}

export default Nav