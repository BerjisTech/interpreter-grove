
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
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
      console.log("Checking for pending call in localStorage:", pendingCall);
      
      if (pendingCall) {
        console.log("Pending call found in localStorage:", JSON.parse(pendingCall));
        
        try {
          // Parse the call data
          const callData = JSON.parse(pendingCall);
          
          // Add timestamp if missing
          if (!callData.timestamp) {
            callData.timestamp = Date.now();
            localStorage.setItem('pendingCall', JSON.stringify(callData));
          }
          
          // Only broadcast if the call is recent (within the last 5 minutes)
          const now = Date.now();
          const callTime = callData.timestamp || 0;
          const fiveMinutesInMs = 5 * 60 * 1000;
          
          if (now - callTime < fiveMinutesInMs) {
            console.log("Broadcasting recent incoming call:", callData);
            
            // Create a custom event to notify interpreter
            const callEvent = new CustomEvent('incomingCall', { 
              detail: callData,
              bubbles: true 
            });
            
            // Dispatch the event globally
            window.dispatchEvent(callEvent);
            
            // Also broadcast via storage event for cross-tab notification
            const tempStorage = { ...callData, lastBroadcast: now };
            localStorage.setItem('pendingCallBroadcast', JSON.stringify(tempStorage));
            localStorage.removeItem('pendingCallBroadcast');
          } else {
            console.log("Found expired call, removing from storage");
            localStorage.removeItem('pendingCall');
          }
        } catch (error) {
          console.error("Error processing pending call:", error);
          localStorage.removeItem('pendingCall');
        }
      }
    };
    
    // Check on initial load with a small delay to ensure components are mounted
    setTimeout(checkPendingCall, 1000);
    
    // And set up interval to check regularly
    const interval = setInterval(checkPendingCall, 3000);
    
    // Set up listener for storage events (for cross-tab functionality)
    const handleStorageChange = (event) => {
      if (event.key === 'pendingCall' && event.newValue) {
        console.log("Storage event detected for pendingCall:", event.newValue);
        checkPendingCall();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen to call creation events from CallContext
    const handleCallCreated = (event) => {
      console.log("Call created event detected:", event.detail);
      if (event.detail && event.detail.roomId) {
        // Store call info for interpreter notification
        const callInfo = {
          roomId: event.detail.roomId,
          callerId: event.detail.callerId || 'unknown',
          callerName: event.detail.callerName || 'Client',
          timestamp: Date.now(),
          callType: event.detail.callType || 'video'
        };
        
        console.log("Storing new call in localStorage:", callInfo);
        localStorage.setItem('pendingCall', JSON.stringify(callInfo));
        
        // Immediately check for pending calls to trigger notification
        checkPendingCall();
      }
    };
    
    window.addEventListener('callCreated', handleCallCreated);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('callCreated', handleCallCreated);
    };
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

export default App;
