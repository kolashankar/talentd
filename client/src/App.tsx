import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/home";
import Admin from "./pages/admin";
import Register from "./pages/register";
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
import ArticleDetail from "./pages/article-detail";
import RoadmapDetail from "./pages/roadmap-detail";
import DsaProblemDetail from "./pages/dsa-problem-detail";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import Support from "./pages/support";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Register} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/internships" component={Internships} />
      <Route path="/roadmaps" component={Roadmaps} />
      <Route path="/dsa" component={DSACorner} />
      <Route path="/articles" component={Articles} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/portfolio/:id" component={PortfolioView} />
      <Route path="/resume-review" component={ResumeReviewPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/articles/:id" component={ArticleDetail} />
      <Route path="/roadmaps/:id" component={RoadmapDetail} />
      <Route path="/dsa/:id" component={DsaProblemDetail} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/support" component={Support} />
      <Route path="/tax-calculator" component={() => import("./pages/tax-calculator").then(m => m.default)} />
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