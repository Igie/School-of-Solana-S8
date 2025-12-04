import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import ConnectionStatus from "./ConnectionStatus";
import { useSolanaData } from "../hooks/useSolanaData";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {balance, slot} = useSolanaData()

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="w-full bg-surface backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-1">
        {/* Logo */}
        <div className="flex items-center gap-1">
          <div className="text-md font-bold text-accent-1"
          >
            NOTES
          </div>
          <div className="text-sm text-accent-2">
            {`${balance.toFixed(4)} SOL | ${slot} Slot`}
          </div>
        </div>
        {/* Desktop Menu */}
        <div className="flex gap-x-0.5">
          <div className="flex gap-x-0.5 justify-end items-center">
            <WalletMultiButton />
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden text-white rounded-sm focus:outline-none"
          >
            <Menu width={12} height={20} />
          </button>
        </div>
      </div>
      <ConnectionStatus />
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-surface border-t border-white/10">
          <NavLink
            to="/"
            className="p-3 hover:bg-white/10"
            onClick={closeMenu}
          >
            Notes
          </NavLink>
        </div>
      )}
    </nav>
  );
}
