<script setup>
import { ref, computed } from 'vue'
import { useCvStore } from '../stores/cvStore'
import {
  Sparkles, Loader2, Download, Check, User, FileText, Briefcase,
  GraduationCap, Plus, Trash2, Zap, Wand2, Search, Info, RotateCcw,
  ZapOff, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight, Award, MessageSquare, ExternalLink, Mail, MapPin, Phone
} from 'lucide-vue-next'
import CVPreview from './CVPreview.vue'

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
}

const emit = defineEmits(['switch-tab'])

const handleSave = () => {
  store.saveCV()
  emit('switch-tab', 'cvs')
}

const printCV = () => window.print()

const charCount = computed(() => {
  return store.currentJobDescription ? store.currentJobDescription.length : 0
})

const pasteExample = () => {
  store.currentJobDescription = "We are seeking a Senior Frontend Engineer to join our core product team. You will be responsible for architecting scalable UI systems using Vue 3, Vite, and Tailwind CSS. The ideal candidate has 5+ years of experience, a deep understanding of browser performance, and a passion for crafting elegant user experiences. Experience with TypeScript and RESTful APIs is a must."
}

const addExperience = () => {
  store.currentCV.experience.unshift({ title: '', company: '', date: '', bullets: [''] })
  expandedExp.value[0] = true
}
const removeExperience = (idx) => store.currentCV.experience.splice(idx, 1)
const addBullet = (expIdx) => store.currentCV.experience[expIdx].bullets.push('')
const removeBullet = (expIdx, bIdx) => store.currentCV.experience[expIdx].bullets.splice(bIdx, 1)

const addEducation = () => store.currentCV.education.push({ degree: '', school: '', date: '' })
const removeEducation = (idx) => store.currentCV.education.splice(idx, 1)

