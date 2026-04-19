import { useGetGamificationProfile, useGetLeaderboard } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Trophy, Star, Zap, Flame, Lock, Shield, Crown, CheckCircle2 } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/app-layout";

export default function Gamification() {
  const { data: profile, isLoading: profileLoading } = useGetGamificationProfile();
  const { data: leaderboard, isLoading: leaderboardLoading } = useGetLeaderboard();

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'legendary': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'epic': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'rare': return 'text-primary bg-primary/10 border-primary/30';
      default: return 'text-muted-foreground bg-muted/30 border-border/50';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-amber-400" />;
      case 2: return <Crown className="w-5 h-5 text-slate-300" />;
      case 3: return <Crown className="w-5 h-5 text-amber-700" />;
      default: return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  if (profileLoading || leaderboardLoading) {
    return (
      <AppLayout>
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Loading achievements...
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {profile && (
          <GlassCard className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="shrink-0 flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-card to-background border-4 border-primary/30 shadow-[0_0_30px_rgba(0,212,255,0.2)]">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Level</div>
                  <div className="text-5xl font-black glow-text leading-none">{profile.level}</div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{profile.levelTitle}</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> Rank #{profile.rank || '--'} Worldwide
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="px-3 py-1.5 bg-background/50 border-border text-sm flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      <span className="font-bold text-foreground">{profile.streakDays} Day Streak</span>
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-primary">{profile.xp} XP</span>
                    <span className="text-muted-foreground">{profile.xpToNextLevel} XP to next level</span>
                  </div>
                  <Progress value={profile.progressPercent} className="h-3 w-full bg-muted/50">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" style={{ width: `${profile.progressPercent}%` }} />
                  </Progress>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold glow-text mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" /> Badge Arsenal
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {profile?.badges.map((badge) => (
                  <GlassCard 
                    key={badge.id} 
                    className={`p-5 relative transition-all duration-300 ${!badge.isEarned ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:-translate-y-1'}`}
                  >
                    {!badge.isEarned && (
                      <div className="absolute top-3 right-3 text-muted-foreground">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${badge.isEarned ? 'bg-background/80 shadow-[0_0_15px_rgba(0,212,255,0.15)]' : 'bg-muted/30'}`}>
                        {badge.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground/90">{badge.name}</h3>
                        <Badge variant="outline" className={`mt-2 mb-2 text-[10px] uppercase ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Global Leaderboard
              </h2>
              <div className="space-y-3">
                {leaderboard?.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-3 rounded-xl border ${entry.name === 'You' ? 'bg-primary/10 border-primary/30' : 'bg-background/40 border-transparent hover:border-border/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 flex justify-center">{getRankIcon(entry.rank)}</div>
                      <div>
                        <p className={`font-semibold text-sm ${entry.name === 'You' ? 'text-primary' : 'text-foreground'}`}>{entry.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          Lvl {entry.level} • {entry.targetCountry || 'Global'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{entry.xp.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">XP</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" /> Modules Mastered
              </h2>
              <div className="space-y-3">
                {['Profile Created', 'Career Navigator', 'ROI Engine', 'Loan Readiness'].map((mod, i) => {
                  const isCompleted = profile?.completedModules?.includes(mod) || i < 2;
                  return (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-primary text-primary-foreground' : 'bg-muted border border-border/50'}`}>
                        {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className={`text-sm ${isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{mod}</span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}