"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "src" | "fallbackSrc"> {
    src?: string | null;
    fallbackCategory?: string;
    className?: string;
}

// Map categories to high-quality curated Unsplash collections/images
const FALLBACK_IMAGES: Record<string, string> = {
    "Crypto": "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1000",
    "Finance": "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=1000",
    "Tech": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    "Politics": "https://images.unsplash.com/photo-1529101091760-6149d3c80a9c?auto=format&fit=crop&q=80&w=1000",
    "Sports": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000",
    "Climate & Science": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000",
    "Culture": "https://images.unsplash.com/photo-1514525253440-b393452e8d03?auto=format&fit=crop&q=80&w=1000",
    "World": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    "Trending": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1000",
    "Default": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000"
};

export default function SafeImage({
    src,
    alt,
    fallbackCategory = "Trending",
    className,
    ...props
}: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState<string | null>(src || null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setImgSrc(src || null);
        setHasError(false);
    }, [src]);

    const handleOnError = () => {
        if (!hasError) {
            setHasError(true);
            // Select fallback based on category partial match
            const category = Object.keys(FALLBACK_IMAGES).find(key =>
                fallbackCategory.toLowerCase().includes(key.toLowerCase())
            ) || "Default";

            setImgSrc(FALLBACK_IMAGES[category]);
        }
    };

    // If initial src is missing, immediately use fallback
    if (!imgSrc || imgSrc === "") {
        const category = Object.keys(FALLBACK_IMAGES).find(key =>
            fallbackCategory.toLowerCase().includes(key.toLowerCase())
        ) || "Default";
        const fallback = FALLBACK_IMAGES[category];

        return (
            <Image
                src={fallback}
                alt={alt}
                className={className}
                {...props}
            />
        );
    }

    return (
        <Image
            src={imgSrc}
            alt={alt}
            className={className}
            onError={handleOnError}
            {...props}
        />
    );
}
