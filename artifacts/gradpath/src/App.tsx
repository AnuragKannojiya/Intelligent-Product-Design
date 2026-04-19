import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import Profiles from "@/pages/profiles";
import CareerNavigator from "@/pages/career";
import RoiEngine from "@/pages/roi";
import LoanEngine from "@/pages/loan";
import JourneyCopilot from "@/pages/journey";
import Scholarships from "@/pages/scholarships";
import VisaGuide from "@/pages/visa";
import Gamification from "@/pages/gamification";
import AICopilotWidget from "@/components/AICopilotWidget";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profiles" component={Profiles} />
      <Route path="/career" component={CareerNavigator} />
      <Route path="/roi" component={RoiEngine} />
      <Route path="/loan" component={LoanEngine} />
      <Route path="/journey" component={JourneyCopilot} />
      <Route path="/scholarships" component={Scholarships} />
      <Route path="/visa" component={VisaGuide} />
      <Route path="/gamification" component={Gamification} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <AICopilotWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
