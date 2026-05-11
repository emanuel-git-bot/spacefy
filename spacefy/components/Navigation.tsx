'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Edit3, User, Settings, Music2, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/hooks/useSession';
import { logout } from '@/app/actions/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navigation() {
  const pathname = usePathname();
  const { user } = useSession();

  const profileHref = user ? `/profile/${user.username}` : '/login';

  const routes = [
    { href: '/', label: 'Feed', icon: Home },
    { href: '/discover', label: 'Descobrir', icon: Compass },
    { href: '/editor', label: 'Estúdio', icon: Edit3 },
    { href: profileHref, label: 'Perfil', icon: User },
    { href: '/settings', label: 'Ajustes', icon: Settings },
  ];

  // Rota /discover: modo imersivo tela cheia — esconde sidebar no desktop
  const isDiscoverRoute = pathname === '/discover';

  return (
    <>
      {/* Desktop Sidebar — oculta em /discover para experiência TikTok full-screen */}
      <aside className={`hidden ${isDiscoverRoute ? '' : 'md:flex'} flex-col w-64 bg-zinc-950 border-r border-zinc-900 h-screen sticky top-0 print:hidden`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <Music2 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Spacefy
          </h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {routes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
            
            return (
              <Link 
                key={route.href} 
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-zinc-500")} />
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900 space-y-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarImage src={user.avatarUrl || `https://i.pravatar.cc/150?u=${user.username}`} />
                <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">@{user.username}</p>
              </div>
              <button
                onClick={async () => { await logout(); window.location.href = '/login'; }}
                className="text-zinc-500 hover:text-white transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors">
              <User className="w-4 h-4" />
              Entrar
            </Link>
          )}
          <div className="text-center text-xs text-zinc-600">Spacefy Alpha v0.2.0</div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-900 flex items-center justify-around z-50 print:hidden pb-safe">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href));
          
          return (
            <Link 
              key={route.href} 
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(var(--primary),0.8)]")} />
              <span className="text-[10px] font-medium">{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
