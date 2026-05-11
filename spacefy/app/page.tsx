import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Heart, MessageSquare, Flame } from 'lucide-react';
import { getFeed } from '@/app/actions/chords';

export default async function HomeView() {
  const feed = await getFeed();

  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Spacefy
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Descubra cifras sincronizadas criadas pela comunidade.
          </p>
        </div>
        <Link href="/discover">
          <Button variant="outline" className="gap-2 rounded-full border-primary/20 hover:border-primary/50">
            <Flame className="w-4 h-4 text-orange-500" />
            Descobrir
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {feed.map((item, index) => (
          <Card key={item.chordsheetId} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 relative overflow-hidden bg-muted">
                <img 
                  src={item.coverUrl || ''} 
                  alt={item.trackTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link href={`/player/${item.chordsheetId}`}>
                    <Button size="icon" variant="secondary" className="rounded-full w-12 h-12 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-2xl font-bold line-clamp-1">{item.trackTitle}</h2>
                    <p className="text-muted-foreground font-medium">{item.artist}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                    <Heart className="w-4 h-4 fill-primary" />
                    {Math.round(item.score || 0)}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${item.author}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Avatar className="w-8 h-8 border-2 border-background">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${item.author}`} />
                        <AvatarFallback>{item.author.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                        @{item.author}
                      </span>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-4 text-muted-foreground text-sm">
                    <span className="flex items-center gap-1">
                      <Play className="w-4 h-4" /> {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" /> 0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
