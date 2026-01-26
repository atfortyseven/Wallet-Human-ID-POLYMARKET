import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { WorldProvider } from '@/src/context/WorldContext';
import { Toaster } from 'sonner';
import VoidShell from '@/components/VoidShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
    title: 'HumanID.fi | The Void Wallet',
    description: 'Sybil-resistant financial engine for Polymarket',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${mono.variable}`}>
            <body className="bg-void text-white">
                <Providers>
                    <WorldProvider>
                        <VoidShell>
                            {children}
                        </VoidShell>
                        <Toaster richColors theme="dark" />
                    </WorldProvider>
                </Providers>
            </body>
        </html>
    );
}
