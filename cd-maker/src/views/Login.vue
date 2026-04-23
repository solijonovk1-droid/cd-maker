<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import AuthLayout from '../components/AuthLayout.vue'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  errorMsg.value = ''
  isLoading.value = true
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    errorMsg.value = err.message || 'Login failed. Please check your credentials.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthLayout mode="login">
    <form @submit.prevent="handleLogin" class="space-y-6">
      
      <!-- Email -->
      <div class="form-control">
        <label class="label p-0 mb-2">
          <span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">Official Email</span>
        </label>
        <input
          v-model="email"
          type="email"
          required
          placeholder="you@example.com"
          class="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-indigo-600 focus:bg-white transition-all duration-300 font-bold text-sm rounded-2xl h-12"
        />
      </div>

      <!-- Password -->
      <div class="form-control">
        <div class="flex justify-between items-center mb-2">
          <label class="label p-0">
            <span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">Password</span>
          </label>
          <a href="#" class="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">Forgot Access?</a>
        </div>
        <input
          v-model="password"
          type="password"
          required
          placeholder="••••••••"
          class="input input-bordered w-full bg-slate-50 border-slate-200 focus:border-indigo-600 focus:bg-white transition-all duration-300 font-bold text-sm rounded-2xl h-12"
        />
      </div>

      <!-- Alert -->
      <div v-if="errorMsg" class="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-3">
        <div class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
        <span class="text-[11px] font-bold uppercase tracking-tight">{{ errorMsg }}</span>
      </div>

      <!-- Submit -->
      <div class="relative group">
        <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <button
          type="submit"
          :disabled="isLoading"
          class="relative w-full py-4 rounded-2xl bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all overflow-hidden"
        >
          <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin text-white/50" />
          <span v-else>Authorize Access</span>
        </button>
      </div>

    </form>
  </AuthLayout>
</template>
