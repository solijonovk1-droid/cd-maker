import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isDummy = !supabaseUrl || supabaseUrl.includes('dummyproject') || !supabaseKey || supabaseKey.includes('dummy')

const getMockUser = () => JSON.parse(localStorage.getItem('dummyMockUser'))
const setMockUser = (user) => {
    if (user) localStorage.setItem('dummyMockUser', JSON.stringify(user))
    else localStorage.removeItem('dummyMockUser')
}

export const supabase = isDummy ? {
    auth: {
        getSession: async () => {
            const user = getMockUser()
            return { data: { session: user ? { user } : null }, error: null }
        },
        onAuthStateChange: (cb) => { },
        signInWithPassword: async ({ email }) => {
            const user = { id: 'dummy-123', email, user_metadata: { full_name: 'Demo User' } }
            setMockUser(user)
            return { data: { user, session: { user } }, error: null }
        },
        signUp: async ({ email, options }) => {
            const user = { id: 'dummy-123', email, user_metadata: { full_name: options?.data?.full_name || 'Demo User' } }
            setMockUser(user)
            return { data: { user, session: { user } }, error: null }
        },
        signOut: async () => {
            setMockUser(null)
            return { error: null }
        },
        updateUser: async (attributes) => {
            let user = getMockUser() || {}
            user = { ...user, ...attributes, user_metadata: { ...user.user_metadata, ...(attributes.data || {}) } }
            setMockUser(user)
            return { data: { user }, error: null }
        }
    }
} : createClient(supabaseUrl, supabaseKey)
