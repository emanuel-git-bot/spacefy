'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

const mockChordsheet = {
  trackTitle: 'Neon Genesis',
  artist: 'CyberBand',
  author: 'lucas_guitar',
  lines: [
    {
      id: 'l1',
      text: "Walking through the digital rain",
      chords: [
        { wordIndex: 0, chord: 'Am' },
        { wordIndex: 3, chord: 'F' }
      ]
    },
    {
      id: 'l2',
      text: "Lost in the mainframe again",
      chords: [
        { wordIndex: 0, chord: 'C' },
        { wordIndex: 3, chord: 'G' }
      ]
    },
    {
      id: 'l3',
      text: "Neon lights are blinding my eyes",
      chords: [
        { wordIndex: 0, chord: 'Am' },
        { wordIndex: 4, chord: 'E7' }
      ]
    }
  ]
};

export default function PrintView() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto print:max-w-full">
        {/* Print Button - hidden during print */}
        <div className="flex justify-end mb-8 print:hidden">
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </Button>
        </div>

        {/* Header */}
        <div className="border-b-2 border-black pb-4 mb-8">
          <h1 className="text-4xl font-bold">{mockChordsheet.trackTitle}</h1>
          <h2 className="text-xl mt-2">{mockChordsheet.artist}</h2>
          <p className="text-sm text-gray-500 mt-1">Cifra por @{mockChordsheet.author} • Spacefy</p>
        </div>

        {/* Lyrics and Chords */}
        <div className="space-y-8 text-lg">
          {mockChordsheet.lines.map((line) => {
            const words = line.text.split(' ');
            return (
              <div key={line.id} className="flex flex-wrap gap-x-2 gap-y-1">
                {words.map((word, wIdx) => {
                  const chordData = line.chords.find(c => c.wordIndex === wIdx);
                  return (
                    <div key={wIdx} className="flex flex-col">
                      <span className="font-bold text-black h-6">{chordData?.chord || ''}</span>
                      <span>{word}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-300 text-center text-sm text-gray-500 print:block">
          Gerado por Spacefy - A plataforma de cifras sincronizadas
        </div>
      </div>
    </div>
  );
}
