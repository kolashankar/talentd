import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/home";
import Admin from "./pages/admin";
import PortfolioPage from "./pages/portfolio";
import PortfolioView from "./pages/portfolio-view";
import ResumeReviewPage from "./pages/resume-review";
import Jobs from "./pages/jobs";
import Internships from "./pages/internships";
import Roadmaps from "./pages/roadmaps";
import DSACorner from "./pages/dsa";
import Articles from "./pages/articles";
import NotFound from "./pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy } from 'react';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/internships" component={Internships} />
      <Route path="/roadmaps" component={Roadmaps} />
      <Route path="/dsa" component={DSACorner} />
      <Route path="/articles" component={Articles} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/portfolio/:id" component={PortfolioView} />
      <Route path="/resume-review" component={ResumeReviewPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/articles/:id" component={lazy(() => import('./pages/article-detail'))} />
      <Route path="/roadmaps/:id" component={lazy(() => import('./pages/roadmap-detail'))} />
      <Route path="/dsa/:id" component={lazy(() => import('./pages/dsa-problem-detail'))} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;