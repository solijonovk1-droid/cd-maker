<script setup>
import { ref, computed } from 'vue'
import { useCvStore } from '../stores/cvStore'
import {
  Sparkles, Loader2, Download, Check, User, FileText, Briefcase,
  GraduationCap, Plus, Trash2, Zap, Wand2, Search, Info, RotateCcw,
  ZapOff, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, ChevronDown, Palette, Lock
} from 'lucide-vue-next'
import CVPreview from './CVPreview.vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()

const store = useCvStore()
const activeTab = ref('ai') // ai | personal | summary | experience | skills | education
const expandedExp = ref({})
const newSkill = ref('')
const isExpertMode = ref(false)
const zoomLevel = ref(100)
const tabScrollArea = ref(null)

const scrollTabs = (direction) => {
  if (!tabScrollArea.value) return
  const amount = direction === 'left' ? -200 : 200
  tabScrollArea.value.scrollBy({ left: amount, behavior: 'smooth' })
}

const tabs = [
  { id: 'ai',         icon: Zap,            label: 'AI Tailor' },
  { id: 'personal',   icon: User,           label: 'Personal' },
  { id: 'summary',    icon: FileText,       label: 'Objective' },
  { id: 'experience', icon: Briefcase,      label: 'Work' },
  { id: 'skills',     icon: Check,          label: 'Skills' },
  { id: 'education',  icon: GraduationCap,  label: 'Academic' },
]

const handleGenerate = async () => {
  if (!store.currentJobDescription) return
  await store.generateCV()
  // stay on AI tab for a moment to show results, then maybe switch
}

const printCV = () => window.print()

// Word counter
const wordCount = computed(() => {
  return store.currentJobDescription ? store.currentJobDescription.trim().split(/\s+/).length : 0
})

const pasteExample = () => {
  store.currentJobDescription = "We are seeking a Senior Frontend Engineer to join our core product team. You will be responsible for architecting scalable UI systems using Vue 3, Vite, and Tailwind CSS. The ideal candidate has 5+ years of experience, a deep understanding of browser performance, and a passion for crafting elegant user experiences. Experience with TypeScript and RESTful APIs is a must."
}

// Experience helpers
const addExperience = () => {
  store.currentCV.experience.unshift({ title: '', company: '', date: '', bullets: [''] })
  expandedExp.value[0] = true
}
const removeExperience = (idx) => store.currentCV.experience.splice(idx, 1)
const addBullet = (expIdx) => store.currentCV.experience[expIdx].bullets.push('')
const removeBullet = (expIdx, bIdx) => store.currentCV.experience[expIdx].bullets.splice(bIdx, 1)

// Zoom helpers
const zoomIn = () => { if (zoomLevel.value < 150) zoomLevel.value += 10 }
const zoomOut = () => { if (zoomLevel.value > 50) zoomLevel.value -= 10 }

const isTemplateDropdownOpen = ref(false)
const templateOptions = [
  { id: 'minimal', label: 'Minimalist', desc: 'Clean & focused', premium: false },
  { id: 'professional', label: 'Enterprise Pro', desc: 'Trustworthy & solid', premium: true },
  { id: 'creative', label: 'Neo-Creative', desc: 'Modern & unique', premium: true }
]

const selectTemplate = (opt) => {
  if (opt.premium && authStore.userPlan === 'Free') {
    // Show upgrade prompt or just don't select
    return
  }
  store.selectedTemplate = opt.id
  isTemplateDropdownOpen.value = false
}
</script>

