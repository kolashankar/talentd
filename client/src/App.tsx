import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/shared/components/layout/navigation/header/main/content/index";
import { SecondaryNavbar } from "@/shared/components/layout/navigation/header/main/content/secondary";
import { Footer } from "@/shared/components/layout/navigation/footer/main/content/index";
import { lazy, Suspense } from "react";
import Home from "@/features/public/views/home/main/index";
import AdminTemplates from "@/features/admin/templates/management/index";
import Register from "@/features/public/views/auth/register/index";
import PortfolioPage from "@/features/portfolio/views/builder/main/index";
import PortfolioView from "@/features/portfolio/views/viewer/public/index";
import ResumeReviewPage from "@/features/resume/analysis/index";
import Jobs from "@/features/jobs/views/listing/main/index";
import Internships from "@/features/internships/views/listing/main/index";
import Roadmaps from "@/features/roadmaps/views/listing/main/index";
import DSACorner from "@/features/dsa/views/dashboard/main/index";
import Articles from "@/features/articles/views/listing/main/index";
import Scholarships from "@/features/scholarships/views/listing/main/index";
import NotFound from "@/features/public/views/error/notfound/index";
import { TooltipProvider } from "@/components/ui/tooltip";
import ArticleDetail from "@/features/articles/views/detail/main/index";
import RoadmapDetail from "@/features/roadmaps/views/detail/main/index";
import DsaProblemDetail from "@/features/dsa/views/problem/detail/index";
import PrivacyPolicy from "@/features/legal/views/privacy/policy/index";
import TermsOfService from "@/features/legal/views/terms/service/index";
import Support from "@/features/support/help/center/index";
import AboutUs from "@/features/public/views/about/main/index";
import ContactUs from "@/features/public/views/contact/main/index";
import JobDetail from "@/features/jobs/views/detail/main/index";
import InternshipDetail from "@/features/internships/views/detail/main/index";
import DsaDashboard from "@/features/dsa/views/dashboard/main/dashboard";
import DsaQuestions from "@/features/dsa/views/questions/list/index";
import DsaTopics from "@/features/dsa/views/topics/list/index";
import DsaCompanies from "@/features/dsa/views/companies/list/index";
import DsaSheets from "@/features/dsa/views/sheets/list/index";
import TemplateLiveView from "@/features/portfolio/views/template/live/index";
import DsaTopicDetail from "@/features/dsa/views/topics/detail/index";
import DsaCompanyDetail from "@/features/dsa/views/companies/detail/index";
import DsaSheetDetail from "@/features/dsa/views/sheets/detail/index";
import ScholarshipDetail from "@/features/scholarships/views/detail/main/index";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />\
      <Route path="/admin/internships" component={() => <Admin initialTab="internships" />} />
      <Route path="/admin/scholarships" component={() => <Admin initialTab="scholarships" />} />
      <Route path="/admin/roadmaps" component={() => <Admin initialTab="roadmaps" />} />
      <Route path="/admin/articles" component={() => <Admin initialTab="articles" />} />
      <Route path="/admin/templates" component={AdminTemplates} />
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
      <Route path="/dsa-corner/topics/:id" component={DsaTopicDetail} />
      <Route path="/dsa-corner/companies" component={DsaCompanies} />
      <Route path="/dsa-corner/companies/:id" component={DsaCompanyDetail} />
      <Route path="/dsa-corner/sheets" component={DsaSheets} />
      <Route path="/dsa-corner/sheets/:id" component={DsaSheetDetail} />
      <Route path="/articles" component={Articles} />
      <Route path="/scholarships" component={Scholarships} />
      <Route path="/scholarships/:id" component={ScholarshipDetail} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/portfolio/template/:id" component={TemplateLiveView} />
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
        const TaxCalculator = lazy(() => import("@/features/tools/calculator/tax/index"));
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
