export interface LottieItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  category: 'Core' | 'Launch 2027' | 'Feature';
}

export const LOTTIE_CONTENT: LottieItem[] = [
  // --- CORE FEATURES ---
  {
    id: 'core-1',
    title: 'Human Wallet',
    subtitle: 'La billetera más humana del mundo',
    src: 'https://lottie.host/0f8c4e3d-9b7a-4f6c-8d2e-1a3b4c5d6e7f/9KJh8G7F6D.lottie', // Coin/Wallet
    category: 'Core'
  },
  {
    id: 'core-2',
    title: 'Prediction Markets',
    subtitle: 'Mercados de predicción descentralizados',
    src: 'https://lottie.host/57803657-6105-4752-921c-308101452631/ShieldSecure.lottie', // Shield/Security
    category: 'Core'
  },
  {
    id: 'core-3',
    title: 'Yield Farming',
    subtitle: 'Rendimientos automatizados y seguros',
    src: 'https://lottie.host/8e4d2f1c-9bfa-4b77-8db5-3c5f1b2e6a9d/RainCoins.lottie', // Rain/Yield
    category: 'Core'
  },
  {
    id: 'core-4',
    title: 'Governance',
    subtitle: 'Tu voz decide el futuro',
    src: 'https://lottie.host/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p/CoinSwap3D.lottie', // Swap/Vote
    category: 'Core'
  },
  {
    id: 'core-5',
    title: 'Global Settlements',
    subtitle: 'Pagos instantáneos sin fronteras',
    src: 'https://lottie.host/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p/FastLightning.lottie', // Fast/Global
    category: 'Core'
  },

  // --- LAUNCH 2027 ---
  {
    id: 'launch-1',
    title: 'Neural Interface',
    subtitle: 'Control mental directo (Beta 2027)',
    src: 'https://lottie.host/0f8c4e3d-9b7a-4f6c-8d2e-1a3b4c5d6e7f/9KJh8G7F6D.lottie', 
    category: 'Launch 2027'
  },
  {
    id: 'launch-2',
    title: 'Quantum Security',
    subtitle: 'Cifrado post-cuántico estándar',
    src: 'https://lottie.host/57803657-6105-4752-921c-308101452631/ShieldSecure.lottie',
    category: 'Launch 2027'
  },
  {
    id: 'launch-3',
    title: 'Zero Latency',
    subtitle: 'Infraestructura global de borde',
    src: 'https://lottie.host/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p/FastLightning.lottie',
    category: 'Launch 2027'
  },
  {
    id: 'launch-4',
    title: 'Universal ID',
    subtitle: 'Identidad soberana en todas las cadenas',
    src: 'https://lottie.host/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p/CoinSwap3D.lottie',
    category: 'Launch 2027'
  },
  {
    id: 'launch-5',
    title: 'AI Governance',
    subtitle: 'Optimización de DAO por IA',
    src: 'https://lottie.host/8e4d2f1c-9bfa-4b77-8db5-3c5f1b2e6a9d/RainCoins.lottie',
    category: 'Launch 2027'
  },

  // --- EXTRAS / FEATURES ---
  {
    id: 'feat-1',
    title: 'Biometrics',
    subtitle: 'Acceso seguro sin contraseñas',
    src: 'https://lottie.host/57803657-6105-4752-921c-308101452631/ShieldSecure.lottie',
    category: 'Feature'
  },
  {
    id: 'feat-2',
    title: 'Social Graph',
    subtitle: 'Conecta con tu red de confianza',
    src: 'https://lottie.host/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p/CoinSwap3D.lottie',
    category: 'Feature'
  },
  {
    id: 'feat-3',
    title: 'Privacy Layers',
    subtitle: 'Transacciones anónimas opcionales',
    src: 'https://lottie.host/57803657-6105-4752-921c-308101452631/ShieldSecure.lottie',
    category: 'Feature'
  },
  {
    id: 'feat-4',
    title: 'Cross-chain',
    subtitle: 'Puente invisible entre L1 y L2',
    src: 'https://lottie.host/0a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p/CoinSwap3D.lottie',
    category: 'Feature'
  },
  {
    id: 'feat-5',
    title: 'Institutional',
    subtitle: 'Compliance y custodia avanzada',
    src: 'https://lottie.host/8e4d2f1c-9bfa-4b77-8db5-3c5f1b2e6a9d/RainCoins.lottie',
    category: 'Feature'
  }
];
