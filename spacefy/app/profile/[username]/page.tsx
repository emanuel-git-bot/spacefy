'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid, Bookmark, Settings, Heart, Play, Loader2, UserPlus, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { getUserProfile, getUserChordsheets, getUserPlaylists, toggleFollow, isFollowing } from '@/app/actions/chords';
import { getSession } from '@/app/actions/auth';

export default function ProfileView() {
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  // Computed from session
  const currentUserId = sessionUserId;
  const isOwnProfile = !!sessionUserId && !!profile && sessionUserId === profile.id;

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Resolve session first
      const session = await getSession();
      const sessId = session?.id || null;
      setSessionUserId(sessId);

      let user: any = null;

      if (username === 'me') {
        // "me" é um alias para o usuário da sessão atual
        if (!session) {
          window.location.href = '/login';
          return;
        }
        user = session;
      } else {
        user = await getUserProfile(username);
      }

      if (user) {
        setProfile(user);
        const [cs, pl] = await Promise.all([
          getUserChordsheets(user.id),
          getUserPlaylists(user.id),
        ]);
        setPosts(cs);
        setPlaylists(pl);
        if (sessId && sessId !== user.id) {
          const f = await isFollowing(sessId, user.id);
          setFollowing(f);
        }
      }
      setLoading(false);
    };
    load();
  }, [username]);

  const handleFollow = async () => {
    if (!profile || !sessionUserId) {
      window.location.href = '/login';
      return;
    }
    setFollowLoading(true);
    const res = await toggleFollow(sessionUserId, profile.id);
    setFollowing(res.following);
    setProfile((prev: any) => ({
      ...prev,
      followersCount: res.following
        ? (prev.followersCount || 0) + 1
        : Math.max(0, (prev.followersCount || 0) - 1)
    }));
    setFollowLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-zinc-400 gap-4">
        <p className="text-xl font-bold">Usuário não encontrado</p>
        <Link href="/"><Button variant="outline">Voltar ao Feed</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-4xl mx-auto pt-8 px-4 md:px-8">

        {/* Header Profile */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-12">
          <Avatar className="w-24 h-24 md:w-36 md:h-36 ring-4 ring-primary/20">
            <AvatarImage src={profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.username}`} />
            <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-2xl font-bold">@{profile.username}</h1>
              <div className="flex gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="secondary" className="font-semibold">Editar Perfil</Button>
                    <Link href="/settings">
                      <Button variant="outline" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button
                    onClick={handleFollow}
                    disabled={followLoading}
                    variant={following ? 'outline' : 'default'}
                    className="font-semibold px-8 gap-2"
                    id="follow-button"
                  >
                    {followLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : following ? (
                      <><UserCheck className="w-4 h-4" /> Seguindo</>
                    ) : (
                      <><UserPlus className="w-4 h-4" /> Seguir</>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <div><span className="font-bold text-lg">{posts.length}</span> publicações</div>
              <div><span className="font-bold text-lg">{profile.followersCount || 0}</span> seguidores</div>
              <div><span className="font-bold text-lg">{playlists.length}</span> playlists</div>
            </div>

            <div className="space-y-1">
              <p className="font-bold">{profile.username}</p>
              {profile.bio && <p className="text-sm whitespace-pre-wrap text-zinc-400">{profile.bio}</p>}
            </div>
          </div>
        </div>

        {/* Tabs Grid */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full h-12 bg-transparent border-t border-border rounded-none justify-center gap-12 p-0">
            <TabsTrigger value="posts" className="data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none gap-2">
              <Grid className="w-4 h-4" /> CIFRAS
            </TabsTrigger>
            <TabsTrigger value="playlists" className="data-[state=active]:border-t-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none shadow-none gap-2">
              <Bookmark className="w-4 h-4" /> PLAYLISTS
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="pt-6">
            {posts.length === 0 ? (
              <p className="text-center text-zinc-500 py-12">Nenhuma cifra publicada ainda.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
                {posts.map(post => (
                  <Link key={post.chordsheetId} href={`/player/${post.chordsheetId}`}>
                    <div className="aspect-square relative group bg-muted overflow-hidden cursor-pointer rounded-sm">
                      <img src={post.coverUrl || ''} alt={post.trackTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-2">
                        <div className="flex items-center gap-1 font-bold">
                          <Heart className="w-5 h-5 fill-white" /> {Math.round(post.score || 0)}
                        </div>
                        <p className="text-xs text-center font-medium line-clamp-2">{post.trackTitle}</p>
                        <p className="text-xs text-zinc-300">{post.artist}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playlists" className="pt-6">
            {playlists.length === 0 ? (
              <p className="text-center text-zinc-500 py-12">Nenhuma playlist ainda.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {playlists.map(playlist => (
                  <Card key={playlist.id} className="p-6 hover:border-primary/50 transition-colors cursor-pointer flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{playlist.name}</h3>
                      <p className="text-muted-foreground">{playlist.isPublic ? 'Pública' : 'Privada'}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
