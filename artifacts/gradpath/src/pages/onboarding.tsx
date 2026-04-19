import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hexagon, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useCreateProfile } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  degree: z.string().min(2, "Degree is required"),
  branch: z.string().optional(),
  cgpa: z.coerce.number().min(0).max(10),
  internships: z.coerce.number().min(0).default(0),
  skills: z.string().transform(val => val.split(",").map(s => s.trim()).filter(Boolean)),
  targetCountry: z.string().min(2, "Target country required"),
  preferredCourse: z.string().min(2, "Preferred course required"),
  budgetRangeMin: z.coerce.number().min(0),
  budgetRangeMax: z.coerce.number().min(0),
  familyIncome: z.string().min(1, "Family income required"),
  hasCoApplicant: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const createProfile = useCreateProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "", email: "", degree: "", branch: "", cgpa: 0, internships: 0, skills: [],
      targetCountry: "", preferredCourse: "", budgetRangeMin: 0, budgetRangeMax: 0,
      familyIncome: "", hasCoApplicant: false,
    },
  });

  const onSubmit = (data: FormValues) => {
    createProfile.mutate({ data }, {
      onSuccess: () => {
        toast.success("Profile created successfully!");
        setLocation("/dashboard");
      },
      onError: () => {
        toast.error("Failed to create profile. Please try again.");
      }
    });
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["name", "email", "degree", "branch", "cgpa", "internships"]);
    } else if (step === 2) {
      isValid = await form.trigger(["targetCountry", "preferredCourse", "budgetRangeMin", "budgetRangeMax"]);
    }
    if (isValid) setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10 pointer-events-none" />
      
      <div className="w-full max-w-2xl mb-8 flex flex-col items-center">
        <Hexagon className="h-10 w-10 text-primary mb-4" />
        <h1 className="text-3xl font-bold tracking-tight glow-text">Student Intelligence Profile</h1>
        <p className="text-muted-foreground mt-2 text-center">Complete your academic and financial profile to unlock AI-driven insights.</p>
        
        <div className="flex items-center w-full max-w-md mt-8 gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex-1 flex items-center gap-2">
              <div className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-white/10'}`} />
            </div>
          ))}
        </div>
      </div>

      <GlassCard className="w-full max-w-2xl p-8 border-primary/20">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Step 1: Academic Profile</h2>
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="degree" render={({ field }) => (
                    <FormItem><FormLabel>Current Degree</FormLabel><FormControl><Input placeholder="e.g. B.Tech" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="branch" render={({ field }) => (
                    <FormItem><FormLabel>Branch/Specialization</FormLabel><FormControl><Input placeholder="e.g. Computer Science" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="cgpa" render={({ field }) => (
                    <FormItem><FormLabel>CGPA (out of 10)</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="internships" render={({ field }) => (
                    <FormItem><FormLabel>Internships Count</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="skills" render={({ field }) => (
                    <FormItem className="col-span-2"><FormLabel>Skills (comma separated)</FormLabel><FormControl><Input placeholder="React, Python, Machine Learning" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Step 2: Aspirations</h2>
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control} name="targetCountry" render={({ field }) => (
                    <FormItem><FormLabel>Target Country</FormLabel><FormControl><Input placeholder="e.g. USA, UK, Germany" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="preferredCourse" render={({ field }) => (
                    <FormItem><FormLabel>Preferred Master's Course</FormLabel><FormControl><Input placeholder="e.g. MS in Data Science" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="budgetRangeMin" render={({ field }) => (
                    <FormItem><FormLabel>Min Budget (in Lakhs INR)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="budgetRangeMax" render={({ field }) => (
                    <FormItem><FormLabel>Max Budget (in Lakhs INR)</FormLabel><FormControl><Input type="number" {...field} className="bg-background/50" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Step 3: Financial Details</h2>
                <div className="grid grid-cols-1 gap-6">
                  <FormField control={form.control} name="familyIncome" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Income Band</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50"><SelectValue placeholder="Select income band" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="< 5 LPA">Under 5 Lakhs</SelectItem>
                          <SelectItem value="5 - 10 LPA">5 - 10 Lakhs</SelectItem>
                          <SelectItem value="10 - 20 LPA">10 - 20 Lakhs</SelectItem>
                          <SelectItem value="> 20 LPA">Above 20 Lakhs</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="hasCoApplicant" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-background/50">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Will you have a financial co-applicant?</FormLabel>
                        <p className="text-sm text-muted-foreground">Having a co-applicant (parent/guardian) improves loan readiness.</p>
                      </div>
                    </FormItem>
                  )} />
                </div>
              </motion.div>
            )}

            <div className="flex justify-between pt-6 border-t border-border">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              ) : <div></div>}
              
              {step < 3 ? (
                <Button type="button" onClick={nextStep} className="gap-2">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={createProfile.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  {createProfile.isPending ? "Processing..." : "Generate Intelligence Profile"}
                </Button>
              )}
            </div>

          </form>
        </Form>
      </GlassCard>
    </div>
  );
}
