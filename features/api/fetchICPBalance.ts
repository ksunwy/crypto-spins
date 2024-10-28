import { Principal } from "@dfinity/principal";
import { authenticateWithIC } from "@/features/modal/Modal.tsx";

const CANISTER_ID = "7dzpt-piaaa-aaaam-adplq-cai";

export const fetchICPBalance = async (principalId: string): Promise<bigint | null> => {
    try {
    const identity = await authenticateWithIC();
    const response = await fetch(`http://${CANISTER_ID}.ic0.app/get_balance`, {
        method: 'POST',
        headers: {
         'Content-Type': 'application/json',
         //@ts-ignore
         'Authorization': `Bearer ${identity.getIdToken()}`
        },
        body: JSON.stringify({ principalId }) 
       });       
    const data = await response.json();
    return BigInt(data.balance);
  } catch (error) {
    // console.log("Error getting balance с ICP Ledger:", error);
    return null;
  }
};
