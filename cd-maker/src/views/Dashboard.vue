<script setup>
import { useRouter } from 'vue-router'
import { Sparkles, FileText, LayoutTemplate, Settings, LogOut, Menu, Zap, Check, Plus, Search, Download, Share2, MoreVertical, Trash2, Clock, Eye } from 'lucide-vue-next'
import CVGenerator from '../components/CVGenerator.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useCvStore } from '../stores/cvStore'

const cvStore = useCvStore()

const router = useRouter()
const authStore = useAuthStore()
const currentTab = ref('cv-builder')
const showSuccess = ref(false)
const upgradedPlan = ref('')

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handlePlanUpgrade = (planName) => {
  if (planName === authStore.userPlan) return
  
  authStore.updatePlan(planName)
  upgradedPlan.value = planName
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
    features: ['2 CV Generations', 'Basic Templates', 'PDF Export'],
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

const mockCvs = ref([])

const selectedCv = ref(null)

const openCv = (cv) => {
  selectedCv.value = cv
  currentTab.value = 'cv-builder'
}

// Sync CV with current user info
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
        <div class="flex-1 px-4">
          <span class="font-bold text-lg tracking-tight">AI CV Builder</span>
        </div>
      </div>

      <!-- Main Body -->
      <main class="flex-1 overflow-y-auto relative custom-scrollbar">
        <CVGenerator v-if="currentTab === 'cv-builder'" @switch-tab="(tab) => currentTab = tab" />
        

        <div v-else-if="currentTab === 'settings'" class="min-h-full p-8 lg:p-12 bg-slate-50">
          <div class="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                  @click="handlePlanUpgrade(plan.name)"
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
            
            <div class="mt-16 text-center">
               <button @click="currentTab = 'cv-builder'" class="btn btn-ghost btn-sm text-slate-400 font-bold hover:text-indigo-600">
                 Return to CV Builder
               </button>
            </div>
          </div>
        </div>

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
                v-if="authStore.userPlan !== 'Free' || mockCvs.length < 2"
                @click="currentTab = 'cv-builder'"
                class="group relative flex flex-col items-center justify-center p-8 bg-dashed border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-500 cursor-pointer h-[320px]"
              >
                <div class="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-500 mb-6 group-hover:scale-110 group-hover:rotate-12">
                  <Plus class="w-8 h-8" />
                </div>
                <span class="font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest text-xs">Create New CV</span>
              </div>

              <!-- Locked Card for Free Users -->
              <div 
                v-if="authStore.userPlan === 'Free' && mockCvs.length >= 2"
                @click="currentTab = 'settings'"
                class="group relative flex flex-col items-center justify-center p-8 bg-slate-100 border-2 border-slate-200 rounded-[2.5rem] hover:bg-indigo-50 transition-all duration-500 cursor-pointer h-[320px]"
              >
                <div class="w-16 h-16 rounded-full bg-white text-slate-400 group-hover:text-indigo-600 flex items-center justify-center transition-all duration-500 mb-6">
                  <Lock class="w-8 h-8" />
                </div>
                <div class="text-center">
                  <span class="block font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest text-xs mb-2">Limit Reached</span>
                  <p class="text-[10px] text-slate-400 font-bold px-4">Upgrade to PRO for unlimited CV generation.</p>
                </div>
              </div>

              <!-- CV Cards -->
              <div 
                v-for="cv in mockCvs" 
                :key="cv.id"
                @click="openCv(cv)"
                class="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col h-[320px] cursor-pointer"
              >
                <!-- Card Preview Area (Mock Image) -->
                <div class="h-40 bg-slate-50 relative overflow-hidden flex items-center justify-center">
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
        <div v-else class="h-full flex items-center justify-center p-8 bg-slate-50">
          <div class="text-center max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div class="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50">
               <component :is="sidebarItems.find(i => i.id === currentTab)?.icon || FileText" class="w-16 h-16 mx-auto text-primary mb-6 opacity-20" />
               <h2 class="text-2xl font-black mb-3 text-slate-800 uppercase tracking-widest">{{ sidebarItems.find(i => i.id === currentTab)?.label }}</h2>
               <p class="text-slate-500 font-medium leading-relaxed">We're building something special here. This feature will be available in the next update.</p>
               <button @click="currentTab = 'cv-builder'" class="btn btn-primary btn-sm mt-8 rounded-xl px-6">Back to Dashboard</button>
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
        <div class="flex items-center gap-3 p-8 group cursor-pointer" @click="router.push('/')">
          <div class="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-all duration-300">
            <Sparkles class="w-5 h-5" />
          </div>
          <span class="font-black text-xl tracking-tighter text-slate-900">AI CV Builder</span>
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
            <div class="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 group">
              <div class="avatar placeholder shrink-0">
                <div class="bg-indigo-600 text-white rounded-xl w-10 shadow-md">
                  <span class="text-xs font-black">{{ (authStore.user?.email?.[0] ?? 'U').toUpperCase() }}</span>
                </div>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-black text-slate-900 truncate tracking-tight uppercase">{{ authStore.user?.email.split('@')[0] }}</p>
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
