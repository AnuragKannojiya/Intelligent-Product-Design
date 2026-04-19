import { AppLayout } from "@/components/layout/app-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useGetRoiPrediction } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrendingUp, BrainCircuit, AlertTriangle, PieChart as PieChartIcon, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  degree: z.string().min(2),
  internships: z.coerce.number().default(0),
  collegeTier: z.string().default("Tier 2"),
  field: z.string().min(2),
  skills: z.string().transform(val => val.split(",").map(s => s.trim()).filter(Boolean)),
  country: z.string().default("USA"),
  course: z.string().default("MS CS"),
  totalBudget: z.coerce.number().default(50),
  loanAmount: z.coerce.number().default(40),
});

type FormValues = z.infer<typeof formSchema>;

const COLORS = ['hsl(190 100% 50%)', 'hsl(239 84% 67%)', 'hsl(280 70% 60%)', 'hsl(150 60% 50%)', 'hsl(35 90% 55%)'];

export default function RoiEngine() {
  const getRoi = useGetRoiPrediction();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cgpa: 8.5, degree: "B.Tech", internships: 1, collegeTier: "Tier 2",
      field: "Computer Science", skills: [], country: "USA", course: "MS CS",
      totalBudget: 50, loanAmount: 40
    },
  });

  const onSubmit = (data: FormValues) => {
    getRoi.mutate({ data });
  };

  const results = getRoi.data;

  const costData = results?.totalCost ? [
    { name: 'Tuition', value: results.totalCost.tuition },
    { name: 'Living', value: results.totalCost.living || 0 },
    { name: 'Visa', value: results.totalCost.visa || 0 },
    { name: 'Travel', value: results.totalCost.travel || 0 },
    { name: 'Misc', value: results.totalCost.misc || 0 },
  ].filter(d => d.value > 0) : [];

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-secondary" /> ROI & Outcome Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">Predict placement probabilities, salary bands, and financial return on investment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-4">
            <GlassCard className="p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <BrainCircuit className="h-5 w-5 text-secondary" />
                <h2 className="font-semibold text-lg">Prediction Parameters</h2>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="country" render={({ field }) => (
                      <FormItem><FormLabel>Target Country</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="course" render={({ field }) => (
                      <FormItem><FormLabel>Course</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="totalBudget" render={({ field }) => (
                      <FormItem><FormLabel>Total Cost (L)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="loanAmount" render={({ field }) => (
                      <FormItem><FormLabel>Loan Req. (L)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                  </div>
                  
                  <div className="pt-4 border-t border-white/5 space-y-4">
                    <div className="text-sm font-medium text-muted-foreground">Academic Baseline</div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="cgpa" render={({ field }) => (
                        <FormItem><FormLabel>CGPA</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="bg-background/50" /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="internships" render={({ field }) => (
                        <FormItem><FormLabel>Internships</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="collegeTier" render={({ field }) => (
                      <FormItem><FormLabel>UG College Tier</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="field" render={({ field }) => (
                      <FormItem><FormLabel>Field of Study</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="skills" render={({ field }) => (
                      <FormItem><FormLabel>Skills (comma sep)</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                  </div>

                  <Button type="submit" disabled={getRoi.isPending} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-4 gap-2">
                    {getRoi.isPending ? "Computing..." : "Run Prediction Model"}
                  </Button>
                </form>
              </Form>
            </GlassCard>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8 space-y-8">
            {!results && !getRoi.isPending && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-card/10">
                <TrendingUp className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Run the prediction model to view ROI intelligence.</p>
              </div>
            )}

            {getRoi.isPending && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-secondary/30 rounded-xl bg-secondary/5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4 border-t-transparent"></div>
                <p className="text-secondary animate-pulse">Running Monte Carlo Simulations...</p>
              </div>
            )}

            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* AI Explanation Callout */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-secondary/20 p-6">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary to-primary" />
                  <div className="flex gap-4">
                    <BrainCircuit className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Outcome Intelligence Report</h3>
                      <p className="text-muted-foreground leading-relaxed">{results.aiExplanation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Placement Gauge & Risk */}
                  <GlassCard className="p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <Badge className={
                        results.riskLevel.toLowerCase() === 'low' ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/30' :
                        results.riskLevel.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-500 hover:bg-red-500/20 border-red-500/30' :
                        'bg-amber-500/20 text-amber-500 hover:bg-amber-500/20 border-amber-500/30'
                      }>
                        <AlertTriangle className="h-3 w-3 mr-1" /> {results.riskLevel} Risk
                      </Badge>
                    </div>
                    
                    <div className="text-muted-foreground font-medium mb-4">AI Placement Score</div>
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--secondary))" strokeWidth="8" 
                                strokeDasharray={`${results.placementScore * 2.827} 282.7`} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-bold text-secondary glow-text">{results.placementScore}</span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                    <div className="mt-6 w-full text-left space-y-3">
                      <div className="text-sm font-medium text-muted-foreground mb-1">Placement Probability Timeline</div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>3 Months</span> <span>{results.placement3Month}%</span></div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary/60" style={{ width: `${results.placement3Month}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>6 Months</span> <span>{results.placement6Month}%</span></div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary/80" style={{ width: `${results.placement6Month}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span>12 Months</span> <span>{results.placement12Month}%</span></div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-secondary" style={{ width: `${results.placement12Month}%` }} />
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  {/* Financial Outcomes */}
                  <div className="space-y-6">
                    <GlassCard className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-emerald-400">
                        <DollarSign className="h-5 w-5" />
                        <h3 className="font-semibold text-foreground">Projected Salary Band</h3>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-3xl font-bold text-foreground">
                          ${results.salaryBandMin.toLocaleString()} - ${results.salaryBandMax.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Median: <span className="text-emerald-400">${results.salaryMedian?.toLocaleString()}</span></div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                        <div>
                          <div className="text-sm text-muted-foreground">Payback Period</div>
                          <div className="text-xl font-bold text-foreground">{results.paybackYears} Years</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">ROI Strength</div>
                          <Badge variant="outline" className="mt-1 border-primary/30 text-primary bg-primary/10">{results.roiStrength}</Badge>
                        </div>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-6">
                      <div className="flex items-center gap-2 mb-4 text-chart-4">
                        <PieChartIcon className="h-5 w-5" />
                        <h3 className="font-semibold text-foreground">Total Cost Breakdown</h3>
                      </div>
                      <div className="h-[180px] w-full flex items-center">
                        <div className="w-1/2 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={costData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                                {costData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-4 space-y-2">
                          <div className="text-xl font-bold mb-2">${results.totalCost?.total.toLocaleString()}</div>
                          {costData.map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                <span className="text-muted-foreground">{d.name}</span>
                              </div>
                              <span className="font-medium">${d.value.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
