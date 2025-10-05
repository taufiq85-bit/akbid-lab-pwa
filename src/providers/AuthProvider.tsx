// src/providers/AuthProvider.tsx

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AuthContext } from '@/context/AuthContext'
import type { AuthContextType } from '@/context/AuthContext'
import type {
  AuthUser,
  AuthState,
  LoginCredentials,
  RegisterData,
  RoleCode,
  UserProfile,
} from '@/types/auth'
import type { Database } from '@/types/database'

type Tables = Database['public']['Tables']
type SupabaseQueryBuilder = ReturnType<typeof supabase.from>

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // Fetch user profile with roles and permissions
  const fetchUserProfile = useCallback(
    async (userId: string): Promise<AuthUser | null> => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('users_profile')
          .select('*')
          .eq('id', userId)
          .single()

        if (profileError || !profile) throw profileError

        const typedProfile = profile as Tables['users_profile']['Row']

        const { data: userRolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select(
            `
          role:roles (
            id,
            role_name,
            role_code,
            description,
            is_active,
            created_at
          )
        `
          )
          .eq('user_id', userId)
          .eq('is_active', true)

        if (rolesError) throw rolesError

        const userRoles = userRolesData as unknown as Array<{
          role: Tables['roles']['Row'] | null
        }> | null

        const roles =
          userRoles
            ?.map((ur) => ur.role)
            .filter((r): r is Tables['roles']['Row'] => r !== null) || []
        const roleIds = roles.map((r) => r.id)

        let permissions: string[] = []
        if (roleIds.length > 0) {
          const { data: rolePermissionsData, error: permError } = await supabase
            .from('role_permissions')
            .select(
              `
            permission:permissions (
              permission_code
            )
          `
            )
            .in('role_id', roleIds)

          if (!permError && rolePermissionsData) {
            const rolePermissions = rolePermissionsData as unknown as Array<{
              permission: { permission_code: string } | null
            }>

            permissions = rolePermissions
              .map((rp) => rp.permission?.permission_code)
              .filter((p): p is string => p !== undefined && p !== null)
          }
        }

        const authUser: AuthUser = {
          id: userId,
          email: typedProfile.email,
          profile: typedProfile,
          roles,
          permissions: [...new Set(permissions)],
        }

        return authUser
      } catch (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
    },
    []
  )

  // Initialize auth state
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user && mounted) {
          const authUser = await fetchUserProfile(session.user.id)

          if (authUser) {
            setState({
              user: authUser,
              isLoading: false,
              isAuthenticated: true,
              error: null,
            })
          } else {
            setState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              error: 'Failed to load user profile',
            })
          }
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
          })
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        if (mounted) {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: 'Authentication error',
          })
        }
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        const authUser = await fetchUserProfile(session.user.id)
        if (authUser) {
          setState({
            user: authUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          })
        }
      } else if (event === 'SIGNED_OUT' && mounted) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        })
        navigate('/login')
      } else if (event === 'TOKEN_REFRESHED' && session?.user && mounted) {
        const authUser = await fetchUserProfile(session.user.id)
        if (authUser) {
          setState((prev) => ({ ...prev, user: authUser }))
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [navigate, fetchUserProfile])

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        })

        if (error) throw error
        if (!data.user) throw new Error('Login failed')

        await (
          supabase.from('users_profile') as unknown as SupabaseQueryBuilder
        )
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id)

        const authUser = await fetchUserProfile(data.user.id)

        if (authUser) {
          setState({
            user: authUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          })

          const primaryRole = authUser.roles?.[0]?.role_code as
            | RoleCode
            | undefined
          switch (primaryRole) {
            case 'ADMIN':
              navigate('/admin')
              break
            case 'DOSEN':
              navigate('/dosen')
              break
            case 'MAHASISWA':
              navigate('/mahasiswa')
              break
            case 'LABORAN':
              navigate('/laboran')
              break
            default:
              navigate('/dashboard')
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed'
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
        throw error
      }
    },
    [navigate, fetchUserProfile]
  )

  // Register function
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          })

        if (signUpError) throw signUpError
        if (!authData.user) throw new Error('Registration failed')

        const { error: profileError } = await (
          supabase.from('users_profile') as unknown as SupabaseQueryBuilder
        ).insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.fullName,
          nim_nip: data.nimNip,
        })

        if (profileError) throw profileError

        const { data: roleData, error: roleError } = await supabase
          .from('roles')
          .select('id')
          .eq('role_code', data.role)
          .single()

        if (roleError) throw roleError

        const typedRoleData = roleData as { id: string } | null
        if (!typedRoleData) throw new Error('Role not found')

        const { error: assignError } = await (
          supabase.from('user_roles') as unknown as SupabaseQueryBuilder
        ).insert({
          user_id: authData.user.id,
          role_id: typedRoleData.id,
        })

        if (assignError) throw assignError

        setState((prev) => ({ ...prev, isLoading: false, error: null }))
        navigate('/login')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Registration failed'
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
        throw error
      }
    },
    [navigate]
  )

  // Logout function
  const logout = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }))
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })
      navigate('/login')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Logout failed'
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
    }
  }, [navigate])

  // Reset password function
  const resetPassword = useCallback(async (email: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setState((prev) => ({ ...prev, isLoading: false }))
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Reset password failed'
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
      throw error
    }
  }, [])

  // Update profile function
  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!state.user) throw new Error('No user logged in')

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }))

        const { error } = await (
          supabase.from('users_profile') as unknown as SupabaseQueryBuilder
        )
          .update({ ...data, updated_at: new Date().toISOString() })
          .eq('id', state.user.id)

        if (error) throw error

        const authUser = await fetchUserProfile(state.user.id)

        if (authUser) {
          setState((prev) => ({ ...prev, user: authUser, isLoading: false }))
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Update profile failed'
        setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }))
        throw error
      }
    },
    [state.user, fetchUserProfile]
  )

  // Check permission function
  const checkPermission = useCallback(
    (permission: string): boolean => {
      if (!state.user) return false
      return state.user.permissions?.includes(permission) || false
    },
    [state.user]
  )

  // Check role function
  const hasRole = useCallback(
    (role: RoleCode): boolean => {
      if (!state.user) return false
      return state.user.roles?.some((r) => r.role_code === role) || false
    },
    [state.user]
  )

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    checkPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