<template>
  <div class="h-full grid grid-cols-10 bg-slate-50 overflow-hidden font-sans">

    <!-- ====== LEFT PANEL (40%) ====== -->
    <div class="col-span-4 flex flex-col bg-white border-r border-slate-200 z-10 shadow-sm relative">
      
      <!-- Premium Tab Header with Overflow System -->
      <div class="relative sticky top-0 z-30 bg-white border-b border-slate-200">
        <!-- Scroll Fades -->
        <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="group relative flex items-center px-2">
          <!-- Left Arrow -->
          <button @click="scrollTabs('left')" class="btn btn-ghost btn-xs btn-square rounded-full shrink-0 h-8 w-8 hover:bg-slate-100 text-slate-400">
            <ChevronLeft class="w-4 h-4" />
          </button>

          <!-- Tabs Scroll Area -->
          <div 
            ref="tabScrollArea"
            class="flex-1 flex items-center gap-1 p-2 overflow-x-auto scrollbar-hide scroll-smooth no-scrollbar"
          >
            <button 
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              :class="['flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap', 
                       activeTab === tab.id 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 ring-2 ring-indigo-500 ring-offset-2' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50']"
            >
              <component :is="tab.icon" class="w-3.5 h-3.5" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Right Arrow -->
          <button @click="scrollTabs('right')" class="btn btn-ghost btn-xs btn-square rounded-full shrink-0 h-8 w-8 hover:bg-slate-100 text-slate-400">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
        
        <!-- ── AI TAILOR TAB ── -->
        <template v-if="activeTab === 'ai'">
          <div class="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <div class="flex items-start justify-between mb-8">
              <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tighter mb-2">AI Resume Tailoring</h1>
                <p class="text-sm text-slate-500 font-medium leading-relaxed">Optimization for ATS and human recruiters.</p>
              </div>
              <div class="bg-indigo-600/10 p-3 rounded-2xl">
                <Wand2 class="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <div class="space-y-6">
              <!-- Controls Row -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                   <button @click="isExpertMode = !isExpertMode" 
                           :class="['btn btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest gap-2 transition-all', 
                                    isExpertMode ? 'btn-neutral text-white' : 'btn-ghost border-slate-200 text-slate-400']">
                      <Zap v-if="isExpertMode" class="w-3 h-3 text-amber-400" />
                      <ZapOff v-else class="w-3 h-3" />
                      Expert Mode
                   </button>
                   <button @click="pasteExample" class="btn btn-ghost btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                     Paste Example
                   </button>
                </div>
                <div class="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                   <FileText class="w-3 h-3" />
                   {{ wordCount }} Words
                </div>
              </div>

              <!-- TextArea Container -->
              <div class="relative group">
                <!-- Decorative Glow (Pointer events none to prevent blocking input) -->
                <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-3xl blur opacity-0 group-focus-within:opacity-10 transition duration-500 pointer-events-none"></div>
                <textarea
                  v-model="store.currentJobDescription"
                  class="relative z-10 textarea textarea-bordered w-full h-80 rounded-3xl bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:bg-white transition-all text-sm font-medium leading-relaxed p-6 placeholder:text-slate-300"
                  placeholder="Paste the target job description here to optimize your AI resume..."
                ></textarea>
              </div>

              <!-- Generate Button -->
              <div class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse"></div>
                <button
                  @click="handleGenerate"
                  :disabled="store.isGenerating || !store.currentJobDescription"
                  class="relative w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all overflow-hidden group-hover:scale-[1.02]"
                >
                  <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Loader2 v-if="store.isGenerating" class="w-5 h-5 animate-spin" />
                  <template v-else>
                    <Sparkles class="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span>Generate AI CV</span>
                  </template>
                </button>
              </div>

              <!-- Match Analysis UI -->
              <div v-if="store.currentCV.matchScore > 0" class="pt-8 space-y-6 animate-in slide-in-from-top-10 fade-in duration-700">
                 <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
                    <div class="flex items-end justify-between mb-6">
                       <div>
                         <div class="flex items-center gap-2 mb-1">
                           <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                           <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">ATS Calibration Success</span>
                         </div>
                         <h4 class="text-xl font-black text-slate-800">Job Match Score</h4>
                       </div>
                       <div class="text-4xl font-black text-indigo-600 tracking-tighter">{{ store.currentCV.matchScore }}%</div>
                    </div>
                    
                    <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6 flex">
                       <div class="h-full bg-indigo-600 rounded-full transition-all duration-1000" :style="{ width: store.currentCV.matchScore + '%' }"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                       <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Keywords</p>
                          <p class="text-lg font-black text-slate-800 tracking-tighter">{{ store.currentCV.keywords.length }} Matched</p>
                       </div>
                       <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                          <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                          <p class="text-lg font-black text-emerald-700 tracking-tighter font-sans leading-none mt-1">Ready to apply</p>
                       </div>
                    </div>
                 </div>

                 <div class="flex flex-wrap gap-2 px-2">
                    <span v-for="(kw, i) in store.currentCV.keywords" :key="i" 
                          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600 uppercase tracking-tight shadow-sm hover:border-indigo-200 transition-colors">
                       <Check class="w-3 h-3 text-emerald-500" />
                       {{ kw }}
                    </span>
                 </div>
              </div>

              <!-- ATS Explanation -->
              <div v-else class="flex gap-4 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50">
                 <Info class="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                 <p class="text-[11px] text-indigo-900/60 font-medium leading-relaxed">Our AI automatically detects key industry terms and re-verbs your bullet points to maximize visibility in Applicant Tracking Systems (ATS).</p>
              </div>
            </div>
          </div>
        </template>

        <!-- ── PERSONAL/EDITING TABS ── -->
        <template v-else>
           <div class="animate-in slide-in-from-right-10 fade-in duration-500">
              <div class="flex items-center justify-between mb-8">
                 <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase">{{ tabs.find(t => t.id === activeTab).label }} Settings</h2>
                 <button @click="activeTab = 'ai'" class="btn btn-ghost btn-sm rounded-xl text-slate-400 hover:text-indigo-600 gap-2 font-bold text-[10px] uppercase">
                    <Zap class="w-3.5 h-3.5" /> Back to AI
                 </button>
              </div>

              <div class="space-y-6">
                 <!-- Editable Fields logic goes here - similar to before but with upgraded styling -->
                 <div v-if="activeTab === 'personal'" class="space-y-4">
                    <div v-for="field in [
                      { key: 'fullName',  label: 'Full Name',  placeholder: 'John Doe' },
                      { key: 'email',     label: 'Email Address',  placeholder: 'john@example.com' },
                      { key: 'phone',     label: 'Phone Number',       placeholder: '+1 234 567 890' },
                      { key: 'location',  label: 'Location',  placeholder: 'New York, US' },
                      { key: 'linkedin',  label: 'Social Profile Url',  placeholder: 'linkedin.com/in/johndoe' },
                    ]" :key="field.key" class="form-control">
                      <label class="label mb-1.5"><span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">{{ field.label }}</span></label>
                      <input v-model="store.currentCV.personalInfo[field.key]" type="text" :placeholder="field.placeholder" class="input input-bordered w-full rounded-2xl bg-slate-50/50 focus:bg-white text-sm font-bold border-slate-200" />
                    </div>
                 </div>

                 <div v-if="activeTab === 'experience'" class="space-y-6">
                    <button @click="addExperience" class="btn btn-neutral w-full rounded-2xl gap-3 font-black uppercase text-xs tracking-widest">
                       <Plus class="w-4 h-4" /> Add Experience
                    </button>
                    <div v-for="(exp, idx) in store.currentCV.experience" :key="idx" class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4 relative group">
                       <button @click="removeExperience(idx)" class="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 class="w-4 h-4" />
                       </button>
                       <div class="grid grid-cols-2 gap-4">
                          <div class="form-control">
                             <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Job Title</span></label>
                             <input v-model="exp.title" type="text" class="input input-bordered input-sm rounded-xl font-bold" />
                          </div>
                          <div class="form-control">
                             <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Company</span></label>
                             <input v-model="exp.company" type="text" class="input input-bordered input-sm rounded-xl font-bold" />
                          </div>
                       </div>
                       <div class="space-y-2">
                          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Key Achievements</p>
                          <div v-for="(bullet, bIdx) in exp.bullets" :key="bIdx" class="flex gap-2">
                             <textarea v-model="exp.bullets[bIdx]" class="textarea textarea-bordered textarea-sm flex-1 rounded-xl text-[11px] font-medium leading-relaxed"></textarea>
                             <button @click="removeBullet(idx, bIdx)" class="btn btn-ghost btn-xs btn-square text-slate-300 hover:text-rose-500 mt-1"><Trash2 class="w-3 h-3" /></button>
                          </div>
                          <button @click="addBullet(idx)" class="btn btn-ghost btn-xs rounded-lg text-indigo-600 font-bold uppercase text-[9px] tracking-widest">+ Add Achievement</button>
                       </div>
                    </div>
                 </div>

                 <!-- (Other tabs would follow the same premium pattern) -->
                 <div v-if="activeTab === 'summary'" class="space-y-4">
                    <div class="form-control">
                      <label class="label p-0 mb-3 flex justify-between">
                        <span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">Opening Statement</span>
                        <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{{ store.currentCV.summary.length }} Characters</span>
                      </label>
                      <textarea
                        v-model="store.currentCV.summary"
                        class="textarea textarea-bordered bg-slate-50/50 h-64 w-full rounded-2xl focus:shadow-xl focus:shadow-indigo-50 transition-all font-semibold p-6 text-sm border-slate-200"
                        placeholder="Highly experienced developer..."
                      ></textarea>
                    </div>
                 </div>

                 <div v-if="activeTab === 'skills'" class="space-y-6">
                    <div class="flex gap-2">
                       <input
                         v-model="newSkill"
                         @keydown.enter.prevent="addSkill"
                         type="text"
                         placeholder="e.g. TypeScript"
                         class="input input-bordered flex-1 rounded-2xl bg-slate-50 border-slate-200 font-bold uppercase text-[11px] tracking-widest"
                       />
                       <button @click="addSkill" class="btn btn-neutral btn-square rounded-2xl">
                         <Plus class="w-5 h-5" />
                       </button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                       <div v-for="(skill, idx) in store.currentCV.skills" :key="idx"
                         class="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-all">
                         <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{{ skill }}</span>
                         <button @click="removeSkill(idx)" class="text-slate-300 hover:text-rose-500 transition-colors">
                           <Trash2 class="w-3.5 h-3.5" />
                         </button>
                       </div>
                    </div>
                 </div>

                 <div v-if="activeTab === 'education'" class="space-y-6">
                    <button @click="addEducation" class="btn btn-neutral w-full rounded-2xl gap-3 font-black uppercase text-xs tracking-widest">
                       <Plus class="w-4 h-4" /> Add Academic Record
                    </button>
                    <div v-for="(edu, idx) in store.currentCV.education" :key="idx" 
                         class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4 relative group">
                       <button @click="removeEducation(idx)" class="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 class="w-4 h-4" />
                       </button>
                       <div class="form-control">
                          <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Degree / Qualification</span></label>
                          <input v-model="edu.degree" type="text" class="input input-bordered input-sm rounded-xl font-bold" />
                       </div>
                       <div class="form-control">
                          <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Institution</span></label>
                          <input v-model="edu.school" type="text" class="input input-bordered input-sm rounded-xl font-bold" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </template>

      </div>
    </div>

    <!-- ====== RIGHT PANEL: Preview (60%) ====== -->
    <div class="col-span-6 flex flex-col bg-slate-50 relative overflow-hidden">
      
      <!-- Preview Header Toolbar -->
      <div class="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 sticky top-0 shadow-sm print:hidden">
        <div class="flex items-center gap-6">
          <div class="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200">
             <button @click="zoomOut" class="btn btn-ghost btn-xs btn-square rounded-xl text-slate-500"><ZoomOut class="w-3.5 h-3.5" /></button>
             <span class="text-[10px] font-black text-slate-700 w-12 text-center uppercase tracking-tighter">{{ zoomLevel }}%</span>
             <button @click="zoomIn" class="btn btn-ghost btn-xs btn-square rounded-xl text-slate-500"><ZoomIn class="w-3.5 h-3.5" /></button>
          </div>
          
          <div class="flex items-center gap-3">
             <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Presentation:</span>
             <div class="dropdown dropdown-end">
               <div tabindex="0" role="button" @click="isTemplateDropdownOpen = !isTemplateDropdownOpen" 
                    class="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-white transition-all">
                 <Palette class="w-3.5 h-3.5 text-indigo-600" />
                 <span class="text-[10px] font-black uppercase tracking-widest text-slate-700">
                   {{ templateOptions.find(o => o.id === store.selectedTemplate)?.label }}
                 </span>
                 <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform duration-300" :class="{ 'rotate-180': isTemplateDropdownOpen }" />
               </div>
                <ul tabindex="0" class="dropdown-content z-[100] menu p-2 shadow-2xl bg-white/90 backdrop-blur-xl border border-slate-100 rounded-[1.5rem] w-64 mt-2 animate-in fade-in zoom-in-95 duration-300">
                 <li v-for="opt in templateOptions" :key="opt.id">
                   <button @click="selectTemplate(opt)"
                           :disabled="opt.premium && authStore.userPlan === 'Free'"
                           :class="['flex flex-col items-start gap-1 p-3 rounded-xl mb-1 transition-all', 
                           store.selectedTemplate === opt.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : (opt.premium && authStore.userPlan === 'Free' ? 'opacity-50 grayscale' : 'hover:bg-indigo-50 text-slate-700')]">
                     <div class="flex items-center justify-between w-full">
                       <div class="flex items-center gap-2">
                         <span class="text-[10px] font-black uppercase tracking-widest">{{ opt.label }}</span>
                         <div v-if="opt.premium" class="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-600 text-[8px] font-black">PRO</div>
                       </div>
                       <Check v-if="store.selectedTemplate === opt.id" class="w-3 h-3 text-white" />
                       <Lock v-if="opt.premium && authStore.userPlan === 'Free'" class="w-3 h-3 text-slate-400" />
                     </div>
                     <span :class="['text-[9px] font-medium opacity-60', store.selectedTemplate === opt.id ? 'text-indigo-100' : 'text-slate-500']">{{ opt.desc }}</span>
                   </button>
                 </li>
                 <div v-if="authStore.userPlan === 'Free'" class="p-3 mt-1 border-t border-slate-100">
                    <p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-2">Upgrade for all templates</p>
                    <button @click="$emit('switch-tab', 'settings')" class="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">Go Premium</button>
                 </div>
               </ul>
             </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
           <button class="btn btn-ghost btn-sm rounded-xl text-slate-500 hover:text-slate-800">
              <Maximize2 class="w-4 h-4" />
           </button>
           <button @click="printCV" class="group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-white bg-indigo-600 rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-xl shadow-indigo-200">
              <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Download class="w-4 h-4 mr-2" />
              <span class="text-[11px] uppercase tracking-widest font-black leading-none pt-0.5">Export PDF</span>
           </button>
        </div>
      </div>

      <!-- Preview Canvas -->
      <div class="flex-1 overflow-y-auto p-20 flex justify-center custom-scrollbar scroll-smooth relative">
         <!-- Paper Mockup -->
         <div :style="{ transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center' }" 
              class="transition-transform duration-300">
           <div class="relative group h-fit">
              <div class="absolute -inset-10 bg-indigo-500/5 rounded-full blur-[100px] opacity-10"></div>
              <div class="relative bg-white shadow-[0_48px_100px_rgba(0,0,0,0.08)] rounded-sm overflow-hidden animate-in zoom-in-95 duration-1000 border border-slate-100">
                 <!-- AI Changed Highlight Badge (Animated) -->
                 <div class="absolute top-8 right-8 flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500 z-10">
                    <Sparkles class="w-3 h-3 text-white fill-white" />
                    AI Optimized Page
                 </div>
                 <CVPreview />
              </div>
           </div>
         </div>

         <!-- Bottom Sync Indicator -->
         <div class="fixed bottom-10 left-[68%] -translate-x-1/2 flex items-center gap-3 bg-slate-900 border border-white/10 px-5 py-3 rounded-2xl shadow-2xl z-20 backdrop-blur-xl animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-1000">
            <div class="relative">
               <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
               <div class="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-slate-100 opacity-80 whitespace-nowrap">Live Canvas Active</span>
            <div class="w-[1px] h-3 bg-white/10 mx-1"></div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-saved</span>
         </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 100px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.1); }

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

@media print {
  body * { visibility: hidden; }
  .cv-print-container, .cv-print-container * { visibility: visible; }
  .cv-print-container { position:absolute; left:0; top:0; width:100%; margin:0; padding:0; background:white; }
  @page { margin:0; size:auto; }
}
</style>
