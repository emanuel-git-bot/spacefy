'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, Music2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFeed } from '@/app/actions/chords';
import { LikeButton } from '@/components/LikeButton';
import { CommentsDrawer } from '@/components/CommentsDrawer';
import { ShareButton } from '@/components/ShareButton';

export default function DiscoveryView() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [reels, setReels] = useState<any[]>([]);

  useEffect(() => {
    getFeed().then(setReels);
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollPosition = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const index = Math.round(scrollPosition / windowHeight);
      setActiveIndex(index);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden z-10">
      {/* Top Navbar overlay */}
      <div className="absolute top-0 left-0 w-full z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold tracking-wider">Discovery</h1>
        <div className="w-10"></div>
      </div>

      {/* Vertical Snap Container */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {reels.map((item, idx) => (
          <div key={item.chordsheetId} className="h-screen w-full snap-start relative flex items-center justify-center bg-zinc-900">
            {/* Background Cover */}
            <img 
              src={item.coverUrl || ''} 
              alt={item.trackTitle}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Play overlay if not active */}
            {activeIndex !== idx && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <Play className="w-16 h-16 text-white/50" />
              </div>
            )}

            {/* Simulated Live Chord (Since feed doesn't have chords loaded, we mock preview just for discover UI) */}
            <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-primary drop-shadow-[0_0_15px_rgba(var(--primary),0.8)] animate-pulse">
                Am
              </span>
              <p className="mt-4 text-2xl font-bold text-center px-8 text-white drop-shadow-md">
                Listen to the chord...
              </p>
            </div>

            {/* Right sidebar interactions */}
            <div className="absolute right-4 bottom-24 z-30 flex flex-col items-center gap-6">
              <LikeButton chordsheetId={item.chordsheetId} userId={null} initialCount={Math.round((item.views || 0)/10)} />
              <CommentsDrawer chordsheetId={item.chordsheetId} currentUserId={null} />
              <ShareButton chordsheetId={item.chordsheetId} trackTitle={item.trackTitle} artist={item.artist} />
              
              {/* Spinning record icon */}
              <div className="mt-4 animate-[spin_4s_linear_infinite]">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center overflow-hidden">
                   <Music2 className="w-5 h-5 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Bottom Info Info */}
            <div className="absolute bottom-4 left-4 right-20 z-30 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10 border border-white/50">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${item.author}`} />
                  <AvatarFallback>{item.author[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-bold text-lg text-white">@{item.author}</span>
                <Link href={`/player/${item.chordsheetId}`}>
                  <Button variant="outline" size="sm" className="ml-2 h-7 rounded-full bg-transparent text-white border-white/50 hover:bg-white/20">
                    Play Full
                  </Button>
                </Link>
              </div>
              <div>
                <h2 className="text-xl font-bold">{item.trackTitle}</h2>
                <p className="text-sm text-white/80">{item.artist}</p>
              </div>
            </div>
            
            {/* Gradient Overlay bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
          </div>
        ))}
      </div>
      
      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
