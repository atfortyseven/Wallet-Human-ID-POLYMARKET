import { useState, useEffect } from 'react';

interface NewsSource {
    id: string;
    name: string;
    tier: 1 | 2 | 3;
    logo: string;
    headline: string;
    url: string;
    timestamp: Date;
    status: 'confirms' | 'mentions' | 'denies';
    confidence: number;
}

interface FactCheckResult {
    pollId: string;
    claim: string;
    sources: NewsSource[];
    truthScore: number;
    status: 'verified' | 'unconfirmed' | 'disputed';
    provenanceStamp: string;
    analyzedAt: Date;
}

interface UseFactCheckOptions {
    claim: string;
    enabled?: boolean;
}

export function useFactCheck({ claim, enabled = true }: UseFactCheckOptions) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<FactCheckResult | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!enabled || !claim) return;

        const checkFacts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch('/api/oracle/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ claim }),
                });

                if (!res.ok) throw new Error('Fact check failed');

                const data = await res.json();
                
                // Convert timestamp strings to Date objects
                const processedData = {
                    ...data,
                    analyzedAt: new Date(data.analyzedAt),
                    sources: data.sources.map((source: any) => ({
                        ...source,
                        timestamp: new Date(source.timestamp)
                    }))
                };
                
                setResult(processedData);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        checkFacts();
    }, [claim, enabled]);

    return { result, isLoading, error };
}

// Export types for use in other components
export type { FactCheckResult, NewsSource };
