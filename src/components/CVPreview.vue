<script setup>
import { useCvStore } from '../stores/cvStore'
import { computed } from 'vue'
import { MapPin, Mail, Phone, ExternalLink, Briefcase, GraduationCap, Award, Layout, MessageSquare, Trophy, Globe, Linkedin, Github } from 'lucide-vue-next'

const store = useCvStore()
const cv = computed(() => store.currentCV)
const template = computed(() => store.selectedTemplate)
</script>

<template>
  <div class="w-[210mm] min-h-[297mm] bg-white shadow-2xl transition-all duration-300 cv-document">
    
    <!-- MINIMAL TEMPLATE (High Fidelity Modern Minimal) -->
    <div v-if="template === 'minimal'" class="text-slate-800 font-sans">
      <!-- Header -->
      <header class="bg-[#1a2b4b] text-white p-12 flex justify-between items-center relative overflow-hidden">
        <div class="flex items-center gap-8 relative z-10">
          <div class="w-32 h-32 rounded-full border-4 border-[#ffcc00] overflow-hidden bg-slate-200">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div>
            <h1 class="text-5xl font-black tracking-tight mb-1">{{ cv.personalInfo.fullName }}</h1>
            <p class="text-[#ffcc00] text-lg font-bold uppercase tracking-widest">Digital Marketing Specialist</p>
          </div>
        </div>
        
        <div class="text-right space-y-2 relative z-10">
          <div class="flex items-center justify-end gap-3 transition-all hover:translate-x-[-4px]">
            <span class="text-sm font-medium">{{ cv.personalInfo.phone }}</span>
            <div class="w-8 h-8 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Phone class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 transition-all hover:translate-x-[-4px]">
            <span class="text-sm font-medium">{{ cv.personalInfo.email }}</span>
            <div class="w-8 h-8 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Mail class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 transition-all hover:translate-x-[-4px]">
            <span class="text-sm font-medium">{{ cv.personalInfo.linkedin }}</span>
            <div class="w-8 h-8 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Linkedin class="w-4 h-4" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 transition-all hover:translate-x-[-4px]">
            <span class="text-sm font-medium">portfolio.url</span>
            <div class="w-8 h-8 rounded-full bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Globe class="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Grid -->
      <div class="p-12 grid grid-cols-2 gap-x-16 gap-y-12">
        
        <!-- Career Objective -->
        <section>
          <div class="flex items-center gap-3 mb-4 border-b-2 border-[#ffcc00] pb-2">
            <div class="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Briefcase class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-black uppercase tracking-tighter text-[#1a2b4b]">Career Objective</h2>
          </div>
          <p class="text-sm leading-relaxed text-slate-600 font-medium italic">
            "{{ cv.summary }}"
          </p>
        </section>

        <!-- Key Skills -->
        <section>
          <div class="flex items-center gap-3 mb-4 border-b-2 border-[#ffcc00] pb-2">
            <div class="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Trophy class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-black uppercase tracking-tighter text-[#1a2b4b]">Key Skills</h2>
          </div>
          <div class="space-y-4">
             <div>
                <p class="text-xs font-black uppercase text-slate-400 mb-1.5">Technical Expertise</p>
                <div class="flex flex-wrap gap-2 text-sm text-slate-700">
                  <span v-for="(skill, idx) in cv.skills" :key="idx" class="px-3 py-1 bg-slate-100 rounded-lg font-bold border border-slate-200">{{ skill }}</span>
                </div>
             </div>
          </div>
        </section>

        <!-- Experience -->
        <section>
          <div class="flex items-center gap-3 mb-6 border-b-2 border-[#ffcc00] pb-2">
            <div class="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
              <Award class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-black uppercase tracking-tighter text-[#1a2b4b]">Work Experience</h2>
          </div>
          <div v-for="(exp, idx) in cv.experience" :key="idx" class="mb-8 last:mb-0 relative pl-4 border-l border-slate-200">
            <div class="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#ffcc00]"></div>
            <h3 class="text-lg font-black text-[#1a2b4b]">{{ exp.title }}</h3>
            <p class="text-xs font-bold text-[#ffcc00] uppercase mb-2">{{ exp.company }} | {{ exp.date }}</p>
            <ul class="space-y-1.5">
              <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-xs text-slate-600 font-medium leading-relaxed">• {{ bullet }}</li>
            </ul>
          </div>
        </section>

        <!-- Education & Projects -->
        <div class="space-y-12">
          <!-- Education -->
          <section>
            <div class="flex items-center gap-3 mb-4 border-b-2 border-[#ffcc00] pb-2">
              <div class="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
                <GraduationCap class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black uppercase tracking-tighter text-[#1a2b4b]">Education</h2>
            </div>
            <div v-for="(edu, idx) in cv.education" :key="idx" class="mb-4">
              <h3 class="text-sm font-black text-slate-800">{{ edu.degree }}</h3>
              <p class="text-[11px] font-bold text-[#ffcc00] uppercase">{{ edu.school }}</p>
              <p class="text-[11px] text-slate-500 font-medium">{{ edu.date }}</p>
            </div>
          </section>

          <!-- Projects -->
          <section>
            <div class="flex items-center gap-3 mb-4 border-b-2 border-[#ffcc00] pb-2">
              <div class="w-10 h-10 rounded-xl bg-[#ffcc00] flex items-center justify-center text-[#1a2b4b]">
                <Layout class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black uppercase tracking-tighter text-[#1a2b4b]">Projects</h2>
            </div>
            <div class="space-y-3">
               <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p class="text-sm font-bold text-slate-800 tracking-tight">AI Resume Platform</p>
                  <p class="text-[10px] text-slate-500 font-medium mt-1">Full-stack CV builder with real-time AI optimization.</p>
               </div>
               <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p class="text-sm font-bold text-slate-800 tracking-tight">FinTech Analytics Dashboard</p>
                  <p class="text-[10px] text-slate-500 font-medium mt-1">Data visualization for real-time market trends.</p>
               </div>
            </div>
          </section>
        </div>

      </div>
    </div>

    <!-- PROFESSIONAL TEMPLATE (High Fidelity Clean Green) -->
    <div v-if="template === 'professional'" class="flex h-full min-h-[297mm] text-slate-800 font-sans">
      <div class="p-12 w-full">
        <header class="flex items-center gap-10 mb-12 bg-emerald-50 p-10 rounded-[3rem] border border-emerald-100">
          <div class="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl rotate-3">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Herman" alt="Avatar" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h1 class="text-5xl font-black text-slate-900 tracking-tighter mb-2">{{ cv.personalInfo.fullName }}</h1>
            <p class="text-emerald-600 text-xl font-bold uppercase tracking-widest">Creative UI/UX Designer</p>
            <div class="flex gap-6 mt-6 text-sm font-medium text-slate-400">
               <span class="flex items-center gap-2"><Mail class="w-4 h-4" /> {{ cv.personalInfo.email }}</span>
               <span class="flex items-center gap-2"><Phone class="w-4 h-4" /> {{ cv.personalInfo.phone }}</span>
               <span class="flex items-center gap-2"><MapPin class="w-4 h-4" /> {{ cv.personalInfo.location }}</span>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-12 gap-12">
           <div class="col-span-8 space-y-12">
              <section>
                 <h2 class="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-4">
                    Profile Summary <div class="h-[1px] flex-1 bg-emerald-100"></div>
                 </h2>
                 <p class="text-lg leading-relaxed text-slate-600 font-medium pb-4 border-b border-emerald-50">{{ cv.summary }}</p>
              </section>

              <section>
                 <h2 class="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 flex items-center gap-4">
                    Employment Record <div class="h-[1px] flex-1 bg-emerald-100"></div>
                 </h2>
                 <div class="space-y-10">
                    <div v-for="(exp, idx) in cv.experience" :key="idx" class="relative pl-8 border-l-2 border-emerald-50">
                       <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-emerald-500"></div>
                       <h3 class="text-xl font-black text-slate-900 mb-1">{{ exp.title }}</h3>
                       <p class="text-sm font-bold text-emerald-500 mb-4">{{ exp.company }} | {{ exp.date }}</p>
                       <ul class="space-y-2">
                          <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-sm text-slate-500 font-medium leading-relaxed flex gap-3">
                             <div class="w-1.5 h-1.5 rounded-full bg-emerald-200 mt-2 shrink-0"></div>
                             {{ bullet }}
                          </li>
                       </ul>
                    </div>
                 </div>
              </section>
           </div>

           <div class="col-span-4 space-y-12">
              <section>
                 <h2 class="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-4">
                    Core Skills <div class="h-[1px] flex-1 bg-emerald-100"></div>
                 </h2>
                 <div class="flex flex-wrap gap-2">
                    <span v-for="skill in cv.skills" :key="skill" class="px-3 py-1.5 bg-white border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all hover:bg-emerald-500 hover:text-white">{{ skill }}</span>
                 </div>
              </section>

              <section>
                 <h2 class="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-6 flex items-center gap-4">
                    Education <div class="h-[1px] flex-1 bg-emerald-100"></div>
                 </h2>
                 <div v-for="edu in cv.education" :key="edu.degree" class="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <h3 class="text-sm font-black text-slate-900">{{ edu.degree }}</h3>
                    <p class="text-xs font-bold text-emerald-600 mt-1 uppercase">{{ edu.school }}</p>
                    <p class="text-[10px] text-slate-400 mt-2">{{ edu.date }}</p>
                 </div>
              </section>
           </div>
        </div>
      </div>
    </div>

    <!-- CREATIVE TEMPLATE (High Fidelity Deep Maroon Sidebar) -->
    <div v-if="template === 'creative'" class="flex h-full min-h-[297mm] text-slate-800 font-sans">
      <div class="w-1/3 bg-[#4a1a2c] text-white p-10 flex flex-col">
        <div class="w-40 h-40 rounded-full border-4 border-white/20 overflow-hidden mb-10 mx-auto ring-8 ring-white/5 shadow-2xl border-solid">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        
        <div class="space-y-10">
           <section>
              <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 border-b border-white/10 pb-2">Contact</h2>
              <div class="space-y-4 text-sm font-medium">
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white"><Phone class="w-4 h-4" /></div>
                    <span class="break-all">{{ cv.personalInfo.phone }}</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white"><Mail class="w-4 h-4" /></div>
                    <span class="break-all">{{ cv.personalInfo.email }}</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white"><MapPin class="w-4 h-4" /></div>
                    <span>{{ cv.personalInfo.location }}</span>
                 </div>
              </div>
           </section>

           <section>
              <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 border-b border-white/10 pb-2">Technical Skills</h2>
              <div class="flex flex-wrap gap-2">
                 <span v-for="skill in cv.skills" :key="skill" class="px-2.5 py-1 bg-white/10 text-[10px] font-bold rounded-md">{{ skill }}</span>
              </div>
           </section>

           <section>
              <h2 class="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 border-b border-white/10 pb-2">Academic Story</h2>
                 <div v-for="edu in cv.education" :key="edu.degree" class="mb-4">
                    <h3 class="text-xs font-black">{{ edu.degree }}</h3>
                    <p class="text-[10px] text-white/60 mt-1 uppercase">{{ edu.school }}</p>
                 </div>
           </section>
        </div>
      </div>

      <div class="w-2/3 p-12 bg-white">
        <header class="mb-12">
           <p class="text-xs font-black uppercase tracking-[0.5em] text-slate-300 mb-2">Portfolio Presentation</p>
           <h1 class="text-6xl font-black text-[#4a1a2c] tracking-tighter">{{ cv.personalInfo.fullName }}</h1>
        </header>

        <section class="mb-12 border-b border-slate-50 pb-8">
           <h2 class="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-4 italic shrink-0">About Me</h2>
           <p class="text-lg leading-relaxed font-medium text-slate-700">{{ cv.summary }}</p>
        </section>

        <section>
           <h2 class="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8 flex items-center gap-4 italic shrink-0">Working History</h2>
           <div class="space-y-12">
              <div v-for="(exp, idx) in cv.experience" :key="idx" class="relative">
                 <div class="flex items-baseline justify-between mb-2">
                    <h3 class="text-2xl font-black text-[#4a1a2c]">{{ exp.title }}</h3>
                    <span class="text-xs font-black text-slate-300 uppercase">{{ exp.date }}</span>
                 </div>
                 <p class="text-sm font-bold text-slate-400 uppercase mb-4">{{ exp.company }}</p>
                 <ul class="space-y-3">
                    <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-sm text-slate-600 font-medium leading-relaxed">
                       {{ bullet }}
                    </li>
                 </ul>
              </div>
           </div>
        </section>
      </div>
    </div>

  </div>
</template>

<style scoped>
.cv-document {
  /* Ensure it looks like A4 paper */
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
}
</style>
