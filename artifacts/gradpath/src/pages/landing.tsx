import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Hexagon, ArrowRight, ShieldCheck, Zap, BarChart3, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Hexagon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight glow-text">GradPath AI</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">For Lenders</Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">For Universities</Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium">
            <Zap className="h-4 w-4" />
            Outcome-based Education Financing
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-tight">
            Where Academic Profile Meets <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary glow-text">Financial Intelligence</span>.
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground max-w-xl">
            The mission-control for student financing. Advanced AI layers assessing career viability, placement risk, and loan readiness in real-time.
          </p>

          <div className="flex items-center gap-4 pt-4">
            <Link href="/onboarding" className="block">
              <Button size="lg" className="h-14 px-8 text-lg gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                Start Your Assessment <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard" className="block">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5">
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 flex items-center gap-8 text-sm text-muted-foreground border-t border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Trusted by Top NBFCs</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>10,000+ Students Assessed</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-2xl blur-3xl -z-10" />
          <div className="border border-white/10 p-2 rounded-2xl bg-card/40 backdrop-blur-sm">
            <img 
              src="/hero.png" 
              alt="Student with AI holograms" 
              className="rounded-xl w-full h-auto object-cover border border-white/5"
            />
          </div>
          
          {/* Floating UI Elements */}
          <div className="absolute -bottom-6 -left-6 bg-card/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Placement Prob.</div>
              <div className="text-2xl font-bold text-foreground">94.2%</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