const addSkill = () => {
  if (newSkill.value.trim()) {
    store.currentCV.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}
const removeSkill = (idx) => store.currentCV.skills.splice(idx, 1)

const zoomIn = () => { if (zoomLevel.value < 150) zoomLevel.value += 10 }
const zoomOut = () => { if (zoomLevel.value > 50) zoomLevel.value -= 10 }
</script>

<template>
  <div class="h-full grid grid-cols-10 bg-slate-50 overflow-hidden font-sans">

    <!-- ====== LEFT PANEL (40%) ====== -->
    <div class="col-span-4 flex flex-col bg-white border-r border-slate-200 z-10 shadow-sm relative">
      
      <div class="relative sticky top-0 z-30 bg-white border-b border-slate-200">
        <div class="group relative flex items-center px-2">
          <button @click="scrollTabs('left')" class="btn btn-ghost btn-xs btn-square rounded-full shrink-0 h-8 w-8 text-slate-400">
            <ChevronLeft class="w-4 h-4" />
          </button>

          <div ref="tabScrollArea" class="flex-1 flex items-center gap-1 p-2 overflow-x-auto no-scrollbar">
            <button 
              v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              :class="['flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all', 
                       activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:text-slate-900']"
            >
              <component :is="tab.icon" class="w-3.5 h-3.5" />
              {{ tab.label }}
            </button>
          </div>

          <button @click="scrollTabs('right')" class="btn btn-ghost btn-xs btn-square rounded-full shrink-0 h-8 w-8 text-slate-400">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
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
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                   <button @click="isExpertMode = !isExpertMode" 
                           :class="['btn btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest gap-2', 
                                    isExpertMode ? 'btn-neutral text-white' : 'btn-ghost border-slate-200 text-slate-400']">
                      <Zap v-if="isExpertMode" class="w-3 h-3 text-amber-400" />
                      <ZapOff v-else class="w-3 h-3" />
                      Expert Mode
                   </button>
                   <button @click="pasteExample" class="btn btn-ghost btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                     Paste Example
                   </button>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-3">
                <div class="form-control">
                  <span class="label-text font-black text-[9px] uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Level</span>
                  <select v-model="store.tailoringOptions.level" class="select select-bordered select-sm w-full rounded-xl bg-slate-50 font-bold text-[10px] uppercase">
                    <option>Junior</option>
                    <option>Mid-level</option>
                    <option>Senior</option>
                    <option>Executive</option>
                  </select>
                </div>
                <div class="form-control">
                  <span class="label-text font-black text-[9px] uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Tone</span>
                  <select v-model="store.tailoringOptions.tone" class="select select-bordered select-sm w-full rounded-xl bg-slate-50 font-bold text-[10px] uppercase">
                    <option>Professional</option>
                    <option>Creative</option>
                    <option>Minimalist</option>
                    <option>Impactful</option>
                  </select>
                </div>
                <div class="form-control">
                  <span class="label-text font-black text-[9px] uppercase tracking-widest text-slate-400 mb-1.5 ml-1">Output</span>
                  <select v-model="store.tailoringOptions.language" class="select select-bordered select-sm w-full rounded-xl bg-slate-50 font-bold text-[10px] uppercase">
                    <option>English</option>
                    <option>Uzbek</option>
                    <option>Russian</option>
                  </select>
                </div>
              </div>

              <div class="relative group">
                <textarea
                  v-model="store.currentJobDescription"
                  class="textarea textarea-bordered w-full h-72 rounded-3xl bg-slate-50/50 border-slate-200 focus:border-indigo-500 focus:bg-white text-sm font-medium leading-relaxed p-6"
                  placeholder="Paste the target job description here..."
                ></textarea>
              </div>

              <button @click="handleGenerate" :disabled="store.isGenerating || !store.currentJobDescription"
                      class="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black uppercase text-sm tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all">
                <Loader2 v-if="store.isGenerating" class="w-5 h-5 animate-spin" />
                <template v-else>
                  <Sparkles class="w-5 h-5" />
                  <span>Generate AI CV</span>
                </template>
              </button>

              <div v-if="store.currentCV.matchScore > 0" class="pt-8 space-y-6">
                 <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-100">
                    <div class="flex items-end justify-between mb-6">
                       <div>
                         <h4 class="text-xl font-black text-slate-800">Job Match Score</h4>
                       </div>
                       <div class="text-4xl font-black text-indigo-600 tracking-tighter">{{ store.currentCV.matchScore }}%</div>
                    </div>
                    <div class="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6 flex">
                       <div class="h-full bg-indigo-600 rounded-full" :style="{ width: store.currentCV.matchScore + '%' }"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                       <div class="p-4 rounded-2xl bg-slate-50">
                          <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Keywords Match</p>
                          <p class="text-lg font-black text-slate-800">{{ store.currentCV.keywords.length }} Matched</p>
                       </div>
                       <div class="p-4 rounded-2xl bg-emerald-50">
                          <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Status</p>
                          <p class="text-lg font-black text-emerald-700">Ready</p>
                       </div>
                    </div>
                 </div>
              </div>
              <div v-else class="flex gap-4 p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100/50">
                 <Info class="w-5 h-5 text-indigo-500 shrink-0" />
                 <p class="text-[11px] text-indigo-900/60 font-medium leading-relaxed">Our AI automatically detects key industry terms to maximize visibility in Applicant Tracking Systems (ATS).</p>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
           <div class="animate-in slide-in-from-right-10 fade-in duration-500">
              <div class="flex items-center justify-between mb-8">
                 <h2 class="text-2xl font-black text-slate-800 tracking-tighter uppercase">{{ tabs.find(t => t.id === activeTab).label }} Settings</h2>
                 <button @click="activeTab = 'ai'" class="btn btn-ghost btn-sm rounded-xl text-slate-400 hover:text-indigo-600 gap-2 font-bold text-[10px] uppercase">
                    <Zap class="w-3.5 h-3.5" /> Back to AI
                 </button>
              </div>

              <div class="space-y-6">
                 <div v-if="activeTab === 'personal'" class="space-y-4">
                    <div v-for="field in [
                      { key: 'fullName',  label: 'Full Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'location', label: 'Location' }
                    ]" :key="field.key" class="form-control">
                      <label class="label mb-1.5"><span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">{{ field.label }}</span></label>
                      <input v-model="store.currentCV.personalInfo[field.key]" type="text" class="input input-bordered w-full rounded-2xl bg-slate-50" />
                    </div>
                 </div>

                 <div v-if="activeTab === 'experience'" class="space-y-6">
                    <button @click="addExperience" class="btn btn-neutral w-full rounded-2xl gap-3 font-black uppercase text-xs tracking-widest">
                       <Plus class="w-4 h-4" /> Add Experience
                    </button>
                    <div v-for="(exp, idx) in store.currentCV.experience" :key="idx" class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4 relative">
                       <button @click="removeExperience(idx)" class="absolute top-4 right-4 text-slate-300 hover:text-rose-500">
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
                             <textarea v-model="exp.bullets[bIdx]" class="textarea textarea-bordered textarea-sm flex-1 rounded-xl text-[11px]"></textarea>
                             <button @click="removeBullet(idx, bIdx)" class="btn btn-ghost btn-xs btn-square text-rose-500 mt-1"><Trash2 class="w-3 h-3" /></button>
                          </div>
                          <button @click="addBullet(idx)" class="btn btn-ghost btn-xs text-indigo-600 font-bold uppercase text-[9px] tracking-widest">+ Add Bullet</button>
                       </div>
                    </div>
                 </div>

                 <div v-if="activeTab === 'summary'" class="space-y-4">
                    <div class="form-control">
                      <label class="label p-0 mb-3"><span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">Summary</span></label>
                      <textarea v-model="store.currentCV.summary" class="textarea textarea-bordered bg-slate-50/50 h-64 w-full rounded-2xl p-6 text-sm"></textarea>
                    </div>
                 </div>

                 <div v-if="activeTab === 'skills'" class="space-y-6">
                    <div class="flex gap-2">
                       <input v-model="newSkill" @keydown.enter.prevent="addSkill" type="text" placeholder="Add Skill..." class="input input-bordered flex-1 rounded-2xl bg-slate-50 font-bold text-[10px]" />
                       <button @click="addSkill" class="btn btn-neutral btn-square rounded-2xl"><Plus class="w-5 h-5" /></button>
                    </div>
                    <div class="flex flex-wrap gap-2">
                       <div v-for="(skill, idx) in store.currentCV.skills" :key="idx" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                          <span class="text-[10px] font-bold uppercase">{{ skill }}</span>
                          <button @click="removeSkill(idx)" class="text-rose-500"><Trash2 class="w-3.5 h-3.5" /></button>
                       </div>
                    </div>
                 </div>

                 <div v-if="activeTab === 'education'" class="space-y-6">
                    <button @click="addEducation" class="btn btn-neutral w-full rounded-2xl gap-3 font-black uppercase text-xs tracking-widest">
                       <Plus class="w-4 h-4" /> Add Education
                    </button>
                    <div v-for="(edu, idx) in store.currentCV.education" :key="idx" class="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 relative">
                       <button @click="removeEducation(idx)" class="absolute top-4 right-4 text-rose-500"><Trash2 class="w-4 h-4" /></button>
                       <div class="form-control">
                          <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Degree</span></label>
                          <input v-model="edu.degree" type="text" class="input input-bordered w-full rounded-xl" />
                       </div>
                       <div class="form-control">
                          <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">School</span></label>
                          <input v-model="edu.school" type="text" class="input input-bordered w-full rounded-xl" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </template>
      </div>
    </div>

    <!-- ====== RIGHT PANEL: Preview ====== -->
    <div class="col-span-6 flex flex-col bg-slate-50 relative overflow-hidden">
      <div class="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
        <div class="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200">
           <button @click="zoomOut" class="btn btn-ghost btn-xs btn-square rounded-xl text-slate-500"><ZoomOut class="w-3.5 h-3.5" /></button>
           <span class="text-[10px] font-black text-slate-700 w-12 text-center uppercase tracking-tighter">{{ zoomLevel }}%</span>
           <button @click="zoomIn" class="btn btn-ghost btn-xs btn-square rounded-xl text-slate-500"><ZoomIn class="w-3.5 h-3.5" /></button>
        </div>
        <div class="flex items-center gap-3">
           <button @click="handleSave" class="btn btn-ghost btn-sm rounded-xl text-emerald-600 font-black uppercase text-[10px]">
              <Check class="w-4 h-4" /> Save
           </button>
           <button @click="printCV" class="btn btn-primary px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest">
              <Download class="w-4 h-4 mr-2" /> Export PDF
           </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-20 flex justify-center custom-scrollbar">
         <div :style="{ transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center' }" class="transition-transform duration-300">
            <div class="bg-white shadow-2xl rounded-sm border border-slate-100 overflow-hidden cv-print-container">
               <CVPreview />
            </div>
         </div>
         <div class="fixed bottom-10 right-10 flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-2xl shadow-2xl z-20 print:hidden">
            <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-widest text-white opacity-80">Live Canvas Active</span>
         </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 100px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@media print {
  body * { visibility: hidden; }
  .cv-print-container, .cv-print-container * {
    visibility: visible !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .cv-print-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 210mm; /* A4 width */
    height: 297mm; /* A4 height */
    margin: 0;
    padding: 0;
    background: white !important;
    transform: none !important;
    box-shadow: none !important;
    border: none !important;
  }
  @page {
    margin: 0;
    size: A4;
  }
}
</style>
