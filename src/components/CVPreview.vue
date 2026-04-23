<script setup>
import { useCvStore } from '../stores/cvStore'
import { computed } from 'vue'
import { MapPin, Mail, Phone, ExternalLink, Briefcase, GraduationCap, Award, Layout, MessageSquare, Trophy, Globe, Linkedin, Github } from 'lucide-vue-next'

const store = useCvStore()
const cv = computed(() => store.currentCV)
const template = computed(() => store.selectedTemplate)
const tpl = computed(() => store.templates.find(t => t.id === template.value) || store.templates[0])
</script>

<template>
  <div class="w-[210mm] min-h-[297mm] shadow-2xl transition-all duration-300 cv-document" :style="{ backgroundColor: tpl.bg }">
    
    <!-- MINIMAL LAYOUT (Professional Refactor) -->
    <div v-if="tpl.layout === 'minimal'" class="text-slate-800 font-sans h-full bg-white">
      <header :style="{ backgroundColor: tpl.color }" class="text-white p-12 flex justify-between items-center relative overflow-hidden">
        <div class="flex items-center gap-8 relative z-10">
          <div class="w-32 h-32 rounded-3xl border-4 overflow-hidden bg-slate-200 rotate-3 shadow-2xl" :style="{ borderColor: tpl.accent }">
             <img :src="cv.personalInfo.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + cv.personalInfo.fullName" alt="Avatar" class="w-full h-full object-cover -rotate-3" />
          </div>
          <div>
            <h1 class="text-5xl font-black tracking-tight mb-1 uppercase">{{ cv.personalInfo.fullName }}</h1>
            <p :style="{ color: tpl.accent }" class="text-lg font-bold uppercase tracking-[0.3em]">Professional Resume</p>
          </div>
        </div>
        
        <div class="text-right space-y-2 relative z-10 font-bold">
          <div class="flex items-center justify-end gap-3"><span class="text-xs">{{ cv.personalInfo.phone }}</span><Phone class="w-4 h-4" :style="{ color: tpl.accent }" /></div>
          <div class="flex items-center justify-end gap-3"><span class="text-xs">{{ cv.personalInfo.email }}</span><Mail class="w-4 h-4" :style="{ color: tpl.accent }" /></div>
          <div class="flex items-center justify-end gap-3"><span class="text-xs">{{ cv.personalInfo.location }}</span><MapPin class="w-4 h-4" :style="{ color: tpl.accent }" /></div>
        </div>
      </header>

      <div class="p-12 space-y-12">
        <!-- Executive Summary (Full Width) -->
        <section>
          <div class="flex items-center gap-3 mb-4 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
            <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Professional Summary</h2>
          </div>
          <p class="text-sm leading-relaxed text-slate-600 font-medium italic border-l-4 pl-4 py-1" :style="{ borderColor: tpl.accent }">{{ cv.summary }}</p>
        </section>

        <!-- Experience (Full Width) -->
        <section>
          <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
            <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Work Experience</h2>
          </div>
          <div v-for="(exp, idx) in cv.experience" :key="idx" class="mb-10 last:mb-0">
            <div class="flex justify-between items-end mb-3">
              <div>
                <h3 class="text-2xl font-black" :style="{ color: tpl.color }">{{ exp.title }}</h3>
                <p class="text-sm font-bold uppercase" :style="{ color: tpl.accent }">{{ exp.company }}</p>
              </div>
              <span class="text-xs font-black bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-widest">{{ exp.date }}</span>
            </div>
            <!-- Auto-columns for long lists -->
            <ul :class="['space-y-2 text-slate-600 font-medium', exp.bullets?.length > 4 ? 'columns-2 gap-8' : '']">
              <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-xs leading-relaxed flex gap-2 break-inside-avoid">
                <span :style="{ color: tpl.accent }">🔷</span> {{ bullet }}
              </li>
            </ul>
          </div>
        </section>

        <!-- Projects (Full Width) -->
        <section v-if="cv.projects && cv.projects.length">
          <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
            <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Key Projects</h2>
          </div>
          <div class="grid grid-cols-2 gap-8">
            <div v-for="(project, idx) in cv.projects" :key="idx" class="group p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all">
              <h3 class="text-lg font-black text-slate-800 flex items-center justify-between">
                {{ project.name }}
                <a v-if="project.link" :href="project.link" target="_blank" class="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink class="w-4 h-4" /></a>
              </h3>
              <p class="text-xs text-slate-500 font-medium leading-relaxed mt-2">{{ project.description }}</p>
            </div>
          </div>
        </section>

        <!-- Two Column Footer Sections -->
        <div class="grid grid-cols-2 gap-16">
          <section>
            <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
              <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Technical Skills</h2>
            </div>
            <div class="flex flex-wrap gap-2">
              <span v-for="skill in cv.skills" :key="skill" class="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:border-indigo-400 transition-colors">{{ skill }}</span>
            </div>
          </section>

          <div class="space-y-12">
            <section>
              <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
                <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Education</h2>
              </div>
              <div v-for="edu in cv.education" :key="edu.degree" class="mb-4 last:mb-0">
                <h3 class="text-sm font-black text-slate-800 uppercase">{{ edu.degree }}</h3>
                <p class="text-[10px] font-bold" :style="{ color: tpl.accent }">{{ edu.school }}</p>
                <p class="text-[10px] text-slate-400 font-bold">{{ edu.date }}</p>
              </div>
            </section>

            <section v-if="cv.certifications && cv.certifications.length">
              <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
                <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Certifications</h2>
              </div>
              <ul class="space-y-3">
                <li v-for="cert in cv.certifications" :key="cert" class="text-xs text-slate-700 font-bold flex items-center gap-3">
                  <Award class="w-4 h-4 shrink-0" :style="{ color: tpl.accent }" />
                  {{ cert }}
                </li>
              </ul>
            </section>

            <section v-if="cv.languages && cv.languages.length">
              <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
                <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Languages</h2>
              </div>
              <div class="flex flex-wrap gap-3">
                <div v-for="lang in cv.languages" :key="lang" class="flex flex-col gap-1">
                  <span class="text-xs font-black text-slate-800">{{ lang.split('(')[0] }}</span>
                  <span v-if="lang.includes('(')" class="text-[9px] font-bold text-slate-400 uppercase">{{ lang.split('(')[1].replace(')', '') }}</span>
                </div>
              </div>
            </section>

            <section v-if="cv.interests && cv.interests.length">
              <div class="flex items-center gap-3 mb-6 border-b-2 pb-2" :style="{ borderColor: tpl.accent }">
                <h2 class="text-xl font-black uppercase tracking-widest" :style="{ color: tpl.color }">Interests</h2>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="interest in cv.interests" :key="interest" class="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-100">{{ interest }}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>

    <!-- SIDEBAR LAYOUT -->
    <div v-if="tpl.layout === 'sidebar'" class="flex h-full min-h-[297mm] text-slate-800 font-sans">
      <div class="w-1/3 flex flex-col p-10" :style="{ backgroundColor: tpl.color, color: '#ffffff' }">
        <div class="w-40 h-40 rounded-3xl overflow-hidden shadow-2xl mx-auto mb-10 border-4" :style="{ borderColor: 'rgba(255,255,255,0.2)' }">
           <img :src="cv.personalInfo.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + cv.personalInfo.fullName" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-10">
           <section>
              <h2 class="text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b pb-2" :style="{ color: tpl.accent, borderColor: 'rgba(255,255,255,0.1)' }">Contact</h2>
              <div class="space-y-4 text-sm font-medium text-white/80">
                 <div class="flex items-center gap-3">
                    <Phone class="w-4 h-4" :style="{ color: tpl.accent }" /><span>{{ cv.personalInfo.phone }}</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <Mail class="w-4 h-4" :style="{ color: tpl.accent }" /><span>{{ cv.personalInfo.email }}</span>
                 </div>
                 <div class="flex items-center gap-3">
                    <MapPin class="w-4 h-4" :style="{ color: tpl.accent }" /><span>{{ cv.personalInfo.location }}</span>
                 </div>
              </div>
           </section>
           <section>
              <h2 class="text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b pb-2" :style="{ color: tpl.accent, borderColor: 'rgba(255,255,255,0.1)' }">Skills</h2>
              <div class="flex flex-wrap gap-2">
                 <span v-for="skill in cv.skills" :key="skill" class="px-2.5 py-1 text-[10px] font-bold rounded-md" :style="{ backgroundColor: 'rgba(255,255,255,0.1)' }">{{ skill }}</span>
              </div>
           </section>
           <section>
              <h2 class="text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b pb-2" :style="{ color: tpl.accent, borderColor: 'rgba(255,255,255,0.1)' }">Education</h2>
              <div v-for="edu in cv.education" :key="edu.degree" class="mb-4">
                 <h3 class="text-xs font-black text-white">{{ edu.degree }}</h3>
                 <p class="text-[10px] mt-1 uppercase" :style="{ color: tpl.accent }">{{ edu.school }}</p>
              </div>
           </section>
        </div>
      </div>
      <div class="w-2/3 p-12">
        <header class="mb-12 border-b pb-8" :style="{ borderColor: tpl.accent + '40' }">
          <h1 class="text-5xl font-black tracking-tighter mb-2" :style="{ color: tpl.color }">{{ cv.personalInfo.fullName }}</h1>
          <p class="text-lg font-bold uppercase tracking-widest mt-2" :style="{ color: tpl.accent }">Professional CV</p>
        </header>
        <div class="space-y-10">
          <section>
             <h2 class="text-xs font-black uppercase tracking-[0.3em] mb-4" :style="{ color: tpl.accent }">Profile Summary</h2>
             <p class="text-sm leading-relaxed font-medium text-slate-600">{{ cv.summary }}</p>
          </section>
          <section>
             <h2 class="text-xs font-black uppercase tracking-[0.3em] mb-6" :style="{ color: tpl.accent }">Work Experience</h2>
             <div class="space-y-8">
                <div v-for="(exp, idx) in cv.experience" :key="idx" class="relative">
                   <h3 class="text-xl font-black" :style="{ color: tpl.color }">{{ exp.title }}</h3>
                   <div class="flex items-center gap-2 mb-3 mt-1">
                     <span class="text-xs font-bold uppercase" :style="{ color: tpl.accent }">{{ exp.company }}</span>
                     <span class="text-xs font-medium text-slate-400">| {{ exp.date }}</span>
                   </div>
                   <ul class="space-y-2">
                      <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-sm text-slate-600 font-medium leading-relaxed flex gap-3">
                         <div class="w-1 h-1 rounded-full mt-2 shrink-0" :style="{ backgroundColor: tpl.accent }"></div>{{ bullet }}
                      </li>
                   </ul>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>

    <!-- BOLD LAYOUT -->
    <div v-if="tpl.layout === 'bold'" class="flex flex-col h-full min-h-[297mm] text-slate-800 font-sans">
      <header class="text-center p-14 relative" :style="{ backgroundColor: tpl.color, color: '#ffffff' }">
        <div class="w-32 h-32 rounded-full border-4 overflow-hidden mx-auto mb-6 shadow-2xl relative z-10" :style="{ borderColor: tpl.accent }">
           <img :src="cv.personalInfo.photo || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + cv.personalInfo.fullName" alt="Avatar" class="w-full h-full object-cover" />
        </div>
        <h1 class="text-5xl font-black tracking-tighter mb-2 relative z-10">{{ cv.personalInfo.fullName }}</h1>
        <div class="flex justify-center gap-6 mt-6 text-sm font-medium relative z-10" :style="{ color: 'rgba(255,255,255,0.8)' }">
           <span class="flex items-center gap-2"><Mail class="w-4 h-4" /> {{ cv.personalInfo.email }}</span>
           <span class="flex items-center gap-2"><Phone class="w-4 h-4" /> {{ cv.personalInfo.phone }}</span>
           <span class="flex items-center gap-2"><MapPin class="w-4 h-4" /> {{ cv.personalInfo.location }}</span>
        </div>
        <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full" :style="{ backgroundColor: tpl.accent }"></div>
      </header>

      <div class="flex-1 p-14 bg-white/50 backdrop-blur-sm grid grid-cols-1 gap-12">
        <section class="text-center">
           <p class="text-lg leading-relaxed font-medium text-slate-700 max-w-2xl mx-auto">{{ cv.summary }}</p>
        </section>

        <section>
           <h2 class="text-3xl font-black mb-8 text-center" :style="{ color: tpl.color }">Experience</h2>
           <div class="space-y-6">
              <div v-for="(exp, idx) in cv.experience" :key="idx" class="bg-white p-6 rounded-3xl shadow-sm border" :style="{ borderColor: tpl.accent + '40' }">
                 <div class="flex flex-col sm:flex-row justify-between mb-4 gap-2">
                    <h3 class="text-xl font-black" :style="{ color: tpl.color }">{{ exp.title }}</h3>
                    <span class="text-sm font-bold px-3 py-1 rounded-full self-start" :style="{ backgroundColor: tpl.accent + '20', color: tpl.accent }">{{ exp.date }}</span>
                 </div>
                 <p class="text-sm font-bold uppercase mb-4 text-slate-400">{{ exp.company }}</p>
                 <ul class="space-y-2">
                    <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-sm text-slate-600 font-medium leading-relaxed">• {{ bullet }}</li>
                 </ul>
              </div>
           </div>
        </section>
      </div>
    </div>

    <!-- SPLIT LAYOUT -->
    <div v-if="tpl.layout === 'split'" class="flex flex-col h-full min-h-[297mm] text-slate-800 font-sans">
      <header class="p-16 text-center text-white relative overflow-hidden" :style="{ backgroundColor: tpl.color }">
        <h1 class="text-6xl font-black tracking-tighter mb-4 relative z-10">{{ cv.personalInfo.fullName }}</h1>
        <p class="text-xl font-bold uppercase tracking-widest relative z-10" :style="{ color: tpl.accent }">Professional CV</p>
      </header>
      <div class="flex flex-1">
        <div class="w-[40%] p-10 space-y-12 bg-white/70 backdrop-blur-sm shadow-xl relative z-20">
           <section>
              <h2 class="text-lg font-black uppercase mb-6 flex gap-2 items-center" :style="{ color: tpl.color }"><span class="w-4 h-1 rounded-full" :style="{ backgroundColor: tpl.accent }"></span> Details</h2>
              <div class="space-y-4 text-sm font-bold text-slate-600">
                 <p>Email: <br><span class="font-medium text-slate-500">{{ cv.personalInfo.email }}</span></p>
                 <p>Phone: <br><span class="font-medium text-slate-500">{{ cv.personalInfo.phone }}</span></p>
                 <p>Location: <br><span class="font-medium text-slate-500">{{ cv.personalInfo.location }}</span></p>
              </div>
           </section>
           <section>
              <h2 class="text-lg font-black uppercase mb-6 flex gap-2 items-center" :style="{ color: tpl.color }"><span class="w-4 h-1 rounded-full" :style="{ backgroundColor: tpl.accent }"></span> Skills</h2>
              <div class="space-y-2">
                 <div v-for="skill in cv.skills" :key="skill" class="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-sm border border-slate-200 border-l-4" :style="{ borderLeftColor: tpl.accent }">{{ skill }}</div>
              </div>
           </section>
        </div>
        <div class="w-[60%] p-12 bg-white space-y-10">
           <section>
              <h2 class="text-2xl font-black mb-4" :style="{ color: tpl.color }">Summary</h2>
              <p class="text-sm leading-relaxed text-slate-600 font-medium">{{ cv.summary }}</p>
           </section>
           <section>
              <h2 class="text-2xl font-black mb-6" :style="{ color: tpl.color }">Experience</h2>
              <div class="space-y-8">
                 <div v-for="(exp, idx) in cv.experience" :key="idx">
                    <h3 class="text-lg font-black" :style="{ color: tpl.color }">{{ exp.title }}</h3>
                    <p class="text-xs font-bold uppercase mb-2" :style="{ color: tpl.accent }">{{ exp.company }} - {{ exp.date }}</p>
                    <ul class="space-y-1.5 mt-3">
                       <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="text-xs text-slate-600 font-medium leading-relaxed">
                         • {{ bullet }}
                       </li>
                    </ul>
                 </div>
              </div>
           </section>
        </div>
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
