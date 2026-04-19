import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Award, Calendar, DollarSign, Target, ExternalLink } from "lucide-react";
import { useMatchScholarships } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AppLayout } from "@/components/layout/app-layout";

const schema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  degree: z.string().min(1, "Degree is required"),
  targetCountry: z.string().optional(),
  field: z.string().optional(),
  financialNeed: z.boolean().default(false),
});

export default function Scholarships() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { cgpa: undefined, degree: "", targetCountry: "", field: "", financialNeed: false },
  });

  const matchScholarships = useMatchScholarships();

  const onSubmit = (values: z.infer<typeof schema>) => {
    matchScholarships.mutate({ data: values });
  };

  const results = matchScholarships.data;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight glow-text mb-2">Scholarship Matching Engine</h1>
            <p className="text-muted-foreground text-lg">Discover billions in funding tailored to your profile.</p>
          </div>
        </div>

        <GlassCard className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <FormField control={form.control} name="cgpa" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGPA</FormLabel>
                    <FormControl><Input type="number" step="0.01" placeholder="0.0 - 10.0" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="degree" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degree Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Bachelors">Bachelors</SelectItem>
                        <SelectItem value="Masters">Masters</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetCountry" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                        <SelectItem value="Germany">Germany</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="field" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study</FormLabel>
                    <FormControl><Input placeholder="e.g. Computer Science" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="financialNeed" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-background/50 h-[42px] mt-auto">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-medium">Financial Need?</FormLabel>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )} />
              </div>
              <Button type="submit" disabled={matchScholarships.isPending} className="w-full md:w-auto mt-4">
                {matchScholarships.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Find Matches
              </Button>
            </form>
          </Form>
        </GlassCard>

        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <GlassCard className="p-6 bg-primary/5 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-primary">Match Summary</h2>
                  <p className="text-foreground/80">{results.summary}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Total Potential Value</p>
                  <p className="text-3xl font-bold text-primary glow-text">{results.totalValue}</p>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.scholarships.sort((a, b) => b.matchScore - a.matchScore).map((scholarship) => (
                  <GlassCard key={scholarship.id} className="p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        {scholarship.type}
                      </Badge>
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/30">
                        {scholarship.country}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{scholarship.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{scholarship.provider}</p>
                    
                    <div className="text-2xl font-bold text-emerald-400 mb-4">
                      {scholarship.amount}
                    </div>

                    <div className="space-y-4 mb-6 flex-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-medium text-primary">{scholarship.matchScore}%</span>
                        </div>
                        <Progress value={scholarship.matchScore} className="h-1.5" />
                      </div>

                      {scholarship.deadline && (
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>Deadline: <span className="font-medium text-red-400">{scholarship.deadline}</span></span>
                        </div>
                      )}

                      {scholarship.eligibility && (
                        <div className="flex items-start gap-2 text-sm text-foreground/80">
                          <Target className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                          <span className="line-clamp-2">{scholarship.eligibility}</span>
                        </div>
                      )}
                    </div>

                    {scholarship.applicationUrl && (
                      <Button variant="outline" className="w-full mt-auto group" asChild>
                        <a href={scholarship.applicationUrl} target="_blank" rel="noreferrer">
                          View Details <ExternalLink className="ml-2 w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      </Button>
                    )}
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}