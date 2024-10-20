"use client";
import { FC } from "react";
import Image from "next/image";
import { IModal } from "@/features/types/Types.ts";
import styles from "@/styles/features/modal/modal.module.scss";

const Modal: FC<IModal> = ({ isOpen, setIsOpen }) => {

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".main")) return;
        setIsOpen(false);
    };

    return (
        <div
            onClick={handleClick}
            className={`${isOpen ? styles.open : styles.closed} ${styles.wrapper}`}
        >
            <div role="dialog" aria-modal="true" aria-labelledby="registrationModalTitle"
                className={`main ${styles.modal}`}
            >
                <button onClick={() => setIsOpen(false)} className={styles.modal__close}>
                    <Image src={"/static/svg/close.svg"} alt="close" width={11} height={11} />
                </button>

                <div className={styles.modal__logo}>
                    <Image src={"/static/svg/logo.svg"} alt="logo" fill />
                </div>

                <button className={styles.modal__button}>
                    <Image src={"/static/png/main-screen/google.png"} alt="google-icon" width={19} height={18} />
                    Log in with Google
                </button>
                <button className={styles.modal__button}>
                    <Image src={"/static/png/main-screen/icp.png"} alt="icp-icon" width={27.1} height={12.75} />
                    Log in with Internet Identify
                </button>
            </div>
        </div>
    );
};

export default Modal;