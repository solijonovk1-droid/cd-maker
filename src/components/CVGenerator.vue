<script setup>
import { ref, computed, provide } from 'vue'
import { useCvStore } from '../stores/cvStore'
import { useAuthStore } from '../stores/authStore'
import {
  Sparkles, Loader2, Download, Check, User, FileText, Briefcase,
  GraduationCap, Plus, Trash2, Zap, Wand2, Search, Info, RotateCcw,
  ZapOff, ZoomIn, ZoomOut, Maximize2, Minimize2, ChevronLeft, ChevronRight, Award, MessageSquare, ExternalLink, Mail, MapPin, Phone,
  LayoutTemplate
} from 'lucide-vue-next'
import CVPreview from './CVPreview.vue'

const store = useCvStore()
const authStore = useAuthStore()
const activeTab = ref('ai') // ai | personal | summary | experience | skills | education
const expandedExp = ref({})
const newSkill = ref('')
const isExpertMode = ref(false)
const zoomLevel = ref(100)
const isFullscreen = ref(false)
const tabScrollArea = ref(null)
const photoInput = ref(null)
const showUpgradeModal = ref(false)
const previewPanel = ref(null)


provide('setActiveTab', (tabId) => {
  activeTab.value = tabId
})

const handlePhotoUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      store.currentCV.personalInfo.photo = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

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
  { id: 'projects',   icon: Zap,            label: 'Projects' },
  { id: 'skills',     icon: Check,          label: 'Skills' },
  { id: 'education',  icon: GraduationCap,  label: 'Academic' },
  { id: 'certs',      icon: Award,          label: 'Certs' },
  { id: 'languages',  icon: MessageSquare,  label: 'Langs' },
  { id: 'interests',  icon: Sparkles,       label: 'Interests' },
  { id: 'labels',     icon: Search,         label: 'Labels' },
]

const handleGenerate = async () => {
  if (!store.currentJobDescription) return
  
  if (authStore.userPlan === 'Free' && store.generationCount >= 3) {
    showUpgradeModal.value = true
    return
  }
  
  await store.generateCV()
}

const emit = defineEmits(['switch-tab'])
const isSaving = ref(false)

const handleSave = async () => {
  isSaving.value = true
  store.saveCV()
  await new Promise(resolve => setTimeout(resolve, 800))
  isSaving.value = false
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
const addCert = () => {
  if (newCert.value.trim()) {
    store.currentCV.certifications.push(newCert.value.trim())
    newCert.value = ''
  }
}
const addInterest = () => {
  if (newInterest.value.trim()) {
    store.currentCV.interests.push(newInterest.value.trim())
    newInterest.value = ''
  }
}
const removeSkill = (idx) => store.currentCV.skills.splice(idx, 1)

const zoomIn = () => { if (zoomLevel.value < 150) zoomLevel.value += 10 }
const zoomOut = () => { if (zoomLevel.value > 50) zoomLevel.value -= 10 }

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    if (previewPanel.value) {
      await previewPanel.value.requestFullscreen().catch(err => console.log(err))
      isFullscreen.value = true
    }
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  }
}

