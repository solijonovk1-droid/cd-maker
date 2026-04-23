import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const userPlan = ref('Free')

  // Initialize — check existing session on app load
  const init = async () => {
    loading.value = true
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false

    // Listen for auth state changes (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  // LOGIN with email + password
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    return data.user
  }

  // REGISTER — no email confirmation needed (disabled in Supabase dashboard)
  const register = async (fullName, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
    user.value = data.user
    return data.user
  }

  // LOGOUT
  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const updatePlan = (newPlan) => {
    userPlan.value = newPlan
  }

  return { user, loading, userPlan, init, login, register, logout, updatePlan }
})
