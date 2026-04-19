import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, Clock, DollarSign, CheckCircle2, FileText, Lightbulb, TrendingUp } from "lucide-react";
import { useGetVisaGuide } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/app-layout";

const schema = z.object({
  country: z.string().min(1, "Country is required"),
  degree: z.string().optional(),
  intakeMonth: z.string().optional(),
  nationality: z.string().optional(),
});

export default function VisaGuide() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { country: "", degree: "", intakeMonth: "", nationality: "" },
  });

  const getVisaGuide = useGetVisaGuide();

  const onSubmit = (values: z.infer<typeof schema>) => {
    getVisaGuide.mutate({ data: values });
  };

  const results = getVisaGuide.data;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight glow-text mb-2">Visa Guidance Module</h1>
            <p className="text-muted-foreground text-lg">Clear roadmap to your student visa, zero confusion.</p>
          </div>
        </div>

        <GlassCard className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
              <FormField control={form.control} name="country" render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Target Country</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Ireland">Ireland</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="degree" render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Degree Level (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Bachelors">Bachelors</SelectItem>
                      <SelectItem value="Masters">Masters</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" disabled={getVisaGuide.isPending} className="w-full md:w-auto h-[42px]">
                {getVisaGuide.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                Generate Guide
              </Button>
            </form>
          </Form>
        </GlassCard>

        <AnimatePresence>
          {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Stat Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-primary">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visa Type</p>
                    <p className="font-bold text-foreground text-lg">{results.visaType}</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-secondary">
                  <div className="p-3 bg-secondary/10 rounded-full text-secondary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                    <p className="font-bold text-foreground text-lg">{results.processingTime}</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
                  <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Visa Fee</p>
                    <p className="font-bold text-foreground text-lg">{results.fee || "Varies"}</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-5 flex items-center gap-4 border-l-4 border-l-amber-500">
                  <div className="p-3 bg-amber-500/10 rounded-full text-amber-500">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="font-bold text-foreground text-lg">{results.successRate ? `${results.successRate}%` : "N/A"}</p>
                  </div>
                </GlassCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  <GlassCard className="p-6">
                    <h2 className="text-2xl font-bold glow-text mb-6">Step-by-Step Process</h2>
                    <div className="relative border-l-2 border-border/50 ml-4 md:ml-6 pl-6 space-y-8 py-4">
                      {results.steps.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[35px] bg-background border-2 border-primary rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold text-primary">
                            {step.step}
                          </div>
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground/90">{step.title}</h3>
                            <Badge variant="outline" className="text-xs bg-card/50">
                              {step.timeframe}
                            </Badge>
                            {step.critical && (
                              <Badge variant="destructive" className="text-[10px] px-1.5 h-5">CRITICAL</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <GlassCard className="p-6 bg-primary/5 border-primary/20">
                    <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
                      <FileText className="w-4 h-4" /> Required Documents
                    </h3>
                    <ul className="space-y-3">
                      {results.requiredDocuments.map((doc, idx) => (
                        <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-4 text-amber-400">
                      <Lightbulb className="w-4 h-4" /> Pro Tips
                    </h3>
                    <ul className="space-y-3">
                      {results.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>

                  {results.postStudyWork && (
                    <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20">
                      <h3 className="font-semibold flex items-center gap-2 mb-2 text-emerald-500">
                        <TrendingUp className="w-4 h-4" /> Post-Study Work
                      </h3>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {results.postStudyWork}
                      </p>
                    </GlassCard>
                  )}
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}