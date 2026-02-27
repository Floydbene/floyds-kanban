import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Navigate, useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase'
import { api } from '@/lib/api-client'
import type { User, ApiResponse } from '@taskflow/shared'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  // Skip onAuthStateChange-triggered fetch when login/register already handles it
  const skipNextAuthChange = useRef(false)

  const fetchAppUser = useCallback(async () => {
    const res = await api.get<ApiResponse<User>>('/api/auth/me')
    setUser(res.data)
  }, [])

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchAppUser()
          .catch(() => setUser(null))
          .finally(() => setIsLoading(false))
      } else {
        setIsLoading(false)
      }
    })

    // Subscribe to auth state changes (handles token refresh, external signout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (skipNextAuthChange.current) {
          skipNextAuthChange.current = false
          return
        }
        if (session) {
          fetchAppUser().catch(() => setUser(null))
        } else {
          setUser(null)
        }
      },
    )

    return () => subscription.unsubscribe()
  }, [fetchAppUser])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    skipNextAuthChange.current = true
    await fetchAppUser()
    navigate('/projects', { replace: true })
  }, [fetchAppUser, navigate])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (error) throw new Error(error.message)
    if (!data.session) {
      throw new Error('Check your email for a confirmation link before signing in.')
    }
    skipNextAuthChange.current = true
    await fetchAppUser()
    navigate('/projects', { replace: true })
  }, [fetchAppUser, navigate])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/login', { replace: true })
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
