import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckSquare, FileText, Send, Loader2, AlertCircle, ArrowRight, BookOpen, PenTool, AlertTriangle } from "lucide-react";
import { useGenerateTimeline, useGetDocumentChecklist, useGetSopGuide } from "@workspace/api-client-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppLayout } from "@/components/layout/app-layout";

const timelineSchema = z.object({
  targetIntake: z.string().min(1, "Intake is required"),
  targetCountry: z.string().min(1, "Country is required"),
  targetCourse: z.string().optional(),
  hasIelts: z.boolean().default(false),
  hasGre: z.boolean().default(false),
  cgpa: z.coerce.number().min(0).max(10).optional(),
});

const checklistSchema = z.object({
  targetCountry: z.string().min(1, "Country is required"),
  hasLoanRequirement: z.boolean().default(false),
});

const sopSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  targetCourse: z.string().min(1, "Course is required"),
  targetUniversity: z.string().optional(),
  cgpa: z.coerce.number().min(0).max(10).optional(),
  careerGoal: z.string().min(1, "Career goal is required"),
});

export default function JourneyCopilot() {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const timelineForm = useForm<z.infer<typeof timelineSchema>>({
    resolver: zodResolver(timelineSchema),
    defaultValues: { targetIntake: "", targetCountry: "", targetCourse: "", hasIelts: false, hasGre: false, cgpa: undefined },
  });

  const checklistForm = useForm<z.infer<typeof checklistSchema>>({
    resolver: zodResolver(checklistSchema),
    defaultValues: { targetCountry: "", hasLoanRequirement: false },
  });

  const sopForm = useForm<z.infer<typeof sopSchema>>({
    resolver: zodResolver(sopSchema),
    defaultValues: { degree: "", targetCourse: "", targetUniversity: "", cgpa: undefined, careerGoal: "" },
  });

  const generateTimeline = useGenerateTimeline();
  const getChecklist = useGetDocumentChecklist();
  const getSopGuide = useGetSopGuide();

  const onTimelineSubmit = (values: z.infer<typeof timelineSchema>) => {
    generateTimeline.mutate({ data: values });
  };

  const onChecklistSubmit = (values: z.infer<typeof checklistSchema>) => {
    setCheckedDocs({});
    getChecklist.mutate({ data: values });
  };

  const onSopSubmit = (values: z.infer<typeof sopSchema>) => {
    getSopGuide.mutate({ data: values });
  };

  const toggleDoc = (id: string) => {
    setCheckedDocs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const timelineData = generateTimeline.data;
  const checklistData = getChecklist.data;
  const sopData = getSopGuide.data;

  const checkedCount = checklistData ? Object.keys(checkedDocs).filter(k => checkedDocs[k]).length : 0;
  const totalDocsCount = checklistData ? checklistData.categories.reduce((acc, cat) => acc + cat.items.length, 0) : 0;
  const progressPercent = totalDocsCount > 0 ? (checkedCount / totalDocsCount) * 100 : 0;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight glow-text mb-2">Application Journey Copilot</h1>
            <p className="text-muted-foreground text-lg">Your intelligent roadmap to global education.</p>
          </div>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border-border/50">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <Calendar className="w-4 h-4 mr-2" /> Timeline Generator
            </TabsTrigger>
            <TabsTrigger value="checklist" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <CheckSquare className="w-4 h-4 mr-2" /> Document Checklist
            </TabsTrigger>
            <TabsTrigger value="sop" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <FileText className="w-4 h-4 mr-2" /> SOP Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6 space-y-6">
            <GlassCard className="p-6">
              <Form {...timelineForm}>
                <form onSubmit={timelineForm.handleSubmit(onTimelineSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={timelineForm.control} name="targetCountry" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
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
                    <FormField control={timelineForm.control} name="targetIntake" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Intake</FormLabel>
                        <FormControl><Input placeholder="e.g. Fall 2025" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={timelineForm.control} name="targetCourse" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. MS in Computer Science" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={timelineForm.control} name="cgpa" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA (Optional)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.0 - 10.0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={timelineForm.control} name="hasIelts" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-background/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">IELTS/TOEFL Cleared?</FormLabel>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={timelineForm.control} name="hasGre" render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-background/50">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">GRE/GMAT Cleared?</FormLabel>
                        </div>
                        <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full md:w-auto mt-4" disabled={generateTimeline.isPending}>
                    {generateTimeline.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Generate Strategy
                  </Button>
                </form>
              </Form>
            </GlassCard>

            <AnimatePresence>
              {timelineData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <GlassCard className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 pb-6 border-b border-border/50">
                      <div>
                        <h2 className="text-2xl font-bold glow-text mb-2">Master Timeline</h2>
                        <p className="text-muted-foreground">{timelineData.summary}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                        <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/30">
                          {timelineData.totalWeeks} Weeks Total
                        </Badge>
                        <Badge variant="outline" className={`px-3 py-1 ${timelineData.urgencyLevel === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                          {timelineData.urgencyLevel} Urgency
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="relative border-l-2 border-border/50 ml-4 md:ml-6 pl-6 space-y-8 py-4">
                      {timelineData.phases.map((phase, index) => (
                        <div key={index} className="relative">
                          <div className="absolute -left-[35px] bg-background border-2 border-primary rounded-full w-6 h-6 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                          <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-primary">{phase.title}</h3>
                            <span className="text-sm text-muted-foreground font-mono">Weeks {phase.startWeek}-{phase.endWeek}</span>
                          </div>
                          <div className="grid gap-3">
                            {phase.tasks.map((task, tIndex) => (
                              <div key={tIndex} className="bg-background/40 border border-border/50 p-4 rounded-lg flex items-start gap-3">
                                <ArrowRight className="w-4 h-4 text-primary mt-1 shrink-0" />
                                <span className="text-sm text-foreground/90">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="checklist" className="mt-6 space-y-6">
            <GlassCard className="p-6">
              <Form {...checklistForm}>
                <form onSubmit={checklistForm.handleSubmit(onChecklistSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
                  <FormField control={checklistForm.control} name="targetCountry" render={({ field }) => (
                    <FormItem className="flex-1 w-full">
                      <FormLabel>Target Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
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
                  <FormField control={checklistForm.control} name="hasLoanRequirement" render={({ field }) => (
                    <FormItem className="flex-1 w-full flex flex-row items-center justify-between rounded-lg border border-white/10 p-4 bg-background/50 h-[42px] mt-auto">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-medium">Include Loan Docs?</FormLabel>
                      </div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <Button type="submit" disabled={getChecklist.isPending} className="w-full md:w-auto h-[42px]">
                    {getChecklist.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                    Get Checklist
                  </Button>
                </form>
              </Form>
            </GlassCard>

            <AnimatePresence>
              {checklistData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <GlassCard className="p-6">
                    <div className="flex flex-col gap-4 mb-8">
                      <div className="flex justify-between items-end">
                        <div>
                          <h2 className="text-2xl font-bold glow-text">Master Document Vault</h2>
                          <p className="text-muted-foreground mt-1">{checkedCount} of {checklistData.totalDocuments} documents ready ({checklistData.criticalCount} critical)</p>
                        </div>
                        <span className="text-2xl font-mono text-primary font-bold">{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-3 w-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                      </Progress>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {checklistData.categories.map((category, cIdx) => (
                        <div key={cIdx} className="bg-background/40 border border-border/50 rounded-xl p-5 space-y-4">
                          <h3 className="text-lg font-semibold text-foreground/90 pb-2 border-b border-border/50 flex items-center gap-2">
                            {category.category}
                          </h3>
                          <div className="space-y-3">
                            {category.items.map((item) => (
                              <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-card/50 transition-colors border border-transparent hover:border-border/30">
                                <Checkbox id={item.id} checked={checkedDocs[item.id] || false} onCheckedChange={() => toggleDoc(item.id)} className="mt-1" />
                                <div className="grid gap-1.5 flex-1 leading-none">
                                  <label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2">
                                    {item.name}
                                    {item.isCritical && <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">CRITICAL</Badge>}
                                  </label>
                                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                  {item.tip && (
                                    <div className="flex items-start gap-1.5 mt-1 bg-primary/5 text-primary/80 p-2 rounded text-xs border border-primary/10">
                                      <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                                      <span>{item.tip}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="sop" className="mt-6 space-y-6">
            <GlassCard className="p-6">
              <Form {...sopForm}>
                <form onSubmit={sopForm.handleSubmit(onSopSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={sopForm.control} name="degree" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select degree" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Bachelors">Bachelors</SelectItem>
                            <SelectItem value="Masters">Masters</SelectItem>
                            <SelectItem value="PhD">PhD</SelectItem>
                            <SelectItem value="MBA">MBA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={sopForm.control} name="targetCourse" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Course</FormLabel>
                        <FormControl><Input placeholder="e.g. MS Data Science" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={sopForm.control} name="targetUniversity" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target University (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g. Stanford University" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={sopForm.control} name="cgpa" render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA (Optional)</FormLabel>
                        <FormControl><Input type="number" step="0.01" placeholder="0.0 - 10.0" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={sopForm.control} name="careerGoal" render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Core Career Goal</FormLabel>
                        <FormControl><Input placeholder="e.g. AI Researcher focusing on climate change" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" disabled={getSopGuide.isPending} className="w-full mt-4">
                    {getSopGuide.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenTool className="mr-2 h-4 w-4" />}
                    Architect SOP Structure
                  </Button>
                </form>
              </Form>
            </GlassCard>

            <AnimatePresence>
              {sopData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <GlassCard className="p-6">
                        <div className="mb-6 pb-6 border-b border-border/50">
                          <h2 className="text-2xl font-bold glow-text mb-2">Narrative Architecture</h2>
                          <p className="text-muted-foreground">Target Length: {sopData.wordCountTarget} words. Follow this precise flow.</p>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                          {sopData.structure.map((section, idx) => (
                            <AccordionItem key={idx} value={`item-${idx}`} className="border-border/50">
                              <AccordionTrigger className="hover:no-underline hover:bg-card/50 px-4 rounded-lg transition-colors">
                                <div className="flex items-center gap-4 text-left">
                                  <div className="bg-primary/10 text-primary p-2 rounded-md font-mono text-sm font-bold min-w-[80px] text-center border border-primary/20">
                                    ~{section.wordCount}w
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-foreground/90">{section.section}: {section.title}</h4>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 pb-4 pt-2">
                                <div className="bg-background/50 p-4 rounded-lg border border-border/50 mt-2 space-y-4">
                                  <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-primary/50 pl-3">
                                    "{section.guidance}"
                                  </p>
                                  <div>
                                    <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Must Include</h5>
                                    <ul className="space-y-2">
                                      {section.keyPoints.map((point, pIdx) => (
                                        <li key={pIdx} className="text-sm flex items-start gap-2">
                                          <CheckSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                                          <span className="text-foreground/90">{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </GlassCard>
                    </div>

                    <div className="space-y-6">
                      {sopData.sampleOpener && (
                        <GlassCard className="p-6 bg-primary/5 border-primary/20">
                          <h3 className="font-semibold flex items-center gap-2 mb-4 text-primary">
                            <BookOpen className="w-4 h-4" /> Strong Opener Example
                          </h3>
                          <p className="text-sm text-foreground/80 italic leading-relaxed">
                            "{sopData.sampleOpener}"
                          </p>
                        </GlassCard>
                      )}
                      
                      <GlassCard className="p-6">
                        <h3 className="font-semibold flex items-center gap-2 mb-4 text-green-400">
                          <CheckSquare className="w-4 h-4" /> Strategic Tips
                        </h3>
                        <ul className="space-y-3">
                          {sopData.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>

                      <GlassCard className="p-6 bg-red-500/5 border-red-500/20">
                        <h3 className="font-semibold flex items-center gap-2 mb-4 text-red-400">
                          <AlertTriangle className="w-4 h-4" /> Common Pitfalls
                        </h3>
                        <ul className="space-y-3">
                          {sopData.commonMistakes.map((mistake, idx) => (
                            <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                              {mistake}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}