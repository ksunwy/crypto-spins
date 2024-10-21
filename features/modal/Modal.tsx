"use client";
import { FC } from "react";
import Image from "next/image";
import { IModal } from "@/features/types/Types.ts";
import { play } from "@/shared/lib/canister.ts";
import styles from "@/styles/features/modal/modal.module.scss";

import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "@/shared/lib/contract.did.ts";

const canisterId = "jeoiu-zqaaa-aaaal-amq2q-cai";
const identityProviderUrl = "https://identity.ic0.app";

const createActor = (canisterId: string, agent: HttpAgent) => {
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    });
  };
  
  const authenticateWithIC = async () => {
    const identityWindow = window.open(
      `${identityProviderUrl}/#authorize`,
      "_blank",
      "width=500,height=800"
    );
  
    return new Promise((resolve, reject) => {
      const listener = (event: MessageEvent) => {
        if (event.origin === identityProviderUrl) {
          if (event.data && event.data.type === "authorize-ready") {
            identityWindow?.postMessage(
              { type: "authorize-request", origin: window.origin },
              identityProviderUrl
            );
          } else if (event.data && event.data.type === "authorize-success") {
            const identity = event.data.identity;
            resolve(identity);
            window.removeEventListener("message", listener);
            identityWindow?.close();
          } else if (event.data && event.data.type === "authorize-failure") {
            reject(new Error("Аутентификация не удалась"));
            window.removeEventListener("message", listener);
            identityWindow?.close();
          }
        }
      };
      window.addEventListener("message", listener);
    });
  };
  
  export const initAgent = async () => {
    const identity = await authenticateWithIC();
    //@ts-ignore
    const agent = new HttpAgent({ identity });
  
    if (process.env.DFX_NETWORK === 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=jeoiu-zqaaa-aaaal-amq2q-cai') {
      await agent.fetchRootKey();
    }
  
    return createActor(canisterId, agent);
  };
const Modal: FC<IModal> = ({ isOpen, setIsOpen }) => {

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".main")) return;
        setIsOpen(false);
    };
    
    const handleLoginClick = async () => {
        try {
          const actor = await initAgent();
          console.log(actor);
        } catch (error) {
          console.error(error);
        }
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
                
                <button onClick={handleLoginClick} className={styles.modal__button}>
                    <Image src={"/static/png/main-screen/icp.png"} alt="icp-icon" width={27.1} height={12.75} />
                    Log in with Internet Identify
                </button>
            </div>
        </div>
    );
};

export default Modal;