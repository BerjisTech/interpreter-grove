
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Call from "./pages/Call";
import NotFound from "./pages/NotFound";
import AllInterpreters from "./pages/AllInterpreters";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Dashboard from "./pages/Dashboard";
import LiveSupport from "./pages/LiveSupport";
import { CallProvider } from "./contexts/CallContext";
import MockUserPanel from "@/components/MockUserPanel";
import InterpreterNotification from "@/components/notifications/InterpreterNotification";

const queryClient = new QueryClient();

function App() {
  // Set up console logging for debugging pending call data
  useEffect(() => {
    const checkPendingCall = () => {
      const pendingCall = localStorage.getItem('pendingCall');
      if (pendingCall) {
        console.log("Pending call in localStorage:", JSON.parse(pendingCall));
      }
    };
    
    // Check on initial load
    checkPendingCall();
    
    // And set up interval to check regularly
    const interval = setInterval(checkPendingCall, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CallProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/call" element={<Call />} />
                <Route path="/join/:roomId" element={<Call />} />
                <Route path="/live-support" element={<LiveSupport />} />
                <Route path="/interpreters" element={<AllInterpreters />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/dashboard/*" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MockUserPanel />
              <InterpreterNotification />
            </Router>
          </CallProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

import { useEffect } from 'react';

export default App;
