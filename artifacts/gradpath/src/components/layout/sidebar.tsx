import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Compass, TrendingUp, Calculator, Users, LogOut, Hexagon, Route as RouteIcon, GraduationCap, Plane, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/career", label: "Career Navigator", icon: Compass },
  { href: "/roi", label: "ROI Engine", icon: TrendingUp },
  { href: "/loan", label: "Loan Readiness", icon: Calculator },
  { href: "/journey", label: "Journey Copilot", icon: RouteIcon },
  { href: "/scholarships", label: "Scholarships", icon: GraduationCap },
  { href: "/visa", label: "Visa Guide", icon: Plane },
  { href: "/gamification", label: "Achievements", icon: Trophy },
  { href: "/profiles", label: "Student Profiles", icon: Users },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card/40 backdrop-blur-xl text-foreground">
      <div className="p-6 flex items-center gap-3">
        <Hexagon className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold tracking-tight glow-text">GradPath AI</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className="block">
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-3 py-6 h-auto",
                    isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "")} />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-border">
        <Link href="/" className="block">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
            <span>Exit to Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
