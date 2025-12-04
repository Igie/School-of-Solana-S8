import { useEffect, useState } from "react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useConnection } from "@solana/wallet-adapter-react";
import Decimal from "decimal.js";
import { useWalletContext } from "../context/WalletContext";

export interface SolanaDataInfo {
  slot: number
  balance: number;
}

export function useSolanaData() {
  const { connection } = useConnection();
  const { address } = useWalletContext()

  const [slot, setSlot] = useState(0);
  const [balance, setBalance] = useState<Decimal>(new Decimal(0));



  useEffect(() => {

    if (!address) return;
    const slotChangeId = connection.onSlotChange((x) => {
      setSlot(x.slot);
    })
    const pubKey = new PublicKey(address!);
    const accountChangeId = connection.onAccountChange(pubKey, x => {
      setBalance(new Decimal(x.lamports).div(LAMPORTS_PER_SOL))
    }, { commitment: "confirmed", encoding: "jsonParsed" })
    connection.getBalance(pubKey).then(x => setBalance(new Decimal(x).div(LAMPORTS_PER_SOL)));

    return (() => {
      connection.removeSlotChangeListener(slotChangeId);
      connection.removeAccountChangeListener(accountChangeId)
    });
  }, [address, connection]);

  return { slot, balance };
}
