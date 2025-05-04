
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Campaign from "./pages/Campaign";
import CreateCampaign from "./pages/CreateCampaign";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// PayPal Client ID should be retrieved from an environment variable in production
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || "test";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PayPalScriptProvider options={{ 
        clientId: paypalClientId,
        currency: "USD",
        components: "buttons",
      }}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/campaign/:id" element={<Campaign />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </PayPalScriptProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
