import { FC } from "react";
import Image from "next/image";
import { IModal } from "@/features/types/Types.ts";
import { usePrincipal } from "@/app/providers/PrincipalContext.tsx";
import styles from "@/styles/features/modal/modal.module.scss";

const LogOutModal: FC<IModal> = ({ isOpen, setIsOpen }) => {
    const context = usePrincipal();
    if (!context) {
      return
    }

    const { setActor, setBalance, setPrincipalId } = context;

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".main")) return;
        setIsOpen(false);
    };

    const handleLogOutClick = () => {
        setActor(null);
        setBalance(null);
        setPrincipalId(null); 
        setIsOpen(false);
    }

    return (
        <div
            onClick={handleClick}
            className={`${isOpen ? styles.open : styles.closed} ${styles.wrapper}`}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="registrationModalTitle"
                className={`main ${styles.modal}`}
            >
                <button onClick={() => setIsOpen(false)} className={styles.modal__close}>
                    <Image src={"/static/svg/close.svg"} alt="close" width={11} height={11} />
                </button>

                <div className={styles.modal__logo}>
                    <Image src={"/static/svg/logo.svg"} alt="logo" fill />
                </div>

                <button onClick={handleLogOutClick} className={styles.button}>
                    Log Out
                </button>
                <button onClick={() => setIsOpen(false)} className={styles.modal__button}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default LogOutModal