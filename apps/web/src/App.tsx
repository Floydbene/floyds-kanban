import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider, ProtectedRoute } from '@/providers/auth-provider'
import { AppLayout } from '@/components/layout/app-layout'
import { LoginPage } from '@/pages/login'
import { RegisterPage } from '@/pages/register'
import { ForgotPasswordPage } from '@/pages/forgot-password'
import { ResetPasswordPage } from '@/pages/reset-password'
import { ProjectsPage } from '@/pages/projects'
import { BoardPage } from '@/pages/board'
import { DashboardPage } from '@/pages/dashboard'
import { SettingsPage } from '@/pages/settings'
import { CheatsheetPage } from '@/pages/cheatsheet'
import { AllTasksPage } from '@/pages/all-tasks'

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider delayDuration={300}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/projects" replace />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="projects/:slug/board" element={<BoardPage />} />
                  <Route path="projects/:slug/list" element={<BoardPage />} />
                  <Route path="projects/:slug/calendar" element={<BoardPage />} />
                  <Route path="all-tasks" element={<AllTasksPage />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="cheatsheet" element={<CheatsheetPage />} />
                </Route>
              </Routes>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: 'bg-card border-border text-foreground',
                }}
              />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  )
}
