<script setup>
import { useRouter } from 'vue-router'
import { FileText, LayoutTemplate, Settings, LogOut, Menu, Zap, Check, Plus, Search, Download, MoreVertical, Clock, Eye, Lock, Loader2 } from 'lucide-vue-next'
import CVGenerator from '../components/CVGenerator.vue'
import CvMakerLogo from '../components/CvMakerLogo.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useCvStore } from '../stores/cvStore'

const cvStore = useCvStore()
const router = useRouter()
const authStore = useAuthStore()
const currentTab = ref('cv-builder')
const showSuccess = ref(false)
const showPaymentModal = ref(false)
const showProfileModal = ref(false)
const selectedPlanToUpgrade = ref(null)
const upgradedPlan = ref('')
const activeSettingsTab = ref('profile') // profile | billing

const profileName = ref('')
const profileEmail = ref('')
const isUpdatingProfile = ref(false)

const openProfileEditor = () => {
  profileName.value = authStore.user?.user_metadata?.full_name || authStore.user?.email.split('@')[0] || ''
  profileEmail.value = authStore.user?.email || ''
  showProfileModal.value = true
}

const handleProfileUpdate = async () => {
  try {
    isUpdatingProfile.value = true
    await authStore.updateProfile(profileName.value, profileEmail.value)
    showProfileModal.value = false
    // Trigger toast
    showSuccess.value = true
    setTimeout(() => { showSuccess.value = false }, 3000)
  } catch (error) {
    console.error(error)
  } finally {
    isUpdatingProfile.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handlePlanUpgrade = (plan) => {
  if (plan.name === authStore.userPlan) return
  if (plan.name === 'Free') {
    authStore.updatePlan('Free')
    return
  }
  
  // Auto-upgrade bypasses modal for now
  authStore.updatePlan(plan.name)
  upgradedPlan.value = plan.name
  showSuccess.value = true
  
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const confirmPayment = () => {
  const planName = selectedPlanToUpgrade.value.name
  authStore.updatePlan(planName)
  upgradedPlan.value = planName
  showPaymentModal.value = false
  showSuccess.value = true
  
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

const sidebarItems = [
  { id: 'cv-builder', icon: Zap, label: 'AI Tailor' },
  { id: 'cvs',         icon: FileText, label: 'My CVs' },
  { id: 'templates',  icon: LayoutTemplate, label: 'Templates' },
  { id: 'settings',   icon: Settings, label: 'Settings' },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out our services.',
    features: ['3 AI Generations', 'Basic Templates', 'PDF Export'],
    buttonText: 'Current Plan',
    popular: false
  },
  {
    name: 'Pro',
    price: '$20',
    description: 'For job seekers who want an edge.',
    features: ['Unlimited Generations', 'AI ATS Optimization', 'Premium Templates', 'Priority Support'],
    buttonText: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Premium',
    price: '$50',
    description: 'The ultimate toolkit for professionals.',
    features: ['Everything in Pro', 'Expert Review', 'Custom Domain', 'Personal Job Butler'],
    buttonText: 'Buy Premium',
    popular: false
  }
]

const searchQuery = ref('')
const mockCvs = computed(() => cvStore.cvs)

const selectedCv = ref(null)

const openCv = (cv) => {
  selectedCv.value = cv
  currentTab.value = 'cv-builder'
}

const filteredCvs = computed(() => {
  if (!searchQuery.value) return mockCvs.value
  return mockCvs.value.filter(cv => 
    cv.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleTemplateSelect = (template) => {
  if (template.premium && authStore.userPlan === 'Free') {
    selectedPlanToUpgrade.value = plans.find(p => p.name === 'Pro')
    showPaymentModal.value = true
    return
  }
  
  cvStore.selectedTemplate = template.id
  currentTab.value = 'cv-builder'
}

onMounted(() => {
  if (authStore.user) {
    cvStore.syncWithUser(authStore.user)
  }
})

watch(() => authStore.user, (newUser) => {
  if (newUser) {
    cvStore.syncWithUser(newUser)
  }
}, { immediate: true })
</script>

<template>
  <div class="drawer lg:drawer-open h-screen bg-slate-50 overflow-hidden font-sans">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
    
    <!-- Page Content -->
    <div class="drawer-content flex flex-col h-full overflow-hidden">
      <!-- Mobile Navbar -->
      <div class="navbar bg-white border-b border-slate-200 lg:hidden shadow-sm flex-none z-30 px-4">
        <div class="flex-none">
          <label for="my-drawer-2" class="btn btn-square btn-ghost drawer-button">
            <Menu class="w-5 h-5" />
          </label>
        </div>
        <div class="flex-1 px-2">
          <CvMakerLogo size="sm" />
        </div>
      </div>

      <!-- Main Body -->
      <main class="flex-1 overflow-y-auto relative custom-scrollbar">
        <CVGenerator v-if="currentTab === 'cv-builder'" @switch-tab="(tab) => currentTab = tab" />
        
        <div v-else-if="currentTab === 'cvs'" class="min-h-full p-8 lg:p-12 bg-slate-50">
          <div class="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <!-- Header & Search -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h1 class="text-4xl font-black text-slate-900 mb-3 tracking-tight uppercase">My CVs</h1>
                <p class="text-slate-500 font-medium">Manage and optimize your professional resumes.</p>
              </div>
              
              <div class="relative w-full md:w-80">
                <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Search your resumes..." 
                  class="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all outline-none text-sm font-medium"
                />
              </div>
            </div>

            <!-- CV Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <!-- Create New Card -->
              <div 
                v-if="authStore.userPlan !== 'Free' || mockCvs.length < 5"
                @click="cvStore.clearCurrentCV(); currentTab = 'cv-builder'"
                class="group relative flex flex-col items-center justify-center p-8 bg-dashed border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-500 cursor-pointer h-[320px]"
              >
                <div class="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-500 mb-6 group-hover:scale-110 group-hover:rotate-12">
                  <Plus class="w-8 h-8" />
                </div>
                <span class="font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest text-xs">Create New CV</span>
              </div>

              <!-- CV Cards -->
              <div 
                v-for="cv in filteredCvs" 
                :key="cv.id"
                @click="openCv(cv)"
                class="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col h-[320px] cursor-pointer"
              >
                <!-- Card Preview Area (Mock Image) -->
                <div class="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <div class="w-24 h-32 bg-white rounded-lg shadow-sm border border-slate-100 p-3 space-y-2 group-hover:scale-110 transition-transform duration-500">
                    <div class="h-1.5 w-1/2 bg-slate-100 rounded"></div>
                    <div class="h-1.5 w-full bg-slate-50 rounded"></div>
                    <div class="h-1.5 w-full bg-slate-50 rounded"></div>
                    <div class="h-1.5 w-3/4 bg-slate-50 rounded"></div>
                  </div>
                  
                  <!-- Hover Overlay -->
                  <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button @click.stop="openCv(cv)" class="p-3 bg-white rounded-xl text-slate-900 hover:scale-110 active:scale-95 transition-all shadow-xl">
                      <Eye class="w-5 h-5" />
                    </button>
                    <button @click.stop class="p-3 bg-indigo-600 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                      <Download class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- Card Info -->
                <div class="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <span :class="[
                        'px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest',
                        cv.status === 'Ready' ? 'bg-green-100 text-green-600' : 
                        cv.status === 'Draft' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                      ]">
                        {{ cv.status }}
                      </span>
                      <button class="text-slate-300 hover:text-slate-600">
                        <MoreVertical class="w-4 h-4" />
                      </button>
                    </div>
                    <h3 class="font-bold text-slate-900 truncate">{{ cv.title }}</h3>
                  </div>

                  <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <div class="flex items-center gap-1.5">
                      <Clock class="w-3.5 h-3.5" />
                      <span>{{ cv.lastModified }}</span>
                    </div>
                    <span>{{ cv.template }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'templates'" class="min-h-full p-8 lg:p-12 bg-slate-50">
          <div class="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <!-- Header -->
            <div class="text-center mb-16">
              <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Premium Templates</h1>
              <p class="text-slate-500 font-medium max-w-2xl mx-auto">Choose from our curated collection of high-converting resume designs. Optimized for both ATS and human eyes.</p>
            </div>

            <!-- Templates Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <div 
                v-for="tpl in cvStore.templates" 
                :key="tpl.id"
                @click="handleTemplateSelect(tpl)"
                :class="[
                  'group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 transition-all duration-500 cursor-pointer',
                  tpl.premium && authStore.userPlan === 'Free' ? '' : 'hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-2'
                ]"
              >
                <!-- Dynamic CSS Preview Area -->
                <div class="aspect-[3/4] relative overflow-hidden" :style="{ background: tpl.bg }">

                  <!-- LAYOUT: minimal -->
                  <div v-if="tpl.layout === 'minimal'" class="absolute inset-0 p-4 flex flex-col transition-transform duration-700"
                    :class="tpl.premium && authStore.userPlan === 'Free' ? 'blur-sm grayscale' : 'group-hover:scale-105'">
                    <!-- Header -->
                    <div class="text-center mb-3">
                      <div class="text-[11px] font-black uppercase tracking-widest" :style="{ color: tpl.color }">Daniel Weber</div>
                      <div class="text-[5px] font-bold uppercase tracking-wider mt-0.5" :style="{ color: tpl.accent }">Senior Software Engineer</div>
                      <div class="text-[4px] text-slate-400 mt-0.5 font-medium">New York, NY • daniel@example.com • +1 234 567 890</div>
                    </div>
                    
                    <!-- Content -->
                    <div class="text-[5px] font-bold uppercase border-b pb-0.5 mb-1.5" :style="{ color: tpl.accent, borderColor: tpl.accent }">Professional Summary</div>
                    <div class="text-[4px] leading-[6px] text-slate-600 mb-2 font-medium">Results-driven Software Engineer with 5+ years of experience developing scalable web applications. Proficient in modern JavaScript frameworks and cloud architectures. Passionate about writing clean, maintainable code and solving complex technical challenges.</div>
                    
                    <div class="text-[5px] font-bold uppercase border-b pb-0.5 mb-1.5 mt-1" :style="{ color: tpl.accent, borderColor: tpl.accent }">Work Experience</div>
                    <div class="mb-1.5">
                      <div class="flex justify-between items-end">
                        <div class="text-[4.5px] font-bold text-slate-800">Tech Lead - InnovateCorp</div>
                        <div class="text-[4px] text-slate-400 font-bold">2021 - Present</div>
                      </div>
                      <ul class="list-disc pl-2 mt-0.5 space-y-0.5 text-[4px] leading-[5px] text-slate-600">
                        <li>Architected and implemented a microservices strategy reducing load time by 40%.</li>
                        <li>Mentored a team of 4 junior developers, increasing team velocity by 25%.</li>
                      </ul>
                    </div>
                    <div>
                      <div class="flex justify-between items-end">
                        <div class="text-[4.5px] font-bold text-slate-800">Frontend Dev - WebSolutions</div>
                        <div class="text-[4px] text-slate-400 font-bold">2018 - 2021</div>
                      </div>
                      <ul class="list-disc pl-2 mt-0.5 space-y-0.5 text-[4px] leading-[5px] text-slate-600">
                        <li>Developed responsive interfaces achieving 98% Lighthouse performance scores.</li>
                      </ul>
                    </div>
                    
                    <div class="text-[5px] font-bold uppercase border-b pb-0.5 mb-1.5 mt-2" :style="{ color: tpl.accent, borderColor: tpl.accent }">Skills</div>
                    <div class="flex flex-wrap gap-1">
                      <span class="text-[3.5px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">React.js</span>
                      <span class="text-[3.5px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">TypeScript</span>
                      <span class="text-[3.5px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">Node.js</span>
                      <span class="text-[3.5px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">Tailwind CSS</span>
                    </div>
                  </div>

                  <!-- LAYOUT: sidebar -->
                  <div v-else-if="tpl.layout === 'sidebar'" class="absolute inset-0 flex transition-transform duration-700"
                    :class="tpl.premium && authStore.userPlan === 'Free' ? 'blur-sm grayscale' : 'group-hover:scale-105'">
                    <!-- Sidebar -->
                    <div class="w-2/5 h-full p-2.5 flex flex-col items-center" :style="{ background: tpl.color }">
                      <div class="w-10 h-10 rounded-full mb-2 bg-white/20 border-2 text-white flex items-center justify-center text-[12px] font-black" :style="{ borderColor: tpl.accent }">DW</div>
                      <div class="text-[3.5px] text-white/70 text-center mb-3">daniel@example.com<br/>+1 234 567 890<br/>New York, NY</div>
                      
                      <div class="w-full text-left">
                        <div class="text-[4.5px] font-bold uppercase text-white mb-1 border-b border-white/20 pb-0.5">Education</div>
                        <div class="text-[4px] text-white/90 font-bold">BS Computer Science</div>
                        <div class="text-[3.5px] text-white/60 mb-2">MIT, 2014-2018</div>
                        
                        <div class="text-[4.5px] font-bold uppercase text-white mb-1 border-b border-white/20 pb-0.5 mt-2">Skills</div>
                        <div class="text-[3.5px] text-white/80 leading-[5px] font-medium">React.js<br/>Vue.js<br/>Node.js<br/>TypeScript<br/>AWS<br/>Docker</div>
                      </div>
                    </div>
                    
                    <!-- Main Content -->
                    <div class="flex-1 p-3 bg-white">
                      <div class="text-[14px] font-black uppercase tracking-tight text-slate-800 leading-none">Daniel</div>
                      <div class="text-[14px] font-black uppercase tracking-tight leading-none" :style="{ color: tpl.color }">Weber</div>
                      <div class="text-[4.5px] font-bold uppercase tracking-widest mt-1 mb-2" :style="{ color: tpl.accent }">Software Engineer</div>
                      
                      <div class="text-[4px] leading-[5.5px] text-slate-600 mb-3 font-medium">Innovative Software Engineer with 5+ years building performing, scalable user interfaces and backend architectures. Dedicated to clean code.</div>
                      
                      <div class="text-[5px] font-bold uppercase text-slate-800 mb-1 border-b border-slate-200 pb-0.5">Experience</div>
                      <div class="mb-2">
                        <div class="flex justify-between items-end">
                          <div class="text-[4.5px] font-bold text-slate-800">Tech Lead</div>
                          <div class="text-[3.5px] font-bold" :style="{ color: tpl.accent }">2021 - Present</div>
                        </div>
                        <div class="text-[4px] text-slate-500 mb-0.5 font-bold">InnovateCorp</div>
                        <ul class="list-disc pl-2 space-y-0.5 text-[4px] leading-[5px] text-slate-600">
                          <li>Led a team of 5 engineers to deliver key product features.</li>
                          <li>Optimized database queries, reducing response time by 50%.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div class="flex justify-between items-end">
                          <div class="text-[4.5px] font-bold text-slate-800">Frontend Dev</div>
                          <div class="text-[3.5px] font-bold" :style="{ color: tpl.accent }">2018 - 2021</div>
                        </div>
                        <div class="text-[4px] text-slate-500 mb-0.5 font-bold">WebSolutions</div>
                        <ul class="list-disc pl-2 space-y-0.5 text-[4px] leading-[5px] text-slate-600">
                          <li>Developed fully responsive SPAs.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- LAYOUT: bold -->
                  <div v-else-if="tpl.layout === 'bold'" class="absolute inset-0 flex flex-col transition-transform duration-700"
                    :class="tpl.premium && authStore.userPlan === 'Free' ? 'blur-sm grayscale' : 'group-hover:scale-105'">
                    <div class="h-1/3 flex flex-col items-center justify-center p-3 relative overflow-hidden" :style="{ background: tpl.color }">
                      <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20" :style="{ background: tpl.accent }"></div>
                      <div class="text-[12px] font-black uppercase tracking-widest text-white relative z-10">DANIEL WEBER</div>
                      <div class="text-[5px] font-bold uppercase tracking-widest mt-1 px-2 py-0.5 rounded-full text-white/90 relative z-10" :style="{ background: tpl.accent }">Creative Developer</div>
                    </div>
                    <div class="flex-1 p-3 flex flex-col gap-2 bg-white">
                      <!-- Contact -->
                      <div class="flex justify-center gap-2 mt-1 mb-2">
                        <div class="text-[3.5px] font-bold text-slate-500">daniel@example.com</div>
                        <div class="text-[3.5px] font-bold text-slate-300">•</div>
                        <div class="text-[3.5px] font-bold text-slate-500">+1 234 567 890</div>
                        <div class="text-[3.5px] font-bold text-slate-300">•</div>
                        <div class="text-[3.5px] font-bold text-slate-500">New York</div>
                      </div>
                      
                      <div class="text-[4.5px] font-bold uppercase rounded px-1.5 py-0.5 w-fit" :style="{ background: tpl.accent + '1A', color: tpl.color }">Profile</div>
                      <div class="text-[4px] leading-[5px] text-slate-600 mb-1 pl-1 font-medium">Creative and detail-oriented frontend developer with a passion for building interactive, visually stunning user experiences using modern web technologies.</div>
                      
                      <div class="text-[4.5px] font-bold uppercase rounded px-1.5 py-0.5 w-fit mt-1" :style="{ background: tpl.accent + '1A', color: tpl.color }">Experience</div>
                      <div class="pl-1">
                        <div class="flex justify-between items-baseline mb-0.5">
                          <div class="text-[4.5px] font-bold text-slate-800">Senior UI Engineer <span class="text-slate-400 font-normal">| StudioX</span></div>
                          <div class="text-[3.5px] font-bold" :style="{ color: tpl.accent }">2021 - Present</div>
                        </div>
                        <div class="text-[4px] leading-[5px] text-slate-600 mb-1.5 font-medium">Spearheaded the redesign of the core flagship application, introducing a custom design system that cut development time in half for future features.</div>
                        
                        <div class="flex justify-between items-baseline mb-0.5">
                          <div class="text-[4.5px] font-bold text-slate-800">Web Developer <span class="text-slate-400 font-normal">| AgencyY</span></div>
                          <div class="text-[3.5px] font-bold" :style="{ color: tpl.accent }">2019 - 2021</div>
                        </div>
                        <div class="text-[4px] leading-[5px] text-slate-600 font-medium">Built robust CMS integrations for high-profile clients.</div>
                      </div>
                    </div>
                  </div>

                  <!-- LAYOUT: split -->
                  <div v-else-if="tpl.layout === 'split'" class="absolute inset-0 flex flex-col transition-transform duration-700 bg-amber-50"
                    :class="tpl.premium && authStore.userPlan === 'Free' ? 'blur-sm grayscale' : 'group-hover:scale-105'">
                    <!-- Top dark area -->
                    <div class="h-[35%] p-4 flex flex-col justify-end" :style="{ background: tpl.color }">
                      <div class="text-[14px] font-serif font-black text-amber-50 uppercase tracking-widest leading-none">DANIEL</div>
                      <div class="text-[14px] font-serif font-black uppercase tracking-widest leading-none mb-1" :style="{ color: tpl.accent }">WEBER</div>
                      <div class="text-[5px] font-bold text-amber-100/70 tracking-[0.2em] uppercase">Executive Director of Engineering</div>
                    </div>
                    <!-- Bottom area with 2 cols -->
                    <div class="flex-1 px-4 py-3 grid grid-cols-12 gap-3 bg-amber-50/50">
                      <!-- Left Col -->
                      <div class="col-span-8 flex flex-col gap-2">
                        <div>
                          <div class="text-[5px] font-bold uppercase tracking-widest mb-1 border-b border-amber-900/10 pb-0.5" :style="{ color: tpl.color }">Career Highlights</div>
                          <div class="text-[4.5px] font-bold text-slate-900">VP of Engineering - AlphaTech</div>
                          <div class="text-[3.5px] font-bold text-amber-600 mb-0.5">2019 - Present</div>
                          <div class="text-[4px] leading-[5.5px] text-slate-700 font-serif">Directed an organization of 50+ engineers. Scaled infrastructure to handle 10x growth in user base over two years while maintaining 99.99% uptime. Managed $5M+ department budget.</div>
                        </div>
                        <div>
                          <div class="text-[4.5px] font-bold text-slate-900">Director of IT - BetaCorp</div>
                          <div class="text-[3.5px] font-bold text-amber-600 mb-0.5">2014 - 2019</div>
                          <div class="text-[4px] leading-[5.5px] text-slate-700 font-serif">Led digital transformation initiatives across global offices. Introduced Agile methodologies reducing time-to-market.</div>
                        </div>
                      </div>
                      
                      <!-- Right Col -->
                      <div class="col-span-4 flex flex-col gap-2">
                        <div>
                          <div class="text-[5px] font-bold uppercase tracking-widest mb-1 border-b border-amber-900/10 pb-0.5" :style="{ color: tpl.color }">Contact</div>
                          <div class="text-[3.5px] text-slate-700 font-bold leading-[5px]">daniel@exec.us<br/>+1 999 888 7777<br/>San Francisco, CA<br/>linkedin.com/in/dweber</div>
                        </div>
                        <div>
                          <div class="text-[5px] font-bold uppercase tracking-widest mb-1 border-b border-amber-900/10 pb-0.5 mt-1" :style="{ color: tpl.color }">Core Expertise</div>
                          <ul class="list-disc pl-1.5 text-[3.5px] text-slate-700 font-bold leading-[4.5px] space-y-0.5">
                            <li>Strategic Planning</li>
                            <li>Team Leadership</li>
                            <li>Cloud Architecture</li>
                            <li>Budget Management</li>
                            <li>Digital Growth</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Locked Overlay -->
                  <div v-if="tpl.premium && authStore.userPlan === 'Free'" class="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <div class="flex flex-col items-center gap-3">
                       <div class="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                          <Lock class="w-8 h-8 text-white" />
                       </div>
                       <span class="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-200">PRO Template</span>
                    </div>
                  </div>

                  <!-- Selected Badge -->
                  <div v-if="cvStore.selectedTemplate === tpl.id" class="absolute top-4 left-4 bg-emerald-500 text-white p-2 rounded-xl shadow-lg ring-4 ring-emerald-500/20">
                     <Check class="w-5 h-5" />
                  </div>

                  <!-- Hover Action -->
                  <div v-if="!(tpl.premium && authStore.userPlan === 'Free')" class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                     <button class="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Use Template
                     </button>
                  </div>
                </div>

                <!-- Template Info -->
                <div class="p-5 text-center border-t border-slate-100">
                   <div class="flex items-center justify-center gap-2 mb-1.5">
                     <div class="w-3 h-3 rounded-full border-2" :style="{ background: tpl.accent, borderColor: tpl.color }"></div>
                     <h3 class="font-black text-slate-900 uppercase tracking-tight text-sm">{{ tpl.name }}</h3>
                   </div>
                   <div class="flex items-center justify-center gap-2">
                      <span v-if="tpl.premium" class="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Premium</span>
                      <span v-else class="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Free</span>
                   </div>
                </div>
              </div>
            </div>
            
            <!-- Upgrade Section (Sticky at bottom for free users) -->
            <div v-if="authStore.userPlan === 'Free'" class="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
               <div class="absolute -top-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
               <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                  <div>
                     <h2 class="text-4xl font-black mb-4 tracking-tighter">Ready to unlock everything?</h2>
                     <p class="text-slate-400 font-medium text-lg">Get access to all 20+ professional templates and AI-powered ATS optimization.</p>
                  </div>
                  <button @click="currentTab = 'settings'" class="px-12 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-indigo-500/20 whitespace-nowrap">
                     Unlock Premium Now
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'settings'" class="min-h-full p-8 lg:p-12 bg-slate-50">
          <div class="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <!-- Settings Navigation -->
            <div class="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm w-fit mb-12">
               <button 
                 @click="activeSettingsTab = 'profile'"
                 :class="['px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all', 
                          activeSettingsTab === 'profile' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50']"
               >
                 Profile
               </button>
               <button 
                 @click="activeSettingsTab = 'billing'"
                 :class="['px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all', 
                          activeSettingsTab === 'billing' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50']"
               >
                 Subscription
               </button>
            </div>

            <template v-if="activeSettingsTab === 'profile'">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <!-- Profile Summary -->
                <div class="lg:col-span-1">
                   <h2 class="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Account Details</h2>
                   <p class="text-slate-500 font-medium leading-relaxed">View and update your personal information and account security settings.</p>
                </div>

                <!-- Profile Form Card -->
                <div class="lg:col-span-2">
                   <div class="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-xl shadow-slate-200/50">
                      <div class="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
                         <div class="avatar placeholder">
                            <div class="bg-indigo-600 text-white rounded-3xl w-24 h-24 shadow-2xl shadow-indigo-200 flex items-center justify-center">
                               <span class="text-3xl font-black">{{ (authStore.user?.user_metadata?.full_name?.[0] ?? authStore.user?.email?.[0] ?? 'U').toUpperCase() }}</span>
                            </div>
                         </div>
                         <div>
                            <h3 class="text-2xl font-black text-slate-900">{{ authStore.user?.user_metadata?.full_name || 'User' }}</h3>
                            <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">{{ authStore.userPlan }} Member since April 2026</p>
                            <button @click="openProfileEditor" class="mt-4 btn btn-ghost btn-xs rounded-lg text-indigo-600 font-black uppercase tracking-[0.2em] text-[9px] hover:bg-indigo-50 px-0">Edit Profile Information</button>
                         </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</p>
                            <p class="font-bold text-slate-900">{{ authStore.user?.user_metadata?.full_name || 'Not set' }}</p>
                         </div>
                         <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</p>
                            <p class="font-bold text-slate-900">{{ authStore.user?.email }}</p>
                         </div>
                         <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Account Status</p>
                            <div class="flex items-center gap-2">
                               <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                               <p class="font-bold text-slate-900">Active</p>
                            </div>
                         </div>
                         <div>
                            <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Security</p>
                            <p class="font-bold text-indigo-600 cursor-pointer hover:underline text-sm flex items-center gap-1">
                               <Lock class="w-3.5 h-3.5" /> Change Password
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="text-center mb-16">
                <h1 class="text-4xl font-black text-slate-900 mb-4 tracking-tight uppercase">Subscription Plans</h1>
                <p class="text-slate-500 font-medium max-w-2xl mx-auto">Choose the perfect plan to accelerate your career. Upgrade anytime as your needs grow.</p>
              </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div 
                v-for="plan in plans" 
                :key="plan.name"
                class="relative flex flex-col p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 group"
              >
                <div v-if="plan.popular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200">
                  Most Popular
                </div>

                <div class="mb-10 text-center">
                  <span class="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">{{ plan.name }}</span>
                  <div class="flex items-baseline justify-center gap-1 mt-4">
                    <span class="text-5xl font-black text-slate-900 leading-none tracking-tighter">{{ plan.price }}</span>
                    <span class="text-slate-400 font-bold">/mo</span>
                  </div>
                  <p class="mt-4 text-sm text-slate-500 font-medium leading-relaxed">{{ plan.description }}</p>
                </div>

                <ul class="flex-1 space-y-4 mb-10">
                  <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-slate-600 text-sm font-bold">
                    <div class="bg-indigo-50 p-1 rounded-lg">
                      <Check class="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    {{ feature }}
                  </li>
                </ul>

                <button 
                  @click="handlePlanUpgrade(plan)"
                  :class="[
                    'w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300',
                    authStore.userPlan === plan.name 
                      ? 'bg-slate-100 text-slate-400 cursor-default' 
                      : (plan.popular ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200')
                  ]"
                >
                  {{ authStore.userPlan === plan.name ? 'Active Plan' : (plan.name === 'Free' ? 'Downgrade' : plan.buttonText) }}
                </button>
              </div>
            </div>
            
            </template>
          </div>
        </div>

        <!-- Payment Modal -->
        <div v-if="showPaymentModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LayoutTemplate class="w-8 h-8 text-indigo-600" />
              </div>
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Upgrade to {{ selectedPlanToUpgrade?.name }}</h3>
              <p class="text-slate-500 font-medium text-sm mt-2">Please complete the payment to activate your plan.</p>
            </div>

            <div class="space-y-6">
              <div class="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden group">
                <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div class="relative z-10">
                  <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Payment Details</p>
                  
                  <div class="space-y-4">
                    <div>
                      <p class="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Card Number (HUMO/UZCARD)</p>
                      <p class="text-xl font-mono font-bold tracking-wider">8600 1234 5678 9012</p>
                    </div>
                    
                    <div class="flex justify-between items-end">
                      <div>
                        <p class="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Account Holder</p>
                        <p class="text-sm font-bold uppercase">RESUMELY</p>
                      </div>
                      <div class="text-right">
                        <p class="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-1">Amount</p>
                        <p class="text-xl font-black text-indigo-400 leading-none">{{ selectedPlanToUpgrade?.price }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button 
                  @click="confirmPayment"
                  class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  I have paid
                </button>
                <button 
                  @click="showPaymentModal = false"
                  class="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
              
              <p class="text-center text-[10px] text-slate-400 font-medium px-4 leading-relaxed">
                After payment, please wait up to 5 minutes for your account to be upgraded automatically.
              </p>
            </div>
          </div>
        </div>

        <!-- Profile Edit Modal -->
        <div v-if="showProfileModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Settings class="w-8 h-8" />
              </div>
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Edit Profile</h3>
              <p class="text-slate-500 font-medium text-sm mt-2">Update your account information.</p>
            </div>

            <div class="space-y-6">
              <div class="form-control">
                <label class="label mb-1.5"><span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">Full Name</span></label>
                <input v-model="profileName" type="text" class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold" />
              </div>

              <div class="form-control">
                <label class="label mb-1.5"><span class="label-text font-black text-[10px] uppercase tracking-widest text-slate-400">Email Address</span></label>
                <input v-model="profileEmail" type="email" class="input input-bordered w-full rounded-2xl bg-slate-50 border-slate-200 outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-bold" />
              </div>

              <div class="flex flex-col gap-3 pt-4">
                <button 
                  @click="handleProfileUpdate"
                  :disabled="isUpdatingProfile"
                  class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Loader2 v-if="isUpdatingProfile" class="w-4 h-4 animate-spin" />
                  Save Changes
                </button>
                <button 
                  @click="showProfileModal = false"
                  class="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Toast -->
        <Transition
          enter-active-class="transform ease-out duration-300 transition"
          enter-from-class="translate-y-[-100%] opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showSuccess" class="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4">
            <div class="bg-slate-900 border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="bg-green-500/20 p-2 rounded-xl">
                  <Check class="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p class="font-black text-xs uppercase tracking-widest">Success!</p>
                  <p class="text-[11px] text-slate-400">Successfully upgraded to <span class="text-white font-bold">{{ upgradedPlan }}</span></p>
                </div>
              </div>
              <button @click="showSuccess = false" class="text-slate-500 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
        </Transition>
      </main>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side z-50">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
      <div class="flex flex-col w-[260px] h-full bg-white border-r border-slate-200">
        <!-- Logo -->
        <div class="flex items-center px-6 py-5 cursor-pointer hover:opacity-80 transition-opacity" @click="router.push('/')">
          <CvMakerLogo size="md" />
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-2 space-y-1">
          <button 
            v-for="item in sidebarItems"
            :key="item.id"
            @click="currentTab = item.id"
            :class="['w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold transition-all duration-300 group', 
                     currentTab === item.id 
                       ? 'bg-gradient-to-r from-indigo-50 to-white text-indigo-600 shadow-[inset_4px_0_0_0_#4f46e5]' 
                       : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900']"
          >
            <component :is="item.icon" :class="['w-5 h-5 transition-colors', currentTab === item.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600']" />
            <span class="text-sm tracking-tight">{{ item.label }}</span>
          </button>
        </nav>

        <!-- Footer section of sidebar -->
        <div class="p-6 space-y-6">
          <!-- Pro Card -->
          <div v-if="authStore.userPlan === 'Free'" class="relative group cursor-pointer" @click="currentTab = 'settings'">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div class="relative bg-slate-900 text-white rounded-3xl p-6 overflow-hidden">
              <div class="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div class="relative z-10">
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 mb-4">
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                  <span class="text-[10px] font-black uppercase tracking-widest text-indigo-200">Pro Plan</span>
                </div>
                <p class="text-xs font-medium text-slate-300 mb-5 leading-relaxed">Unlock unlimited AI generation & ATS optimization features.</p>
                <div class="p-3 mt-1 border-t border-slate-100/10">
                  <p class="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-2">Upgrade for all templates</p>
                  <button @click="currentTab = 'settings'" class="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">Go Premium</button>
                </div>
              </div>
            </div>
          </div>

          <!-- User Profile -->
          <div class="space-y-4">
            <div @click="openProfileEditor" class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
              <div class="avatar placeholder shrink-0">
                <div class="bg-indigo-600 text-white rounded-xl w-10 h-10 shadow-md group-hover:scale-110 transition-transform flex items-center justify-center">
                  <span class="text-xs font-black">{{ (authStore.user?.user_metadata?.full_name?.[0] ?? authStore.user?.email?.[0] ?? 'U').toUpperCase() }}</span>
                </div>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-black text-slate-900 truncate tracking-tight uppercase">{{ authStore.user?.user_metadata?.full_name || authStore.user?.email.split('@')[0] }}</p>
                <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{{ authStore.userPlan }} Account</p>
              </div>
            </div>
            
            <button @click="handleLogout" class="flex items-center gap-3 w-full px-5 py-2 text-slate-400 hover:text-rose-500 transition-colors duration-300 font-bold text-xs uppercase tracking-widest group">
              <LogOut class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-dashed {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='40' ry='40' stroke='%23CBD5E1' stroke-width='4' stroke-dasharray='12%2c 16' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: 2.5rem;
}
</style>

