import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/auth';
import NotificationBell from '@/components/NotificationBell';
import InlineChatOverlay from '@/components/messages/InlineChatOverlay';
import EmptyMatchState from '@/components/matches/EmptyMatchState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';

interface MatchRow {
  id: string;
  created_at: string;
  partner: {
    id: string;
    name: string | null;
    avatar_url: string | null;
    age: number | null;
  };
}

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data: rows, error } = await supabase
        .from('matches')
        .select('id, created_at, user_id, matched_user_id, status')
        .or(`user_id.eq.${user.id},matched_user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error || !rows) {
        console.error('Matches load error', error);
        setMatches([]);
        setLoading(false);
        return;
      }

      const partnerIds = rows.map((r) => (r.user_id === user.id ? r.matched_user_id : r.user_id));
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, age')
        .in('id', partnerIds.length ? partnerIds : ['00000000-0000-0000-0000-000000000000']);

      const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
      setMatches(
        rows.map((r) => {
          const partnerId = r.user_id === user.id ? r.matched_user_id : r.user_id;
          const p = profileMap.get(partnerId);
          return {
            id: r.id,
            created_at: r.created_at,
            partner: {
              id: partnerId,
              name: p?.name ?? 'Someone',
              avatar_url: p?.avatar_url ?? null,
              age: p?.age ?? null,
            },
          };
        })
      );
      setLoading(false);
    };
    load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <header className="flex items-center justify-between pt-4 mb-6 px-4">
        <h1 className="text-2xl font-bold text-gradient">Matches</h1>
        <NotificationBell />
      </header>

      <main className="container max-w-md mx-auto px-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-love" />
          </div>
        ) : matches.length === 0 ? (
          <EmptyMatchState />
        ) : (
          <div className="space-y-3">
            {matches.map((m) => (
              <Card key={m.id} className="border-love/20 bg-island-light/20">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-island-light">
                    {m.partner.avatar_url ? (
                      <img src={m.partner.avatar_url} alt={m.partner.name ?? ''} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">💕</div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h2 className="font-semibold truncate">
                      {m.partner.name}{m.partner.age ? `, ${m.partner.age}` : ''}
                    </h2>
                    <p className="text-sm text-love-light truncate">New match! Say hello</p>
                  </div>
                  <Button
                    variant="ghost"
                    className="bg-love/10 hover:bg-love/20 p-2 rounded-full"
                    onClick={() => setActiveChat({ id: m.id, name: m.partner.name ?? '' })}
                  >
                    <MessageCircle size={20} className="text-love" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {activeChat && (
        <InlineChatOverlay
          matchId={activeChat.id}
          matchName={activeChat.name}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Matches;
