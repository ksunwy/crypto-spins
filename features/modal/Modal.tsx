"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { IModal } from "@/features/types/Types.ts";
import { AuthClient } from "@dfinity/auth-client";
import { HttpAgent, Actor } from "@dfinity/agent";
import { idlFactory } from "@/shared/lib/contract.did.ts";
import { usePrincipal } from "@/app/providers/PrincipalContext.tsx";
// import { useBalance } from "@/app/providers/BalanceContext.tsx";
import styles from "@/styles/features/modal/modal.module.scss";

const CANISTER_ID = "jeoiu-zqaaa-aaaal-amq2q-cai";
const HOST = "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io";

// const createActor = (canisterId: string, agent: HttpAgent) => {
//   return Actor.createActor(idlFactory, {
//     agent,
//     canisterId,
//   });
// };

// export const initAgent = async (identity: any) => {
//   const agent = new HttpAgent({ identity });
//   // https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=jeoiu-zqaaa-aaaal-amq2q-cai
//   if (process.env.DFX_NETWORK === 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=jeoiu-zqaaa-aaaal-amq2q-cai') {
//     await agent.fetchRootKey(); 
//   }

//   return createActor(CANISTER_ID, agent);
// };

export const initAgent = async (identity: any) => {
  const agent = new HttpAgent({
    identity,
    host: HOST,
  });

  await agent.fetchRootKey(); 

  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: CANISTER_ID, 
  });

  return actor;
};

export const authenticateWithIC = async () => {
  const authClient = await AuthClient.create();

  return new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: async () => {
        const identity = authClient.getIdentity();
        resolve(identity);
      },
      //@ts-ignore
      onError: (error) => {
        reject("error");
      },
    });
  });
};

const Modal: FC<IModal> = ({ isOpen, setIsOpen }) => {
  const context = usePrincipal();
  if (!context) {
    return
    // throw new Error("usePrincipal должен быть использован внутри PrincipalProvider");
  }
  const { principalId, setPrincipalId, setActor, setBalance } = context;

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    if (target.closest(".main")) return;
    setIsOpen(false);
  };

  const handleLoginClick = async () => {
    try {
      const identity = await authenticateWithIC();
      const newActor = await initAgent(identity);
      setActor(newActor);
      
      //@ts-ignore
      const principal = identity.getPrincipal();
      setPrincipalId(principal.toText());
  
      const balance: unknown = await newActor.get_balance();
      if (typeof balance === "bigint") {
        setBalance(balance);
        // setBalance(balance);
        console.log("Actor balance:", balance);
      } else {
        console.error("Ошибка получения баланса");
      }
  
      console.log("Principal ID:", principal.toText());
    } catch (error) {
      console.error("Ошибка аутентификации:", error);
    } finally {
      setIsOpen(false);
    }
  };
  
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

        <button onClick={handleLoginClick} className={styles.modal__button}>
          <Image
            src={"/static/png/main-screen/icp.png"}
            alt="icp-icon"
            width={27.1}
            height={12.75}
          />
          Войти через Internet Identity
        </button>
      </div>
    </div>
  );
};

export default Modal;