// listen to ESC key exit
document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = !!document.fullscreenElement
})
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
                   <button @click="authStore.userPlan === 'Free' ? showUpgradeModal = true : isExpertMode = !isExpertMode" 
                           :class="['btn btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest gap-2', 
                                    isExpertMode ? 'btn-neutral text-white' : 'btn-ghost border-slate-200 text-slate-400']">
                      <Zap v-if="isExpertMode" class="w-3 h-3 text-amber-400" />
                      <ZapOff v-else class="w-3 h-3" />
                      Expert Mode <span v-if="authStore.userPlan === 'Free'" class="text-[8px] bg-slate-200 px-1 ml-1 rounded">PRO</span>
                   </button>
                   <button @click="pasteExample" class="btn btn-ghost btn-sm rounded-xl font-black text-[10px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
                     Paste Example
                   </button>
                </div>
              </div>

              <div v-if="isExpertMode" class="grid grid-cols-3 gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
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
                    <!-- Photo Upload Section -->
                    <div class="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-300 group hover:border-indigo-400 transition-all">
                      <div class="relative group cursor-pointer" @click="photoInput.click()">
                        <div class="w-24 h-24 rounded-3xl overflow-hidden bg-slate-200 shadow-xl border-4 border-white group-hover:scale-105 transition-transform">
                          <img v-if="store.currentCV.personalInfo.photo" :src="store.currentCV.personalInfo.photo" class="w-full h-full object-cover" />
                          <div v-else class="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-200">
                             <User class="w-10 h-10" />
                          </div>
                        </div>
                        <div class="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                           <RotateCcw class="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <input type="file" ref="photoInput" @change="handlePhotoUpload" class="hidden" accept="image/*" />
                      <div class="text-center">
                        <p class="text-[10px] font-black uppercase tracking-widest text-slate-800">Profile Photo</p>
                        <button v-if="store.currentCV.personalInfo.photo" @click="store.currentCV.personalInfo.photo = ''" class="text-[9px] font-bold text-rose-500 uppercase mt-1">Remove photo</button>
                      </div>
                    </div>

                    <div v-for="field in [
                      { key: 'fullName',  label: 'Full Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }, { key: 'location', label: 'Location' }, { key: 'linkedin', label: 'LinkedIn' }
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

                  <div v-if="activeTab === 'projects'" class="space-y-6">
                     <button @click="store.currentCV.projects.unshift({ name: '', description: '', link: '' })" class="btn btn-neutral w-full rounded-2xl gap-3 font-black uppercase text-xs tracking-widest">
                        <Plus class="w-4 h-4" /> Add Project
                     </button>
                     <div v-for="(project, idx) in store.currentCV.projects" :key="idx" class="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 relative">
                        <button @click="store.currentCV.projects.splice(idx, 1)" class="absolute top-4 right-4 text-rose-500"><Trash2 class="w-4 h-4" /> </button>
                        <div class="form-control">
                           <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Project Name</span></label>
                           <input v-model="project.name" type="text" class="input input-bordered w-full rounded-xl font-black" />
                        </div>
                        <div class="form-control">
                           <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">Description</span></label>
                           <textarea v-model="project.description" class="textarea textarea-bordered w-full rounded-xl text-xs"></textarea>
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

                  <div v-if="activeTab === 'certs'" class="space-y-6">
                     <div class="flex gap-2">
                        <input v-model="newCert" @keydown.enter.prevent="addCert" type="text" placeholder="Add Certification..." class="input input-bordered flex-1 rounded-2xl bg-slate-50 font-bold text-[10px]" />
                        <button @click="addCert" class="btn btn-neutral btn-square rounded-2xl"><Plus class="w-5 h-5" /></button>
                     </div>
                     <div class="flex flex-wrap gap-2">
                        <div v-for="(cert, idx) in store.currentCV.certifications" :key="idx" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                           <span class="text-[10px] font-bold uppercase">{{ cert }}</span>
                           <button @click="store.currentCV.certifications.splice(idx, 1)" class="text-rose-500"><Trash2 class="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                  </div>

                  <div v-if="activeTab === 'languages'" class="space-y-6">
                     <button @click="store.currentCV.languages.push('')" class="btn btn-neutral w-full rounded-2xl gap-3 font-black uppercase text-xs tracking-widest">
                        <Plus class="w-4 h-4" /> Add Language
                     </button>
                     <div v-for="(lang, idx) in store.currentCV.languages" :key="idx" class="flex gap-2">
                        <input v-model="store.currentCV.languages[idx]" type="text" placeholder="e.g. English (Fluent)" class="input input-bordered flex-1 rounded-xl font-bold" />
                        <button @click="store.currentCV.languages.splice(idx, 1)" class="btn btn-ghost text-rose-500"><Trash2 class="w-4 h-4" /></button>
                     </div>
                  </div>

                  <div v-if="activeTab === 'interests'" class="space-y-6">
                     <div class="flex gap-2">
                        <input v-model="newInterest" @keydown.enter.prevent="addInterest" type="text" placeholder="Add Interest..." class="input input-bordered flex-1 rounded-2xl bg-slate-50 font-bold text-[10px]" />
                        <button @click="addInterest" class="btn btn-neutral btn-square rounded-2xl"><Plus class="w-5 h-5" /></button>
                     </div>
                     <div class="flex flex-wrap gap-2">
                        <div v-for="(interest, idx) in store.currentCV.interests" :key="idx" class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                           <span class="text-[10px] font-bold uppercase">{{ interest }}</span>
                           <button @click="store.currentCV.interests.splice(idx, 1)" class="text-rose-500"><Trash2 class="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                  </div>

                 <div v-if="activeTab === 'labels'" class="space-y-6 animate-in fade-in duration-500">
                    <div class="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50 mb-4">
                       <p class="text-[10px] text-indigo-900/60 font-medium leading-relaxed uppercase tracking-widest">Customize section headings to match your preference or language.</p>
                    </div>
                    <div class="grid grid-cols-1 gap-4">
                       <div v-for="(val, key) in store.currentCV.labels" :key="key" class="form-control">
                          <label class="label p-0 mb-1.5"><span class="label-text text-[9px] font-black uppercase tracking-widest text-slate-400">{{ key }}</span></label>
                          <input v-model="store.currentCV.labels[key]" type="text" class="input input-bordered w-full rounded-xl bg-slate-50 font-bold" />
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </template>
      </div>
    </div>

    <!-- ====== RIGHT PANEL: Preview (60%) ====== -->
    <div ref="previewPanel" class="col-span-6 flex flex-col bg-slate-50 relative overflow-hidden">
      
      <!-- Preview Header Toolbar -->
      <div class="flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 sticky top-0 shadow-sm print:hidden">
        <div class="flex items-center gap-6">
          <div class="flex items-center bg-slate-100 rounded-2xl p-1 gap-1 border border-slate-200">
             <button @click="zoomOut" class="btn btn-ghost btn-xs btn-square rounded-xl text-slate-500"><ZoomOut class="w-3.5 h-3.5" /></button>
             <span class="text-[10px] font-black text-slate-700 w-12 text-center uppercase tracking-tighter">{{ zoomLevel }}%</span>
             <button @click="zoomIn" class="btn btn-ghost btn-xs btn-square rounded-xl text-slate-500"><ZoomIn class="w-3.5 h-3.5" /></button>
          </div>
        </div>
        <div class="flex items-center gap-3">
           <button @click="emit('switch-tab', 'templates')" class="btn btn-ghost btn-sm rounded-xl text-indigo-600 hover:bg-indigo-50 gap-2 font-black uppercase text-[10px] tracking-widest">
              <LayoutTemplate class="w-4 h-4" /> Change Template
           </button>

           <button @click="handleSave" :disabled="isSaving" class="btn btn-ghost btn-sm rounded-xl text-emerald-600 hover:bg-emerald-50 gap-2 font-black uppercase text-[10px] tracking-widest disabled:bg-transparent disabled:text-emerald-600/50">
              <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
              <Check v-else class="w-4 h-4" /> Save to Library
           </button>
           <button @click="toggleFullscreen" class="btn btn-ghost btn-sm rounded-xl text-slate-500 hover:text-slate-800">
              <Minimize2 v-if="isFullscreen" class="w-4 h-4" />
              <Maximize2 v-else class="w-4 h-4" />
           </button>
           <button @click="printCV" class="group relative inline-flex items-center justify-center px-8 py-2.5 font-bold text-white bg-indigo-600 rounded-2xl overflow-hidden hover:scale-105 transition-all shadow-xl shadow-indigo-200">
              <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <Download class="w-4 h-4 mr-2" />
              <span class="text-[11px] uppercase tracking-widest font-black leading-none pt-0.5">Export PDF</span>
           </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-20 flex justify-center custom-scrollbar">
         <div :style="{ transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center' }" class="transition-transform duration-300 cv-zoom-wrapper">
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

    <!-- ====== UPGRADE MODAL ====== -->
    <div v-if="showUpgradeModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
       <div class="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
          <div class="text-center mb-8">
             <div class="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <Zap class="w-10 h-10 fill-indigo-600" />
             </div>
             <h3 class="text-3xl font-black text-slate-900 uppercase tracking-tighter">Limit Reached!</h3>
             <p class="text-slate-500 font-medium text-sm mt-4 leading-relaxed">
                You've used all <span class="text-indigo-600 font-black">3 free AI generations</span>. 
                Upgrade to Pro to unlock unlimited tailoring and premium templates.
             </p>
          </div>
 
          <div class="space-y-4">
             <button @click="emit('switch-tab', 'settings'); showUpgradeModal = false" class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3">
                <Zap class="w-4 h-4" /> Upgrade to Pro
             </button>
             <button @click="showUpgradeModal = false" class="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">
                Maybe Later
             </button>
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
  @page {
    margin: 0;
    size: A4;
  }
  body, html {
    margin: 0 !important;
    padding: 0 !important;
    height: auto !important;
    background: white !important;
  }
  body * {
    visibility: hidden !important;
  }
  .cv-print-container, .cv-print-container * {
    visibility: visible !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  .cv-zoom-wrapper {
    transform: none !important;
    padding: 0 !important;
    margin: 0 !important;
    display: block !important;
  }
  .cv-print-container {
    visibility: visible !important;
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 210mm !important;
    min-height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    transform: none !important;
    box-shadow: none !important;
    border: none !important;
    z-index: 9999 !important;
    background: white !important;
  }
}
</style>
