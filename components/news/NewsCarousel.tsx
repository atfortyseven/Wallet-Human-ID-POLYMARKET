"use client";

import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import { StackableCarousel } from '../ui/StackableCarousel';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    category: string;
    publishedAt: string;
    imageUrl?: string;
}

export function NewsCarousel() {
    const { data, error } = useSWR('/api/news', fetcher);
    const news = data?.news as NewsItem[] || [];
    const isLoading = !data && !error;

    if (isLoading) {
        return (
            <div className="flex gap-4 overflow-hidden py-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="min-w-[300px] h-[300px] bg-zinc-900 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (!news.length) return null;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6 px-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-400" />
                    Latest Updates
                </h3>
            </div>

            <StackableCarousel itemClassName="w-[85vw] sm:w-[350px]">
                {news.map((item) => (
                    <div 
                        key={item.id} 
                        className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all h-[380px] flex flex-col group cursor-pointer"
                    >
                        {/* Image Placeholder */}
                        <div className="h-40 bg-zinc-800 relative overflow-hidden">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                    <BookOpen size={40} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-mono uppercase text-blue-400 border border-white/10">
                                {item.category}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-1">
                                {item.summary}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-zinc-500 mt-auto pt-4 border-t border-white/5">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(item.publishedAt).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-white">
                                    Read more <ArrowRight size={12} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </StackableCarousel>
        </div>
    );
}
