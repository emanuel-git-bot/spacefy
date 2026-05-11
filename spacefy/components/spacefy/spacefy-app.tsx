"use client";

import { useState } from "react";
import { PlayerProvider } from "@/lib/player-context";
import { PlayerView } from "./player-view";
import { EditorView } from "./editor-view";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Headphones, Edit3 } from "lucide-react";

export function SpacefyApp() {
  const [activeTab, setActiveTab] = useState<"player" | "editor">("player");

  return (
    <PlayerProvider>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-foreground">
                Spacefy
              </span>
            </div>

            {/* Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "player" | "editor")}
            >
              <TabsList className="bg-muted/50">
                <TabsTrigger value="player" className="gap-2">
                  <Headphones className="h-4 w-4" />
                  <span className="hidden sm:inline">Player</span>
                </TabsTrigger>
                <TabsTrigger value="editor" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Editor</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Spacer for balance */}
            <div className="w-24" />
          </div>
        </nav>

        {/* Content */}
        <main className="pt-16">
          {activeTab === "player" ? <PlayerView /> : <EditorView />}
        </main>
      </div>
    </PlayerProvider>
  );
}
