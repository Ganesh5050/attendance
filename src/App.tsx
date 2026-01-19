import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CourtSelection from "./pages/CourtSelection";
import Passcode from "./pages/Passcode";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Court selection for trainers (before passcode) */}
          <Route path="/court-selection/:type" element={<CourtSelection />} />
          {/* Passcode with court context */}
          <Route path="/passcode/:type/:courtId" element={<Passcode />} />
          {/* Attendance dashboard with court context */}
          <Route path="/attendance/:courtId" element={<AttendanceDashboard />} />
          {/* Admin: passcode first, then court selection */}
          <Route path="/passcode/admin" element={<Passcode />} />
          <Route path="/admin" element={<CourtSelection />} />
          <Route path="/admin/:courtId" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
