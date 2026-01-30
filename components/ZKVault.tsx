'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Fingerprint,
  Globe,
  Lock,
  Activity,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { useRef, useState } from 'react';

interface IdentityAttribute {
  id: string;
  icon: typeof Shield;
  title: string;
  description: string;
  verified: boolean;
  zkProof: string;
  timestamp: string;
}

interface ConnectedDApp {
  id: string;
  name: string;
  logo: string;
  permissions: string[];
  connectedAt: string;
  active: boolean;
}

interface ZKProofLog {
  id: string;
  type: string;
  timestamp: string;
  verifier: string;
  status: 'verified' | 'pending' | 'expired';
}

export function ZKVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Progressive fade for upper sections as user scrolls
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);
  const attributesOpacity = useTransform(scrollYProgress, [0.1, 0.4], [1, 0.5]);

  // Mock data - in production this comes from WorldID + backend
  const [attributes] = useState<IdentityAttribute[]>([
    {
      id: '1',
      icon: Fingerprint,
      title: 'Proof of Humanity',
      description: 'Verified via WorldID biometric authentication. Your uniqueness is proven without revealing identity.',
      verified: true,
      zkProof: 'zk_proof_0x7a9f...',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      icon: Clock,
      title: 'Proof of Age (+18)',
      description: 'Age verification without revealing date of birth. Only confirmation of majority age.',
      verified: true,
      zkProof: 'zk_proof_0x3b2c...',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '3',
      icon: MapPin,
      title: 'Proof of Residency',
      description: 'Location verified without revealing physical address. Country-level verification only.',
      verified: false,
      zkProof: '',
      timestamp: '',
    },
  ]);

  const [connectedDApps] = useState<ConnectedDApp[]>([
    {
      id: '1',
      name: 'Polymarket',
      logo: '📊',
      permissions: ['Proof of Humanity', 'Proof of Age'],
      connectedAt: new Date(Date.now() - 172800000).toISOString(),
      active: true,
    },
    {
      id: '2',
      name: 'Aave Protocol',
      logo: '👻',
      permissions: ['Proof of Humanity'],
      connectedAt: new Date(Date.now() - 259200000).toISOString(),
      active: true,
    },
    {
      id: '3',
      name: 'Uniswap',
      logo: '🦄',
      permissions: ['Proof of Humanity', 'Proof of Residency'],
      connectedAt: new Date(Date.now() - 345600000).toISOString(),
      active: false,
    },
  ]);

  const [proofLogs] = useState<ZKProofLog[]>([
    {
      id: '1',
      type: 'Humanity Verification',
      timestamp: new Date().toISOString(),
      verifier: 'WorldID Network',
      status: 'verified',
    },
    {
      id: '2',
      type: 'Age Confirmation',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      verifier: 'WorldID Network',
      status: 'verified',
    },
    {
      id: '3',
      type: 'Session Initialization',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      verifier: 'HumanID.fi',
      status: 'verified',
    },
  ]);

  const [revealedProofs, setRevealedProofs] = useState<Record<string, boolean>>({});

  const toggleProofReveal = (id: string) => {
    setRevealedProofs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-[600vh] px-4 sm:px-6 lg:px-8"
    >
      {/* Section 1: Security Status Header */}
      <motion.section 
        style={{ opacity: headerOpacity }}
        className="sticky top-20 z-10 mb-16"
      >
        <div className="max-w-5xl mx-auto">
          {/* ZK-Shield Active Indicator */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            />
            <span className="text-sm font-medium text-cyan-400 tracking-wider uppercase">
              ZK-Shield Active
            </span>
          </motion.div>

          {/* Identity Score Radial Graph */}
          <div className="glass-pearl rounded-3xl p-8 border border-white/[0.05]">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Identity Strength Score
            </h2>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                {/* Radial Progress */}
                <svg className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "440", strokeDashoffset: "440" }}
                    animate={{ strokeDashoffset: "110" }} // 75% complete
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0ea5e9" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Score Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold text-white">75</span>
                  <span className="text-xs text-zinc-400 uppercase tracking-wide">Verified</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-zinc-400">
              Your identity is protected by <span className="text-cyan-400 font-semibold">2 active ZK-Proofs</span>. 
              Complete residency verification to reach 100%.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Section 2: Sovereign Attributes Vault */}
      <motion.section 
        style={{ opacity: attributesOpacity }}
        className="mb-32 max-w-5xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Sovereign Identity Vault
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Your personal attributes, cryptographically verified without ever revealing the underlying data. 
          True digital sovereignty.
        </p>

        <div className="grid gap-6">
          {attributes.map((attr, index) => (
            <AttributeCard
              key={attr.id}
              attribute={attr}
              delay={index * 0.1}
              revealed={revealedProofs[attr.id]}
              onToggleReveal={() => toggleProofReveal(attr.id)}
            />
          ))}
        </div>
      </motion.section>

      {/* Section 3: ZK-Proof History Audit Log */}
      <section className="mb-32 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Proof Generation History
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Mathematical proof of your actions. Every verification is recorded on-chain 
          without compromising your privacy.
        </p>

        <div className="glass-pearl rounded-2xl border border-white/[0.05] overflow-hidden">
          <div className="divide-y divide-white/[0.05]">
            {proofLogs.map((log, index) => (
              <ProofLogRow key={log.id} log={log} delay={index * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: dApp Connection Manager */}
      <section className="mb-32 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-4 text-center">
          Connected Applications
        </h2>
        <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
          Manage which dApps can access your proofs. Revoke access anytime with one click.
        </p>

        <div className="grid gap-6">
          {connectedDApps.map((dapp, index) => (
            <DAppCard key={dapp.id} dapp={dapp} delay={index * 0.1} />
          ))}
        </div>
      </section>

      {/* Section 5: Privacy Guarantee Statement */}
      <section className="mb-32 max-w-4xl mx-auto">
        <div className="glass-pearl rounded-3xl p-12 border border-white/[0.05] text-center">
          <Lock className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">
            Zero-Knowledge Guarantee
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed mb-6">
            Your biometric data <span className="text-cyan-400 font-semibold">never</span> touches our servers. 
            WorldID processes everything locally on your device and only shares cryptographic proofs — 
            mathematical certainty without revealing the secret.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Non-Custodial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>Self-Sovereign</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Vault Closure CTA */}
      <section className="mb-20 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <button className="relative w-full glass-pearl rounded-3xl p-8 border border-white/[0.05] hover:border-cyan-500/30 transition-all group">
            <div className="flex items-center justify-center gap-4">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white group-hover:text-cyan-100 transition-colors">
                Close Vault & Return to Dashboard
              </span>
            </div>
            
            {/* Diamond Glint Effect */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden pointer-events-none"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <motion.div
                className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  left: ["- 100%", "100%"]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          </button>
        </motion.div>
      </section>
    </div>
  );
}

// Sub-components

function AttributeCard({ 
  attribute, 
  delay,
  revealed,
  onToggleReveal
}: { 
  attribute: IdentityAttribute;
  delay: number;
  revealed: boolean;
  onToggleReveal: () => void;
}) {
  const Icon = attribute.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      viewport={{ once: true }}
      className="glass-pearl rounded-2xl p-6 border border-white/[0.05] hover:border-cyan-500/30 transition-all group pearl-shimmer"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center text-zinc-300 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300">
          <Icon size={28} strokeWidth={1.5} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-cyan-100 transition-colors">
              {attribute.title}
            </h3>
            {attribute.verified && (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            )}
          </div>

          <p className="text-zinc-400 leading-relaxed text-sm mb-4">
            {attribute.description}
          </p>

          {attribute.verified && (
            <div className="flex items-center gap-4">
              <button
                onClick={onToggleReveal}
                className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {revealed ? (
                  <>
                    <EyeOff size={14} />
                    Hide Proof
                  </>
                ) : (
                  <>
                    <Eye size={14} />
                    View ZK-Proof
                  </>
                )}
              </button>

              {revealed && (
                <motion.code
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xs font-mono text-zinc-500 bg-white/[0.02] px-3 py-1 rounded border border-white/[0.05]"
                >
                  {attribute.zkProof}
                </motion.code>
              )}
            </div>
          )}

          {!attribute.verified && (
            <button className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition-all">
              Start Verification
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProofLogRow({ log, delay }: { log: ZKProofLog; delay: number }) {
  const statusColors = {
    verified: 'text-green-400 bg-green-400/10',
    pending: 'text-yellow-400 bg-yellow-400/10',
    expired: 'text-red-400 bg-red-400/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true }}
      className="p-6 hover:bg-white/[0.02] transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-zinc-400" />
            <span className="text-white font-medium">{log.type}</span>
          </div>
          <div className="text-xs text-zinc-500 flex items-center gap-4">
            <span>Verifier: {log.verifier}</span>
            <span>•</span>
            <span>{new Date(log.timestamp).toLocaleString()}</span>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[log.status]}`}>
          {log.status.toUpperCase()}
        </div>
      </div>
    </motion.div>
  );
}

function DAppCard({ dapp, delay }: { dapp: ConnectedDApp; delay: number }) {
  const [isActive, setIsActive] = useState(dapp.active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="glass-pearl rounded-2xl p-6 border border-white/[0.05] hover:border-cyan-500/20 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="text-4xl">{dapp.logo}</div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">{dapp.name}</h3>
            
            <div className="mb-3">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">Shared Proofs:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {dapp.permissions.map((perm, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white/[0.03] border border-white/[0.1] px-2 py-1 rounded text-zinc-300"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-xs text-zinc-500">
              Connected {new Date(dapp.connectedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            {isActive ? 'Active' : 'Revoked'}
          </button>

          <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
            Disconnect
          </button>
        </div>
      </div>
    </motion.div>
  );
}
