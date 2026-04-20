import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
<<<<<<< HEAD

=======
>>>>>>> 0b082d7c972923bd2155ae2885867de5f1c08364
  const userPlan = ref('Free')

  // Initialize — check existing session on app load
  const init = async () => {
    loading.value = true
<<<<<<< HEAD
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null

      // Listen for auth state changes (login/logout)
      supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
      })
    } catch (err) {
      console.warn('Supabase auth init error:', err)
      user.value = null
    } finally {
      loading.value = false
    }
=======
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false

    // Listen for auth state changes (login/logout)
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
>>>>>>> 0b082d7c972923bd2155ae2885867de5f1c08364
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

<<<<<<< HEAD
  const updateProfile = async (fullName, email) => {
    const { data, error } = await supabase.auth.updateUser({
      email: email,
      data: { full_name: fullName }
    })
    if (error) throw error
    user.value = data.user
    return data.user
  }

  return { user, loading, userPlan, init, login, register, logout, updatePlan, updateProfile }
=======
  return { user, loading, userPlan, init, login, register, logout, updatePlan }
>>>>>>> 0b082d7c972923bd2155ae2885867de5f1c08364
})
