'use client';

import dynamic from 'next/dynamic';
import { useRef, useEffect, useState } from 'react';
import { generateMockGraphData } from '@/utils/graphData';
import { useAccount } from 'wagmi';
import { Loader2 } from 'lucide-react';

// Dynamically import generic 3D Graph to avoid SSR issues
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-zinc-500"><Loader2 className="animate-spin mr-2" /> Loading Star Chart...</div>
});

export function Constellation() {
    const { address } = useAccount();
    const graphRef = useRef<any>();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Generate data on mount
        const gData = generateMockGraphData(address || '0xUser');
        setData(gData);
    }, [address]);

    const handleNodeClick = (node: any) => {
        if (!graphRef.current) return;

        // Fly camera to node
        const distance = 40;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        graphRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
        );
    };

    if (!data) return <div className="h-full w-full flex items-center justify-center text-zinc-500">Initializing...</div>;

    return (
        <div className="h-full w-full relative bg-black/20 rounded-xl overflow-hidden">
            <ForceGraph3D
                ref={graphRef}
                graphData={data}
                nodeLabel="name"
                nodeAutoColorBy="group"
                nodeRelSize={6}
                linkColor={() => "rgba(255,255,255,0.2)"}
                linkWidth={1}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.005}
                backgroundColor="rgba(0,0,0,0)" // Transparent to show background
                showNavInfo={false}
                onNodeClick={handleNodeClick}
                nodeThreeObjectExtend={true}
                nodeColor={(node: any) => node.color}
            />

            {/* Overlay Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 flex justify-between items-center text-xs">
                <span className="font-mono text-zinc-400">CHRONOS_CONSTELLATION // v1.0</span>
                <div className="flex gap-2">
                    <span className="flex items-center gap-1 text-blue-400"><div className="w-2 h-2 rounded-full bg-blue-500"></div> DeFi</span>
                    <span className="flex items-center gap-1 text-emerald-400"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Wallet</span>
                    <span className="flex items-center gap-1 text-red-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> Threat</span>
                </div>
            </div>
        </div>
    );
}
