import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { SecondaryNavbar } from "@/components/secondary-navbar";
import { Footer } from "@/components/footer";
import { lazy, Suspense } from "react";
import Home from "./pages/home";
import Admin from "./pages/admin";
import AdminTemplates from "./pages/admin-templates";
import Register from "./pages/register";
import PortfolioPage from "./pages/portfolio";
import PortfolioView from "./pages/portfolio-view";
import ResumeReviewPage from "./pages/resume-review";
import Jobs from "./pages/jobs";
import Internships from "./pages/internships";
import Roadmaps from "./pages/roadmaps";
import DSACorner from "./pages/dsa";
import Articles from "./pages/articles";
import Scholarships from "./pages/scholarships";
import NotFound from "./pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import ArticleDetail from "./pages/article-detail";
import RoadmapDetail from "./pages/roadmap-detail";
import DsaProblemDetail from "./pages/dsa-problem-detail";
import PrivacyPolicy from "./pages/privacy-policy";
import TermsOfService from "./pages/terms-of-service";
import Support from "./pages/support";
import AboutUs from "./pages/about";
import ContactUs from "./pages/contact";
import JobDetail from "./pages/job-detail";
import InternshipDetail from "./pages/internship-detail";
import AdminDSA from "./pages/admin-dsa";
import DsaDashboard from "./pages/dsa-dashboard";
import DsaQuestions from "./pages/dsa-questions";
import DsaTopics from "./pages/dsa-topics";
import DsaCompanies from "./pages/dsa-companies";
import DsaSheets from "./pages/dsa-sheets";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/dsa" component={AdminDSA} />
      <Route path="/admin/jobs" component={() => <Admin initialTab="jobs" />} />
      <Route path="/admin/internships" component={() => <Admin initialTab="internships" />} />
      <Route path="/admin/scholarships" component={() => <Admin initialTab="scholarships" />} />
      <Route path="/admin/roadmaps" component={() => <Admin initialTab="roadmaps" />} />
      <Route path="/admin/articles" component={() => <Admin initialTab="articles" />} />
      <Route path="/register" component={Register} />
      <Route path="/jobs" component={Jobs} />
      <Route path="/jobs/:id" component={JobDetail} />
      <Route path="/internships" component={Internships} />
      <Route path="/internships/:id" component={InternshipDetail} />
      <Route path="/roadmaps" component={Roadmaps} />
      <Route path="/dsa" component={DSACorner} />
      <Route path="/dsa-corner" component={DsaDashboard} />
      <Route path="/dsa-corner/questions" component={DsaQuestions} />
      <Route path="/dsa-corner/questions/:id" component={DsaProblemDetail} />
      <Route path="/dsa-corner/topics" component={DsaTopics} />
      <Route path="/dsa-corner/companies" component={DsaCompanies} />
      <Route path="/dsa-corner/sheets" component={DsaSheets} />
      <Route path="/articles" component={Articles} />
      <Route path="/scholarships" component={Scholarships} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/portfolio/:id" component={PortfolioView} />
      <Route path="/resume-review" component={ResumeReviewPage} />
      <Route path="/admin/templates" component={AdminTemplates} />
      <Route path="/articles/:id" component={ArticleDetail} />
      <Route path="/roadmaps/:id" component={RoadmapDetail} />
      <Route path="/dsa/:id" component={DsaProblemDetail} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/support" component={Support} />
      <Route path="/about" component={AboutUs} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/tax-calculator" component={() => {
        const TaxCalculator = lazy(() => import("./pages/tax-calculator"));
        return <Suspense fallback={<div>Loading...</div>}><TaxCalculator /></Suspense>;
      }} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <SecondaryNavbar />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;