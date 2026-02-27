import { Navigate } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/register-form'
import { useAuth } from '@/providers/auth-provider'

export function RegisterPage() {
  const { user } = useAuth()

  if (user) return <Navigate to="/projects" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <span className="text-lg font-bold text-primary-foreground">T</span>
          </div>
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Get started with Taskflow</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
