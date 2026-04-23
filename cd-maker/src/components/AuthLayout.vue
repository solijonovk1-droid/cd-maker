<script setup>
import { useRouter } from 'vue-router'
import { Sparkles, Zap } from 'lucide-vue-next'

const router = useRouter()
const props = defineProps({ mode: { type: String, default: 'login' } })
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">

    <!-- ===== LEFT: Form Side ===== -->
    <div class="md:w-[45%] w-full flex flex-col items-center justify-center bg-white p-8 md:p-12 relative shadow-2xl z-10 transition-all duration-500 border-r border-slate-100">

      <!-- Back link -->
      <button @click="router.push('/')" class="btn btn-ghost btn-sm absolute top-10 left-10 gap-2 text-slate-400 hover:text-slate-900 transition-all active:scale-95 font-bold text-xs uppercase tracking-widest">
        ← Home
      </button>

      <!-- Card Container -->
      <div class="w-full max-w-sm">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12 group cursor-pointer" @click="router.push('/')">
          <div class="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <Sparkles class="w-6 h-6" />
          </div>
          <span class="font-black text-2xl tracking-tighter text-slate-900">AICV Builder</span>
        </div>

        <!-- Heading -->
        <div class="mb-10">
          <h1 class="text-4xl font-black text-slate-900 mb-3 tracking-tighter leading-tight">
            {{ mode === 'login' ? 'Welcome Back' : 'Create Account' }}
          </h1>
          <p class="text-slate-500 font-medium text-lg leading-snug">The AI-first platform for job winning resumes.</p>
        </div>

        <!-- Slot for form content -->
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
           <slot />
        </div>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-10">
           <div class="h-[1px] bg-slate-100 flex-1"></div>
           <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none pt-0.5">Secure Auth</span>
           <div class="h-[1px] bg-slate-100 flex-1"></div>
        </div>

        <!-- Switch link -->
        <div class="text-center font-bold text-sm">
          <template v-if="mode === 'login'">
            <span class="text-slate-400">Don't have an account?</span>
            <button @click="router.push('/register')" class="text-indigo-600 hover:text-indigo-700 ml-2 border-b-2 border-transparent hover:border-indigo-600 pb-0.5 transition-all">Sign up now</button>
          </template>
          <template v-else>
            <span class="text-slate-400">Already have an account?</span>
            <button @click="router.push('/login')" class="text-indigo-600 hover:text-indigo-700 ml-2 border-b-2 border-transparent hover:border-indigo-600 pb-0.5 transition-all">Login instead</button>
          </template>
        </div>
      </div>
    </div>

    <!-- ===== RIGHT: Visual Side ===== -->
    <div class="hidden md:flex flex-1 relative overflow-hidden bg-slate-900 p-20 flex-col justify-center">
      
      <!-- Gradient mesh blobs -->
      <div class="absolute -top-[10%] -right-[10%] w-[80%] h-[80%] bg-indigo-500/20 rounded-full blur-[140px] opacity-30 animate-pulse"></div>
      <div class="absolute -bottom-[10%] -left-[10%] w-[70%] h-[70%] bg-violet-600/20 rounded-full blur-[140px] opacity-30 animate-pulse delay-700"></div>

      <!-- Content Container -->
      <div class="relative z-10 max-w-lg">
        <!-- Floating badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-bounce delay-1000">
          <Zap class="w-4 h-4 text-indigo-400 fill-indigo-400" />
          <span class="text-[10px] font-black uppercase tracking-widest text-indigo-200">ATS Optimized Result</span>
        </div>

        <h2 class="text-5xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
          Tailor your career <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 animate-gradient-x">specifically for AI.</span>
        </h2>

        <p class="text-lg text-slate-400 font-medium mb-12 leading-relaxed">
          The best candidates aren't necessarily the ones with more experience, but the ones who match the job description perfectly.
        </p>

        <!-- Mockup Visual -->
        <div class="relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/50 to-violet-500/50 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div class="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
             <div class="flex items-center justify-between mb-10">
                <div class="flex gap-2">
                   <div class="w-3 h-3 rounded-full bg-rose-500/30"></div>
                   <div class="w-3 h-3 rounded-full bg-amber-500/30"></div>
                   <div class="w-3 h-3 rounded-full bg-emerald-500/30"></div>
                </div>
                <div class="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                   AI Calibration 92%
                </div>
             </div>
             
             <div class="space-y-6">
                <div class="h-5 bg-white/10 rounded-lg w-[70%]"></div>
                <div class="h-2 bg-white/5 rounded-lg w-[40%]"></div>
                <div class="h-[1px] bg-white/5 w-full my-6"></div>
                <div class="space-y-3">
                   <div class="h-2 bg-indigo-400/20 rounded-lg w-full"></div>
                   <div class="h-2 bg-white/5 rounded-lg w-[90%]"></div>
                   <div class="h-2 bg-white/5 rounded-lg w-[85%]"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
@keyframes gradient-x {
  0%, 100% { background-size: 200% 200%; background-position: left center; }
  50% { background-size: 200% 200%; background-position: right center; }
}
.animate-gradient-x {
  animation: gradient-x 8s ease infinite;
}
</style>
