"use client";

import { motion } from "framer-motion";
import { Activity, ArrowDownLeft, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useAccount, useChainId } from "wagmi";
import { polygon } from "wagmi/chains";
import { Toaster } from "sonner";
import NetworkSwitcher from "@/components/wallet/NetworkSwitcher";
import WalletConnect from "@/components/wallet/WalletConnect";
import { usePolymarketData } from "@/hooks/usePolymarketData";
import PositionsDashboard from "./PositionsDashboard";
import { useState } from "react";
import SendModal from "@/components/wallet/SendModal";
import ReceiveModal from "@/components/wallet/ReceiveModal";

import SuperWallet from "@/components/dashboard/SuperWallet";

export default function WalletDashboard() {
    return <SuperWallet />;
}
