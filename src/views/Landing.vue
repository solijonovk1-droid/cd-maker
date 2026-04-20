<script setup>
import { useRouter } from 'vue-router'
import { Sparkles, FileText, CheckCircle2, ArrowRight, User, MousePointer2, Zap, BarChart3, Users, Quote } from 'lucide-vue-next'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const features = [
  {
    title: 'ATS Optimization',
    description: 'Our AI automatically adjusts your resume phrasing to bypass restrictive Applicant Tracking Systems.',
    icon: Zap,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10'
  },
  {
    title: 'Keyword Matching',
    description: 'Instantly identifies and integrates missing technical and soft skills required by the job post.',
    icon: Search,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10'
  },
  {
    title: 'AI Scoring System',
    description: 'Get a real-time percentage score of how well your CV matches the target job description.',
    icon: BarChart3,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10'
  },
  {
    title: 'Instant Generation',
    description: 'Transform a generic CV into a professional, tailored masterpiece in under 30 seconds.',
    icon: Sparkles,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  }
]

const steps = [
  { number: '01', title: 'Paste Description', desc: 'Copy and paste any job listing URL or text.' },
  { number: '02', title: 'AI Analysis', desc: 'Our AI extracts key requirements and verbs.' },
  { number: '03', title: 'Get Optimized CV', desc: 'Download your tailored, job-winning resume.' }
]

const testimonials = [
  { name: 'Sarah Jenkins', role: 'Software Engineer at Google', text: 'AICV Builder helped me land 3 interviews in a week after months of silence.', avatar: 'SJ' },
  { name: 'David Chen', role: 'Marketing Director', text: 'The keyword matching is terrifyingly accurate. It saved me hours of manual editing.', avatar: 'DC' },
  { name: 'Elena Rossi', role: 'Product Manager', text: 'A game changer for job seekers. Every resume feels personal and professional.', avatar: 'ER' }
]

