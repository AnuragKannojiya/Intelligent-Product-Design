import { AppLayout } from "@/components/layout/app-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useGetLoanEligibility } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle2, ShieldAlert, CreditCard, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  totalCost: z.coerce.number().min(1),
  expectedSalary: z.coerce.number().min(1),
  familyIncome: z.string().default("10 - 20 LPA"),
  hasCoApplicant: z.boolean().default(true),
  scholarship: z.coerce.number().default(0),
  riskLevel: z.string().default("Low"),
  tenure: z.coerce.number().default(10),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoanEngine() {
  const getEligibility = useGetLoanEligibility();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCost: 50, expectedSalary: 80, familyIncome: "10 - 20 LPA",
      hasCoApplicant: true, scholarship: 0, riskLevel: "Low", tenure: 10
    },
  });

  const onSubmit = (data: FormValues) => {
    getEligibility.mutate({ data });
  };

  const results = getEligibility.data;

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text flex items-center gap-3 text-chart-4">
            <Calculator className="h-8 w-8" /> Loan Readiness Engine
          </h1>
          <p className="text-muted-foreground mt-1">Determine maximum eligible loan amount and simulate EMI stress levels.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-4">
            <GlassCard className="p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <Scale className="h-5 w-5 text-chart-4" />
                <h2 className="font-semibold text-lg">Financial Profile</h2>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="totalCost" render={({ field }) => (
                      <FormItem><FormLabel>Total Cost (Lakhs)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="scholarship" render={({ field }) => (
                      <FormItem><FormLabel>Scholarship (Lakhs)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="expectedSalary" render={({ field }) => (
                    <FormItem><FormLabel>Expected Post-Study Salary (Lakhs)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="familyIncome" render={({ field }) => (
                    <FormItem><FormLabel>Family Income Band</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="riskLevel" render={({ field }) => (
                      <FormItem><FormLabel>Placement Risk</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="tenure" render={({ field }) => (
                      <FormItem><FormLabel>Target Tenure (Yrs)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="hasCoApplicant" render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-border p-4 bg-background/50 mt-2">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel className="font-normal cursor-pointer">Include Co-applicant Profile</FormLabel>
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={getEligibility.isPending} className="w-full bg-chart-4 text-chart-4-foreground hover:bg-chart-4/90 mt-4 gap-2">
                    {getEligibility.isPending ? "Calculating..." : "Check Eligibility"}
                  </Button>
                </form>
              </Form>
            </GlassCard>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8 space-y-8">
            {!results && !getEligibility.isPending && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-card/10">
                <Calculator className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Run the readiness check to view loan eligibility.</p>
              </div>
            )}

            {getEligibility.isPending && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-chart-4/30 rounded-xl bg-chart-4/5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chart-4 mb-4 border-l-transparent"></div>
                <p className="text-chart-4 animate-pulse">Analyzing Credit Capacity...</p>
              </div>
            )}

            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* AI Explanation Callout */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-chart-4/10 to-primary/10 border border-chart-4/20 p-6">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-chart-4 to-primary" />
                  <div className="flex gap-4">
                    <ShieldAlert className="h-6 w-6 text-chart-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Credit Intelligence Analysis</h3>
                      <p className="text-muted-foreground leading-relaxed">{results.aiExplanation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Readiness Score */}
                  <GlassCard className="p-6 flex flex-col justify-center items-center text-center">
                    <div className="text-muted-foreground font-medium mb-4">Loan Readiness Score</div>
                    <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--chart-4))" strokeWidth="8" 
                                strokeDasharray={`${results.loanReadinessScore * 2.827} 282.7`} className="drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-5xl font-bold text-chart-4 glow-text">{results.loanReadinessScore}</span>
                        <span className="text-xs text-muted-foreground">/ 100</span>
                      </div>
                    </div>
                    
                    <Badge className={
                      results.readinessLevel.toLowerCase() === 'excellent' || results.readinessLevel.toLowerCase() === 'high' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' :
                      results.readinessLevel.toLowerCase() === 'poor' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                      'bg-amber-500/20 text-amber-500 border-amber-500/30'
                    }>
                      {results.readinessLevel} Readiness
                    </Badge>

                    {results.needsCoApplicant && (
                      <div className="mt-4 text-sm text-amber-500 flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
                        <ShieldAlert className="h-4 w-4" /> Strong Co-applicant Required
                      </div>
                    )}
                  </GlassCard>

                  {/* Loan Details */}
                  <div className="space-y-6">
                    <GlassCard className="p-6 bg-gradient-to-br from-chart-4/5 to-transparent border-chart-4/20">
                      <div className="text-sm font-medium text-chart-4 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" /> Eligible Loan Range
                      </div>
                      <div className="text-4xl font-bold text-foreground">
                        {results.eligibleMin}L - {results.eligibleMax}L <span className="text-sm font-normal text-muted-foreground">INR</span>
                      </div>
                      <div className="mt-4 pt-4 border-t border-chart-4/10">
                        <div className="text-sm text-muted-foreground">Affordability Index</div>
                        <div className="text-lg font-semibold mt-1">{results.affordabilityScore}</div>
                      </div>
                      {results.recommendation && (
                        <div className="mt-4 text-sm text-muted-foreground bg-black/20 p-3 rounded-md">
                          {results.recommendation}
                        </div>
                      )}
                    </GlassCard>

                    <GlassCard className="p-0 overflow-hidden border border-white/10">
                      <div className="bg-muted/30 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">EMI Stress Scenarios</h3>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-sm">
                          <thead className="text-xs text-muted-foreground bg-black/20">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">Tenure</th>
                              <th className="px-4 py-2 text-right font-medium">Monthly EMI</th>
                              <th className="px-4 py-2 text-center font-medium">Stress</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.emiScenarios?.map((scenario, i) => (
                              <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5">
                                <td className="px-4 py-3 font-medium">{scenario.tenure} Years</td>
                                <td className="px-4 py-3 text-right font-mono">₹{scenario.emi.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">
                                  <Badge variant="outline" className={
                                    scenario.stressLevel.toLowerCase() === 'low' ? 'border-emerald-500/30 text-emerald-500' :
                                    scenario.stressLevel.toLowerCase() === 'high' ? 'border-red-500/30 text-red-500' :
                                    'border-amber-500/30 text-amber-500'
                                  }>
                                    {scenario.stressLevel}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
