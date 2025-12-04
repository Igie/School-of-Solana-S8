import { useEffect, useState } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet, type AnchorWallet } from "@solana/wallet-adapter-react";

import IDL from "../lib/idl/notes.json"
import type { Notes } from "../lib/idl/notes.ts"

export const NOTES_PROGRAM_ID = new PublicKey(IDL.address);

export function getCounterProgram(provider: AnchorProvider): Program<Notes> {
  return new Program({ ...IDL, address: IDL.address } as Notes, provider)
}

export interface NotesProgramInfo {
  program: Program<Notes> | null;
}

export function useNotesProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [program, setProgram] = useState<Program<Notes> | null>(null);

  useEffect(() => {

    if (!wallet || !connection) return;
    const provider = new AnchorProvider(
      connection,
      wallet as AnchorWallet,
      AnchorProvider.defaultOptions()
    );
    if (!provider || !connection) return;
    setProgram(getCounterProgram(provider))
    return (() => {

    });
  }, [wallet, connection]);

  return { program };
}
