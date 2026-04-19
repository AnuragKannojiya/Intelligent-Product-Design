import { AppLayout } from "@/components/layout/app-layout";
import { GlassCard } from "@/components/ui/glass-card";
import { useGetCareerRecommendations } from "@workspace/api-client-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, MapPin, BookOpen, Building, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const formSchema = z.object({
  cgpa: z.coerce.number().min(0).max(10),
  degree: z.string().min(2, "Degree required"),
  branch: z.string().optional(),
  interests: z.string().optional(),
  budget: z.coerce.number().optional(),
  internships: z.coerce.number().default(0),
  skills: z.string().transform(val => val.split(",").map(s => s.trim()).filter(Boolean)),
});

type FormValues = z.infer<typeof formSchema>;

export default function CareerNavigator() {
  const getRecommendations = useGetCareerRecommendations();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cgpa: 8.5,
      degree: "B.Tech",
      branch: "Computer Science",
      interests: "AI, Machine Learning",
      budget: 40,
      internships: 1,
      skills: [],
    },
  });

  const onSubmit = (data: FormValues) => {
    getRecommendations.mutate({ data });
  };

  const results = getRecommendations.data;

  return (
    <AppLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight glow-text flex items-center gap-3">
            <Compass className="h-8 w-8 text-primary" /> AI Career Navigator
          </h1>
          <p className="text-muted-foreground mt-1">Discover optimal global destinations, courses, and universities based on your profile.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Form */}
          <div className="lg:col-span-4">
            <GlassCard className="p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Analysis Parameters</h2>
              </div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="degree" render={({ field }) => (
                    <FormItem><FormLabel>Current Degree</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="branch" render={({ field }) => (
                    <FormItem><FormLabel>Branch</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="cgpa" render={({ field }) => (
                      <FormItem><FormLabel>CGPA</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="internships" render={({ field }) => (
                      <FormItem><FormLabel>Internships</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="budget" render={({ field }) => (
                    <FormItem><FormLabel>Budget (Lakhs INR)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="interests" render={({ field }) => (
                    <FormItem><FormLabel>Career Interests</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="skills" render={({ field }) => (
                    <FormItem><FormLabel>Skills (comma separated)</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl></FormItem>
                  )} />
                  <Button type="submit" disabled={getRecommendations.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4 gap-2">
                    {getRecommendations.isPending ? "Analyzing..." : "Generate Insights"}
                  </Button>
                </form>
              </Form>
            </GlassCard>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8 space-y-8">
            {!results && !getRecommendations.isPending && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl bg-card/10">
                <Compass className="h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Run the analysis to view AI recommendations.</p>
              </div>
            )}

            {getRecommendations.isPending && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-dashed border-primary/30 rounded-xl bg-primary/5">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-primary animate-pulse">Running Neural Matching Algorithm...</p>
              </div>
            )}

            {results && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* AI Explanation Callout */}
                <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-6">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-secondary" />
                  <div className="flex gap-4">
                    <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">AI Strategic Assessment</h3>
                      <p className="text-muted-foreground leading-relaxed">{results.aiExplanation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Destinations */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold border-b border-white/10 pb-2">
                      <MapPin className="h-4 w-4" /> Top Destinations
                    </div>
                    {results.countries.map((country, i) => (
                      <GlassCard key={i} className="p-4 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-lg">{country.flag} {country.country}</span>
                          <span className="text-xs text-primary font-mono">{country.fitScore}% Fit</span>
                        </div>
                        <Progress value={country.fitScore} className="h-1.5 mb-3 bg-white/10" indicatorClassName="bg-primary" />
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between"><span>PSW:</span> <span className="text-foreground">{country.postStudyWork}</span></div>
                          <div className="flex justify-between"><span>Market:</span> <span className="text-foreground">{country.jobMarket}</span></div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>

                  {/* Courses */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-secondary font-semibold border-b border-white/10 pb-2">
                      <BookOpen className="h-4 w-4" /> Optimal Courses
                    </div>
                    {results.courses.map((course, i) => (
                      <GlassCard key={i} className="p-4 hover:border-secondary/30 transition-colors">
                        <h4 className="font-medium mb-1 leading-tight">{course.name}</h4>
                        <div className="text-xs text-muted-foreground mb-3">{course.field}</div>
                        <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 mb-2">
                          {course.demandLevel} Demand
                        </Badge>
                        <div className="text-xs text-muted-foreground flex justify-between mt-1">
                          <span>Avg Salary:</span> <span className="text-foreground font-mono">{course.avgSalary}</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>

                  {/* Universities */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-chart-4 font-semibold border-b border-white/10 pb-2">
                      <Building className="h-4 w-4" /> Target Universities
                    </div>
                    {results.universities.map((uni, i) => (
                      <GlassCard key={i} className="p-4 hover:border-chart-4/30 transition-colors">
                        <h4 className="font-medium mb-1 leading-tight">{uni.name}</h4>
                        <div className="text-xs text-muted-foreground mb-3">{uni.country}</div>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className={
                            uni.tier.toLowerCase() === 'safe' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                            uni.tier.toLowerCase() === 'target' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }>
                            {uni.tier}
                          </Badge>
                          <span className="text-xs text-chart-4 font-mono">{uni.admitProbability}% Admit</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-start gap-1 mt-2">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{uni.reason}</span>
                        </div>
                      </GlassCard>
                    ))}
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
