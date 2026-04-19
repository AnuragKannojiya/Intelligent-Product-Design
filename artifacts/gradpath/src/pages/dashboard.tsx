import { AppLayout } from "@/components/layout/app-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useGetDashboardSummary, useGetRecentAssessments, useGetCountryDistribution, useGetRiskBreakdown } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, TrendingUp, ShieldCheck, Compass, Calculator, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const COLORS = ['hsl(190 100% 50%)', 'hsl(239 84% 67%)', 'hsl(280 70% 60%)', 'hsl(150 60% 50%)'];

export default function Dashboard() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: assessments, isLoading: isLoadingAssessments } = useGetRecentAssessments();
  const { data: countries, isLoading: isLoadingCountries } = useGetCountryDistribution();
  const { data: risks, isLoading: isLoadingRisks } = useGetRiskBreakdown();

  const renderRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Low Risk</Badge>;
      case 'medium': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Medium Risk</Badge>;
      case 'high': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">High Risk</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight glow-text">Intelligence Hub</h1>
            <p className="text-muted-foreground mt-1">Platform overview and real-time financing metrics.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/career"><Button variant="outline" className="border-primary/20 hover:bg-primary/10 text-primary gap-2"><Compass className="h-4 w-4"/> Career</Button></Link>
            <Link href="/roi"><Button variant="outline" className="border-secondary/20 hover:bg-secondary/10 text-secondary gap-2"><TrendingUp className="h-4 w-4"/> ROI</Button></Link>
            <Link href="/loan"><Button variant="outline" className="border-chart-4/20 hover:bg-chart-4/10 text-chart-4 gap-2"><Calculator className="h-4 w-4"/> Loan</Button></Link>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="font-medium">Total Assessments</span>
              <Users className="h-5 w-5" />
            </div>
            <div className="text-4xl font-bold text-foreground">
              {isLoadingSummary ? "-" : summary?.totalAssessments.toLocaleString()}
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="font-medium">Avg Placement Score</span>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="text-4xl font-bold text-primary glow-text">
              {isLoadingSummary ? "-" : summary?.avgPlacementScore}
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="font-medium">Top Destination</span>
              <MapPin className="h-5 w-5 text-secondary" />
            </div>
            <div className="text-4xl font-bold text-secondary">
              {isLoadingSummary ? "-" : summary?.topDestination}
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center justify-between text-muted-foreground mb-4">
              <span className="font-medium">Low Risk Portfolio</span>
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-4xl font-bold text-emerald-500">
              {isLoadingSummary ? "-" : `${summary?.lowRiskPercent}%`}
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Target Destination Distribution</h3>
              <div className="h-[300px] w-full">
                {isLoadingCountries ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countries}>
                      <XAxis dataKey="country" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Recent Assessments</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Student</th>
                      <th className="px-4 py-3">Degree</th>
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3 rounded-tr-lg">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingAssessments ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
                    ) : assessments?.map((a) => (
                      <tr key={a.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-medium">{a.studentName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{a.degree}</td>
                        <td className="px-4 py-3 text-muted-foreground">{a.targetCountry}</td>
                        <td className="px-4 py-3 font-semibold text-primary">{a.placementScore}</td>
                        <td className="px-4 py-3">{renderRiskBadge(a.riskLevel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-6">Risk Breakdown</h3>
              <div className="h-[250px] w-full">
                {isLoadingRisks ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Loading...</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={risks}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {risks?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={
                            entry.level.toLowerCase() === 'low' ? 'hsl(150 60% 50%)' :
                            entry.level.toLowerCase() === 'medium' ? 'hsl(35 90% 55%)' :
                            'hsl(0 62.8% 30.6%)'
                          } />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-4">
                {risks?.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.level} Risk</span>
                    <span className="font-semibold">{r.percentage}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