import { Search } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
    
    <!-- Navbar -->
    <nav class="navbar bg-white/70 backdrop-blur-xl sticky top-0 z-[100] border-b border-slate-100 px-6 lg:px-20 py-4">
      <div class="flex-1">
        <div class="flex items-center gap-3 cursor-pointer group" @click="router.push('/')">
          <div class="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg shadow-indigo-100 group-hover:rotate-12 transition-all">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <span class="font-black text-xl tracking-tighter text-slate-900">AICV Builder</span>
        </div>
      </div>
      
      <div class="hidden lg:flex flex-none gap-8 mr-12">
        <a href="#features" class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Features</a>
        <a href="#how-it-works" class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">How it Works</a>
        <a href="#pricing" class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Pricing</a>
      </div>

      <div class="flex-none gap-4">
        <div v-if="!authStore.user" class="flex items-center gap-2">
          <button @click="router.push('/login')" class="btn btn-ghost btn-sm font-black text-slate-500 hover:text-indigo-600 uppercase tracking-widest px-6">Login</button>
          <button @click="router.push('/register')" class="btn btn-primary rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 border-none px-8 shadow-xl shadow-indigo-100 hover:scale-105 transition-all text-white font-black uppercase text-xs tracking-widest">Get Started</button>
        </div>
        <div v-else class="flex items-center gap-4">
           <button @click="router.push('/dashboard')" class="btn btn-primary rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 border-none px-8 shadow-xl shadow-indigo-100 hover:scale-105 transition-all text-white font-black uppercase text-xs tracking-widest">My Dashboard</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-52">
      <!-- Background Mesh Gradients -->
      <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-violet-50 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>

      <div class="container mx-auto px-6 text-center relative z-10">
        <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <Sparkles class="w-4 h-4 text-indigo-600" />
           <span class="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 leading-none">AI-Powered Resume Tailoring</span>
        </div>

        <h1 class="text-5xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tighter mb-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          Turn Any Job Description Into a <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Perfect CV</span> in Seconds.
        </h1>

        <p class="text-lg lg:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
          Stop sending generic resumes. Our AI analyzes job requirements and re-writes your experience to beat the ATS every single time.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
          <button @click="router.push('/dashboard')" class="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black uppercase text-sm tracking-widest shadow-2xl shadow-indigo-200/50 hover:scale-110 active:scale-95 transition-all overflow-hidden">
            <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span class="flex items-center gap-3">Generate My Tailored CV <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          </button>
        </div>

        <!-- Trust Indicators -->
        <div class="flex flex-wrap items-center justify-center gap-8 lg:gap-16 animate-in fade-in duration-1000 delay-500">
           <div class="flex items-center gap-2 font-bold text-slate-400">
              <CheckCircle2 class="w-5 h-5 text-indigo-500" />
              <span class="text-xs uppercase tracking-widest">ATS Optimized</span>
           </div>
           <div class="flex items-center gap-2 font-bold text-slate-400">
              <BarChart3 class="w-5 h-5 text-indigo-500" />
              <span class="text-xs uppercase tracking-widest">AI Scoring</span>
           </div>
           <div class="flex items-center gap-2 font-bold text-slate-400">
              <Users class="w-5 h-5 text-indigo-500" />
              <span class="text-xs uppercase tracking-widest">10,000+ Users</span>
           </div>
        </div>

        <!-- Product Visualization Mockup -->
        <div class="mt-24 lg:mt-32 max-w-6xl mx-auto relative group">
           <div class="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-all duration-700"></div>
           <div class="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden p-4 lg:p-8 flex flex-col lg:flex-row gap-8 hover:scale-[1.02] transition-transform duration-700">
              <!-- Mockup Input -->
              <div class="flex-1 rounded-[1.5rem] bg-slate-50 border border-slate-200 p-8 text-left">
                 <div class="flex items-center gap-2 mb-6">
                    <div class="w-3 h-3 rounded-full bg-rose-400"></div>
                    <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                 </div>
                 <div class="space-y-4">
                    <div class="h-4 bg-slate-200 rounded-full w-[90%]"></div>
                    <div class="h-4 bg-indigo-100 rounded-full w-[80%]"></div>
                    <div class="h-24 bg-slate-200/50 rounded-2xl w-full"></div>
                    <div class="h-4 bg-slate-200 rounded-full w-[40%]"></div>
                 </div>
                 <div class="mt-8 flex justify-end">
                    <div class="px-6 py-2 rounded-xl bg-indigo-600 text-white text-[10px] uppercase font-black tracking-widest flex items-center gap-2 animate-pulse">
                       <Zap class="w-3 h-3" /> Analyzing...
                    </div>
                 </div>
              </div>
              <!-- Mockup Result -->
              <div class="flex-[1.2] rounded-[1.5rem] bg-white border border-slate-200 shadow-sm p-8 text-left relative overflow-hidden">
                 <div class="absolute top-8 right-8 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">92% Match</div>
                 <div class="space-y-6">
                    <div class="h-8 bg-slate-900 rounded-lg w-[60%]"></div>
                    <div class="h-2 bg-slate-200 rounded-full w-[30%]"></div>
                    <div class="divider"></div>
                    <div class="space-y-3">
                       <div class="flex items-center gap-3">
                          <div class="h-3 bg-indigo-600 rounded-full w-[30%] shadow-lg shadow-indigo-100"></div>
                          <Sparkles class="w-3 h-3 text-indigo-600 animate-bounce" />
                       </div>
                       <div class="h-2 bg-slate-100 rounded-full w-full"></div>
                       <div class="h-2 bg-slate-100 rounded-full w-[95%]"></div>
                       <div class="h-2 bg-slate-100 rounded-full w-[80%]"></div>
                    </div>
                 </div>
              </div>
           </div>
           <!-- Floating cursor for effect -->
           <div class="absolute bottom-1/4 right-[45%] pointer-events-none animate-bounce delay-1000 hidden lg:block">
              <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white shadow-2xl">
                 <MousePointer2 class="w-4 h-4" />
                 <span class="text-[10px] font-black tracking-widest uppercase">Generate Tailored CV</span>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div id="how-it-works" class="py-32 bg-slate-50 border-y border-slate-100 mt-20">
      <div class="container mx-auto px-6">
        <div class="text-center mb-20">
          <h2 class="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">The Workflow</h2>
          <p class="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">Land more interviews in 3 steps.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div v-for="step in steps" :key="step.number" class="relative group p-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all hover:-translate-y-2">
            <span class="absolute -top-6 -right-4 text-7xl font-black text-indigo-50">{{ step.number }}</span>
            <div class="relative z-10">
              <h3 class="text-2xl font-black text-slate-900 mb-4">{{ step.title }}</h3>
              <p class="text-slate-500 font-medium leading-relaxed">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="py-32">
      <div class="container mx-auto px-6 lg:px-20">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          <div class="flex-1 space-y-8">
            <div class="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest">Built for humans & Bots</div>
            <h2 class="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tighter">Everything you need to beat <span class="text-indigo-600 italic">the bots.</span></h2>
            <p class="text-xl text-slate-500 font-medium">Standard resumes get ignored. Our tools ensure your expertise is matched and highlighted correctly.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8">
              <div v-for="feat in features" :key="feat.title" class="space-y-4">
                <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center', feat.bg]">
                  <component :is="feat.icon" :class="['w-6 h-6', feat.color]" />
                </div>
                <h4 class="text-xl font-black text-slate-900 tracking-tight">{{ feat.title }}</h4>
                <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ feat.description }}</p>
              </div>
            </div>
          </div>
          <div class="flex-1 relative hidden lg:block">
            <div class="absolute inset-0 bg-slate-100 rounded-[3rem] -rotate-3 scale-[0.98] opacity-50"></div>
            <div class="relative bg-white border border-slate-200 rounded-[3rem] p-12 shadow-2xl shadow-indigo-100 overflow-hidden transform rotate-2">
               <!-- Score Visualization Feature -->
               <div class="space-y-10">
                  <div class="flex justify-between items-end">
                    <span class="text-xs font-black uppercase text-slate-400">Match Score Analysis</span>
                    <span class="text-4xl font-black text-indigo-600 leading-none tracking-tighter">87%</span>
                  </div>
                  <div class="h-4 bg-slate-100 rounded-full"><div class="h-full w-[87%] bg-indigo-600 rounded-full"></div></div>
                  <div class="space-y-6">
                    <div v-for="i in 3" :key="i" class="flex gap-4">
                      <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 class="w-5 h-5 text-emerald-500" />
                      </div>
                      <div class="space-y-2 flex-1">
                        <div class="h-3 bg-slate-200 rounded-full w-[90%]"></div>
                        <div class="h-2 bg-slate-100 rounded-full w-[60%]"></div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="py-32 bg-slate-900 text-white relative overflow-hidden">
      <!-- Glow effect -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="container mx-auto px-6 relative z-10 text-center">
        <h2 class="text-4xl font-black mb-20 tracking-tighter">Loved by thousands of <br class="hidden md:block"/> high-earning professionals.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div v-for="t in testimonials" :key="t.name" class="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl text-left hover:scale-105 transition-all duration-500 group">
             <Quote class="w-10 h-10 text-indigo-500 mb-8 opacity-40 group-hover:opacity-100 transition-opacity" />
             <p class="text-lg font-medium text-slate-300 leading-relaxed mb-10">"{{ t.text }}"</p>
             <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black text-sm">{{ t.avatar }}</div>
                <div>
                   <p class="font-black text-white text-sm tracking-tight">{{ t.name }}</p>
                   <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t.role }}</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final CTA Section -->
    <div class="py-32 lg:py-52 container mx-auto px-6 text-center">
       <div class="bg-gradient-to-br from-indigo-700 to-violet-900 rounded-[4rem] p-16 lg:p-32 text-white relative overflow-hidden shadow-[0_48px_100px_rgba(79,70,229,0.3)]">
          <!-- Mesh blobs -->
          <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse"></div>
          <div class="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-violet-400/20 rounded-full blur-[100px] animate-pulse"></div>
          
          <div class="relative z-10 max-w-3xl mx-auto">
             <h2 class="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-10">Stop applying. <br/> Start interviewing.</h2>
             <p class="text-xl lg:text-2xl text-indigo-100 font-medium mb-12 leading-relaxed opacity-80">
                Join 10,000+ job seekers who tailored their way to a better career. No commitment, just results.
             </p>
             <button @click="router.push('/dashboard')" class="btn btn-lg bg-white hover:bg-indigo-50 text-indigo-700 border-none rounded-2xl px-12 font-black uppercase text-sm tracking-widest shadow-2xl h-auto py-5 active:scale-95 transition-all">
                Tailor My CV for Free
             </button>
          </div>
       </div>
    </div>

    <!-- Footer -->
    <footer class="footer p-20 bg-white border-t border-slate-100 container mx-auto rounded-t-[4rem]">
      <aside>
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-indigo-600 p-2 rounded-xl">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <span class="font-black text-xl tracking-tighter text-slate-900 uppercase">AICV Builder</span>
        </div>
        <p class="text-slate-400 font-semibold max-w-xs leading-relaxed">The AI-first platform for job seekers who value their time and career growth.</p>
        <p class="mt-10 text-xs font-bold text-slate-300 uppercase tracking-widest">© 2026 AICV Builder. All rights reserved.</p>
      </aside> 
      <nav>
        <h6 class="footer-title opacity-40 font-black tracking-widest">Product</h6> 
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">Features</a>
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">How it Works</a>
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">Templates</a>
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">Pricing</a>
      </nav> 
      <nav>
        <h6 class="footer-title opacity-40 font-black tracking-widest">Company</h6> 
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">About us</a>
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">Privacy Policy</a>
        <a class="link link-hover font-bold text-slate-500 hover:text-indigo-600">Terms of service</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
@reference "../style.css";

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.divider {
  @apply h-[1px] bg-slate-100 w-full my-6;
}

select:focus, button:focus {
  outline: none;
}
</style>
