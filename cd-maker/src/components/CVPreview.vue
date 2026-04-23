<script setup>
import { useCvStore } from '../stores/cvStore'
import { computed } from 'vue'
import { MapPin, Mail, Phone, ExternalLink } from 'lucide-vue-next'

const store = useCvStore()
const cv = computed(() => store.currentCV)
const template = computed(() => store.selectedTemplate)
</script>

<template>
  <div class="w-[210mm] min-h-[297mm] bg-white shadow-2xl transition-all duration-300 cv-document">
    
    <!-- MINIMAL TEMPLATE -->
    <div v-if="template === 'minimal'" class="p-12 text-slate-800 font-sans">
      <header class="border-b border-slate-300 pb-6 mb-6">
        <h1 class="text-4xl font-light tracking-tight text-slate-900 mb-2">{{ cv.personalInfo.fullName }}</h1>
        <div class="flex flex-wrap gap-4 text-sm text-slate-500">
          <span class="flex items-center gap-1.5"><Mail class="w-3.5 h-3.5"/> {{ cv.personalInfo.email }}</span>
          <span class="flex items-center gap-1.5"><Phone class="w-3.5 h-3.5"/> {{ cv.personalInfo.phone }}</span>
          <span class="flex items-center gap-1.5"><MapPin class="w-3.5 h-3.5"/> {{ cv.personalInfo.location }}</span>
          <span class="flex items-center gap-1.5"><ExternalLink class="w-3.5 h-3.5"/> {{ cv.personalInfo.linkedin }}</span>
        </div>
      </header>

      <section class="mb-8">
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Summary</h2>
        <p class="text-sm leading-relaxed">{{ cv.summary }}</p>
      </section>

      <section class="mb-8">
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Experience</h2>
        <div v-for="(exp, idx) in cv.experience" :key="idx" class="mb-6">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="text-base font-semibold text-slate-900">{{ exp.title }}</h3>
            <span class="text-sm text-slate-500">{{ exp.date }}</span>
          </div>
          <div class="text-sm text-slate-600 font-medium mb-2">{{ exp.company }}</div>
          <ul class="list-disc pl-5 text-sm space-y-1.5 text-slate-700">
            <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx">{{ bullet }}</li>
          </ul>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h2>
        <div class="flex flex-wrap gap-2 text-sm text-slate-700">
          <span v-for="(skill, idx) in cv.skills" :key="idx" class="after:content-['•'] after:ml-2 last:after:content-['']">{{ skill }}</span>
        </div>
      </section>
      
      <section>
        <h2 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Education</h2>
        <div v-for="(edu, idx) in cv.education" :key="idx" class="mb-4">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="text-sm font-semibold text-slate-900">{{ edu.degree }}</h3>
            <span class="text-sm text-slate-500">{{ edu.date }}</span>
          </div>
          <div class="text-sm text-slate-600">{{ edu.school }}</div>
        </div>
      </section>
    </div>

    <!-- PROFESSIONAL TEMPLATE -->
    <div v-if="template === 'professional'" class="flex h-full min-h-[297mm] text-slate-800 font-serif">
      <div class="w-1/3 bg-slate-100 p-8 border-r border-slate-200">
        <h1 class="text-3xl font-bold text-slate-900 mb-2 font-sans">{{ cv.personalInfo.fullName }}</h1>
        <div class="w-10 h-1 bg-indigo-600 mb-8"></div>
        
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">Contact</h2>
        <div class="space-y-3 text-sm text-slate-600 mb-8 font-sans">
          <div class="break-all">{{ cv.personalInfo.email }}</div>
          <div>{{ cv.personalInfo.phone }}</div>
          <div>{{ cv.personalInfo.location }}</div>
          <div class="break-all">{{ cv.personalInfo.linkedin }}</div>
        </div>

        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2">Skills</h2>
        <ul class="list-none space-y-1.5 text-sm text-slate-600 font-sans">
          <li v-for="(skill, idx) in cv.skills" :key="idx">{{ skill }}</li>
        </ul>
        
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-300 pb-2 mt-8">Education</h2>
        <div v-for="(edu, idx) in cv.education" :key="idx" class="mb-4 font-sans">
          <div class="text-sm font-bold text-slate-800">{{ edu.degree }}</div>
          <div class="text-xs text-slate-600">{{ edu.school }}</div>
          <div class="text-xs text-slate-500 mt-1">{{ edu.date }}</div>
        </div>
      </div>
      
      <div class="w-2/3 p-8">
        <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-3">Profile</h2>
        <p class="text-sm leading-relaxed mb-8 font-sans">{{ cv.summary }}</p>

        <h2 class="text-sm font-bold uppercase tracking-wider text-indigo-700 mb-5">Professional Experience</h2>
        <div v-for="(exp, idx) in cv.experience" :key="idx" class="mb-6 relative pb-6 border-b border-slate-100 last:border-0 font-sans">
          <div class="flex justify-between items-baseline mb-1">
            <h3 class="text-lg font-bold text-slate-900">{{ exp.title }}</h3>
            <span class="text-sm font-medium text-slate-500">{{ exp.date }}</span>
          </div>
          <div class="text-sm font-semibold text-indigo-600 mb-3">{{ exp.company }}</div>
          <ul class="list-disc pl-4 text-sm space-y-2 text-slate-700 marker:text-slate-400">
            <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx">{{ bullet }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- CREATIVE TEMPLATE -->
    <div v-if="template === 'creative'" class="text-slate-800 font-sans">
      <header class="bg-indigo-600 text-white p-10">
        <div class="max-w-3xl mx-auto">
          <h1 class="text-5xl font-black tracking-tight mb-3">{{ cv.personalInfo.fullName }}</h1>
          <p class="text-indigo-200 text-lg mb-6 leading-relaxed">{{ cv.summary }}</p>
          <div class="flex flex-wrap gap-4 text-sm font-medium text-indigo-100">
            <span>{{ cv.personalInfo.email }}</span>
            <span>•</span>
            <span>{{ cv.personalInfo.phone }}</span>
            <span>•</span>
            <span>{{ cv.personalInfo.location }}</span>
            <span>•</span>
            <span>{{ cv.personalInfo.linkedin }}</span>
          </div>
        </div>
      </header>

      <div class="p-10 flex gap-10">
        <div class="w-2/3">
          <section class="mb-10">
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm">Briefcase</span>
              Experience
            </h2>
            <div class="space-y-8">
              <div v-for="(exp, idx) in cv.experience" :key="idx" class="relative pl-6 border-l-2 border-indigo-100">
                <div class="absolute w-3 h-3 bg-indigo-600 rounded-full -left-[7px] top-1.5 border-2 border-white"></div>
                <h3 class="text-lg font-bold text-slate-900">{{ exp.title }}</h3>
                <div class="text-sm font-semibold text-indigo-600 mb-1">{{ exp.company }} <span class="text-slate-400 font-normal ml-2">{{ exp.date }}</span></div>
                <ul class="list-disc pl-5 mt-3 text-sm space-y-1.5 text-slate-600">
                  <li v-for="(bullet, bIdx) in exp.bullets" :key="bIdx">{{ bullet }}</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <div class="w-1/3">
          <section class="mb-10">
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">Award</span>
              Skills
            </h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="(skill, idx) in cv.skills" :key="idx" class="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg">
                {{ skill }}
              </span>
            </div>
          </section>

          <section>
            <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span class="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm">BookOpen</span>
              Education
            </h2>
            <div v-for="(edu, idx) in cv.education" :key="idx" class="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h3 class="text-sm font-bold text-slate-900">{{ edu.degree }}</h3>
              <div class="text-sm text-slate-600 mt-1">{{ edu.school }}</div>
              <div class="text-xs text-slate-500 mt-2 font-medium">{{ edu.date }}</div>
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
