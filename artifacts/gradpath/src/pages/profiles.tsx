import { AppLayout } from "@/components/layout/app-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useListProfiles } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, GraduationCap, MapPin, Brain } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Profiles() {
  const { data: profiles, isLoading } = useListProfiles();
  const [search, setSearch] = useState("");

  const filteredProfiles = profiles?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.degree.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight glow-text">Student Profiles</h1>
            <p className="text-muted-foreground mt-1">Directory of assessed candidates.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search students..." 
              className="pl-9 bg-card/50 border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">Loading profiles...</div>
          ) : filteredProfiles?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">No profiles found.</div>
          ) : (
            filteredProfiles?.map((profile) => (
              <GlassCard key={profile.id} className="p-6 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_32px_0_rgba(0,212,255,0.1)]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{profile.name}</h3>
                      <div className="text-sm text-muted-foreground">{new Date(profile.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.degree} <span className="text-primary font-medium">({profile.cgpa} CGPA)</span></span>
                  </div>
                  {profile.targetCountry && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>Target: {profile.targetCountry}</span>
                    </div>
                  )}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Brain className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">Skills: {profile.skills.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                    {profile.internships} Internships
                  </Badge>
                  {profile.hasCoApplicant && (
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-500">
                      Co-applicant ✅
                    </Badge>
                  )}
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
