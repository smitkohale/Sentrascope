import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  LandingPageSkeleton,
  AuthPageSkeleton,
  DashboardSkeleton,
  AlertsSkeleton,
  ProfileSkeleton,
  UrbanizationLandingSkeleton,
  UrbanizationDashboardSkeleton,
  ContentPageSkeleton,
  SimplePageSkeleton,
} from "@/components/PageSkeletons";

const LandingPage             = lazy(() => import("@/pages/LandingPage").then(m => ({ default: m.LandingPage })));
const AboutPage               = lazy(() => import("@/pages/AboutPage").then(m => ({ default: m.AboutPage })));
const LoginPage               = lazy(() => import("@/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const SignupPage              = lazy(() => import("@/pages/SignupPage").then(m => ({ default: m.SignupPage })));
const Dashboard               = lazy(() => import("@/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const AlertsPage              = lazy(() => import("@/pages/AlertsPage").then(m => ({ default: m.AlertsPage })));
const ProfilePage             = lazy(() => import("@/pages/ProfilePage").then(m => ({ default: m.ProfilePage })));
const UrbanizationPage        = lazy(() => import("@/pages/UrbanizationPage").then(m => ({ default: m.UrbanizationPage })));
const UrbanizationLandingPage = lazy(() => import("@/pages/UrbanizationLandingPage").then(m => ({ default: m.UrbanizationLandingPage })));
const VerifyPage              = lazy(() => import("@/pages/VerifyPage").then(m => ({ default: m.VerifyPage })));
const PrivacyPage             = lazy(() => import("@/pages/PrivacyPage").then(m => ({ default: m.PrivacyPage })));
const EthicsPage              = lazy(() => import("@/pages/EthicsPage").then(m => ({ default: m.EthicsPage })));
const ForgotPasswordPage      = lazy(() => import("@/pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage       = lazy(() => import("@/pages/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));
const NotFound                = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
      retry: 1,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
      throwOnError: false,
    },
    mutations: {
      throwOnError: false,
    },
  },
});

function S({ fallback, children }: { fallback: React.ReactNode; children: React.ReactNode }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <S fallback={<LandingPageSkeleton />}><LandingPage /></S>
      </Route>

      <Route path="/about">
        <S fallback={<ContentPageSkeleton />}><AboutPage /></S>
      </Route>

      <Route path="/login">
        <S fallback={<AuthPageSkeleton />}><LoginPage /></S>
      </Route>

      <Route path="/signup">
        <S fallback={<AuthPageSkeleton />}><SignupPage /></S>
      </Route>

      <Route path="/forgot-password">
        <S fallback={<AuthPageSkeleton />}><ForgotPasswordPage /></S>
      </Route>

      <Route path="/reset-password">
        <S fallback={<AuthPageSkeleton />}><ResetPasswordPage /></S>
      </Route>

      <Route path="/verify">
        <S fallback={<SimplePageSkeleton />}><VerifyPage /></S>
      </Route>

      <Route path="/privacy">
        <S fallback={<ContentPageSkeleton />}><PrivacyPage /></S>
      </Route>

      <Route path="/ethics">
        <S fallback={<ContentPageSkeleton />}><EthicsPage /></S>
      </Route>

      <Route path="/dashboard">
        <S fallback={<DashboardSkeleton />}>
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        </S>
      </Route>

      <Route path="/alerts">
        <S fallback={<AlertsSkeleton />}>
          <ProtectedRoute><AlertsPage /></ProtectedRoute>
        </S>
      </Route>

      <Route path="/profile">
        <S fallback={<ProfileSkeleton />}>
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        </S>
      </Route>

      <Route path="/urbanization">
        <S fallback={<UrbanizationLandingSkeleton />}><UrbanizationLandingPage /></S>
      </Route>

      <Route path="/urbanization/dashboard">
        <S fallback={<UrbanizationDashboardSkeleton />}>
          <ProtectedRoute><UrbanizationPage /></ProtectedRoute>
        </S>
      </Route>

      <Route>
        <S fallback={<SimplePageSkeleton />}><NotFound /></S>
      </Route>
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
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
