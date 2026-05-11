'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Music2 } from 'lucide-react';

import { login } from '@/app/actions/auth';
import { useRouter } from 'next/navigation';

export default function LoginView() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email);
    if (res.success) {
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Music2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Spacefy
          </h1>
          <p className="text-muted-foreground mt-2 text-center">Entre para sincronizar, salvar cifras e interagir com a comunidade.</p>
        </div>

        <Card className="border-zinc-800 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Acesse sua conta com email ou serviços externos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="músico@email.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full font-bold">
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card/50 px-2 text-muted-foreground">Ou continue com</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full border-zinc-800 bg-zinc-900 text-zinc-400 cursor-not-allowed">
                Google (Em breve)
              </Button>
              <Button variant="outline" className="w-full border-zinc-800 bg-zinc-900 text-zinc-400 cursor-not-allowed">
                Spotify (Em breve)
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-800/50 pt-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta? <Link href="/register" className="text-primary font-semibold hover:underline">Cadastre-se</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
