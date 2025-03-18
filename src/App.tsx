
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Call from "./pages/Call";
import NotFound from "./pages/NotFound";
import AllInterpreters from "./pages/AllInterpreters";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import LiveSupport from "./pages/LiveSupport";
import { CallProvider } from "./contexts/CallContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CallProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/call" element={<Call />} />
            <Route path="/join/:roomId" element={<Call />} />
            <Route path="/live-support" element={<LiveSupport />} />
            <Route path="/interpreters" element={<AllInterpreters />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CallProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
