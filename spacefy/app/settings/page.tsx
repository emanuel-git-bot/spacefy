'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Sun, Monitor, Type, Palette, Lock, Music } from 'lucide-react';
import Link from 'next/link';

export default function SettingsView() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Configurações</h1>
        </div>

        {/* Tema & Aparência */}
        <Card className="border-zinc-800/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Aparência Visual
            </CardTitle>
            <CardDescription>Personalize as cores e o tema da interface.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Tema do Sistema</Label>
              <div className="flex flex-wrap gap-4">
                <Button variant={theme === 'light' ? 'default' : 'outline'} className="gap-2 flex-1" onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4" /> Claro
                </Button>
                <Button variant={theme === 'dark' ? 'default' : 'outline'} className="gap-2 flex-1" onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4" /> Escuro
                </Button>
                <Button variant={theme === 'system' ? 'default' : 'outline'} className="gap-2 flex-1" onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4" /> Auto
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="space-y-0.5">
                <Label>Cor do Neon (Acorde Ativo)</Label>
                <p className="text-sm text-muted-foreground">Cor de destaque ao cantar.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 cursor-pointer ring-2 ring-offset-2 ring-offset-background ring-blue-500"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 cursor-pointer opacity-50 hover:opacity-100"></div>
                <div className="w-8 h-8 rounded-full bg-pink-500 cursor-pointer opacity-50 hover:opacity-100"></div>
                <div className="w-8 h-8 rounded-full bg-orange-500 cursor-pointer opacity-50 hover:opacity-100"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leitura de Cifras */}
        <Card className="border-zinc-800/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5 text-primary" />
              Leitura de Cifras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sistema de Notas</Label>
                <p className="text-sm text-muted-foreground">Americana (C,D,E) ou Latina (Dó,Ré,Mi).</p>
              </div>
              <Select defaultValue="american">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="american">C, D, E</SelectItem>
                  <SelectItem value="latin">Dó, Ré, Mi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex justify-between">
                <Label>Tamanho da Fonte das Letras</Label>
                <span className="text-sm font-medium text-primary">Grande</span>
              </div>
              <Slider defaultValue={[75]} max={100} step={25} />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="space-y-0.5">
                <Label>Mostrar Diagrama de Acordes</Label>
                <p className="text-sm text-muted-foreground">Exibe o desenho no braço do violão no hover.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Player & Áudio */}
        <Card className="border-zinc-800/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              Player e Áudio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Count-in (Contagem Regressiva)</Label>
                <p className="text-sm text-muted-foreground">Tempo antes da música começar.</p>
              </div>
              <Select defaultValue="3">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Segundos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Desativado</SelectItem>
                  <SelectItem value="3">3 Segundos</SelectItem>
                  <SelectItem value="5">5 Segundos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Privacidade */}
        <Card className="border-zinc-800/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Perfil Privado</Label>
                <p className="text-sm text-muted-foreground">Apenas seguidores podem ver suas cifras.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
