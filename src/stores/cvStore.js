import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCvStore = defineStore('cv', () => {
  const currentJobDescription = ref('')
  const isGenerating = ref(false)
  const currentCV = ref({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      location: 'New York, US',
      linkedin: 'linkedin.com/in/johndoe'
    },
    summary: 'A passionate developer looking for new opportunities...',
    skills: ['JavaScript', 'Vue.js', 'Tailwind CSS'],
    experience: [
      {
        title: 'Frontend Developer',
        company: 'Tech Corp',
        date: '2020 - Present',
        bullets: ['Developed modern web apps', 'Optimized performance resulting in 40% faster load times']
      }
    ],
    education: [
      {
        degree: 'BSc in Computer Science',
        school: 'University of Technology',
        date: '2016 - 2020'
      }
    ],
    keywords: [],
    matchScore: 0
  })

  const selectedTemplate = ref('minimal') // minimal, professional, creative

  const templates = ref([
    // Free templates
    { id: 'minimal',       name: 'Modern Minimal',      premium: false, color: '#1e293b', accent: '#6366f1', bg: '#f8fafc', layout: 'minimal' },
    { id: 'professional',  name: 'Enterprise Pro',       premium: false, color: '#0f172a', accent: '#0ea5e9', bg: '#f0f9ff', layout: 'sidebar' },
    { id: 'creative',      name: 'Neo-Creative',         premium: false, color: '#7c3aed', accent: '#ec4899', bg: '#fdf4ff', layout: 'bold' },
    // Premium templates
    { id: 't4',  name: 'Executive Gold',       premium: true,  color: '#78350f', accent: '#d97706', bg: '#fffbeb', layout: 'split' },
    { id: 't5',  name: 'Clean Mint',           premium: true,  color: '#065f46', accent: '#10b981', bg: '#ecfdf5', layout: 'minimal' },
    { id: 't6',  name: 'Deep Maroon',          premium: true,  color: '#881337', accent: '#e11d48', bg: '#fff1f2', layout: 'sidebar' },
    { id: 't7',  name: 'Silicon Valley',       premium: true,  color: '#1d4ed8', accent: '#3b82f6', bg: '#eff6ff', layout: 'bold' },
    { id: 't8',  name: 'Oxford Classic',       premium: true,  color: '#1c1917', accent: '#78716c', bg: '#fafaf9', layout: 'split' },
    { id: 't9',  name: 'Design Portfolio',     premium: true,  color: '#0891b2', accent: '#22d3ee', bg: '#ecfeff', layout: 'bold' },
    { id: 't10', name: 'Startup Vibe',         premium: true,  color: '#ea580c', accent: '#fb923c', bg: '#fff7ed', layout: 'minimal' },
    { id: 't11', name: 'Corporate Elite',      premium: true,  color: '#1e3a5f', accent: '#2563eb', bg: '#f0f4ff', layout: 'sidebar' },
    { id: 't12', name: 'Freelancer Bold',      premium: true,  color: '#4a044e', accent: '#a855f7', bg: '#faf5ff', layout: 'split' },
    { id: 't13', name: 'Medical Pro',          premium: true,  color: '#0c4a6e', accent: '#0284c7', bg: '#f0f9ff', layout: 'minimal' },
    { id: 't14', name: 'Legal Standard',       premium: true,  color: '#1a1a2e', accent: '#4f4e8f', bg: '#f5f5ff', layout: 'sidebar' },
    { id: 't15', name: 'Academic Researcher',  premium: true,  color: '#14532d', accent: '#16a34a', bg: '#f0fdf4', layout: 'split' },
    { id: 't16', name: 'Sales Closer',         premium: true,  color: '#7f1d1d', accent: '#dc2626', bg: '#fef2f2', layout: 'bold' },
    { id: 't17', name: 'Engineering Draft',    premium: true,  color: '#0f2027', accent: '#64748b', bg: '#f1f5f9', layout: 'minimal' },
    { id: 't18', name: 'Marketing Glow',       premium: true,  color: '#831843', accent: '#db2777', bg: '#fdf2f8', layout: 'split' },
    { id: 't19', name: 'Cloud Specialist',     premium: true,  color: '#0c4a6e', accent: '#38bdf8', bg: '#e0f2fe', layout: 'sidebar' },
    { id: 't20', name: 'Global Vision',        premium: true,  color: '#134e4a', accent: '#14b8a6', bg: '#f0fdfa', layout: 'bold' },
  ])

  const cvs = ref([
    {
      id: 1,
      title: 'Senior Frontend Engineer - Google',
      status: 'Ready',
      lastModified: '2 hours ago',
      template: 'Minimal'
    },
    {
      id: 2,
      title: 'Full Stack Developer - Amazon',
      status: 'Draft',
      lastModified: 'Yesterday',
      template: 'Professional'
    },
    {
      id: 3,
      title: 'Product Designer - Meta',
      status: 'Optimized',
      lastModified: '3 days ago',
      template: 'Creative'
    }
  ])

  const generateCV = async () => {
    isGenerating.value = true
    
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    
    if (!apiKey) {
      console.warn("OpenAI API Key not found. Falling back to mock data. Please add VITE_OPENAI_API_KEY to your .env file.")
      // FALLBACK TO MOCK DATA (to keep UI working while user sets up key)
      return new Promise((resolve) => {
        setTimeout(() => {
          currentCV.value.matchScore = 85
          currentCV.value.keywords = ['Vue.js', 'Tailwind', 'Frontend']
          isGenerating.value = false
          resolve(true)
        }, 1500)
      })
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4-turbo", // or "gpt-3.5-turbo"
          messages: [
            {
              role: "system",
              content: `You are an expert AI Resume Tailor. Your goal is to optimize a user's CV to match a specific Job Description. 
              Output MUST be a valid JSON object matching the following structure:
              {
                "summary": "Optimized summary",
                "experience": [ { "title": "...", "company": "...", "date": "...", "bullets": ["...", "..."] } ],
                "skills": ["skill1", "skill2"],
                "keywords": ["key1", "key2"],
                "matchScore": 85
              }
              Keep the core facts of the user's experience but rewrite the language to use industry keywords and strong action verbs found in the job description. Do NOT invent fake experience.`
            },
            {
              role: "user",
              content: `
              JOB DESCRIPTION:
              ${currentJobDescription.value}

              USER CURRENT CV:
              Summary: ${currentCV.value.summary}
              Skills: ${currentCV.value.skills.join(', ')}
              Experience: ${JSON.stringify(currentCV.value.experience)}
              `
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const result = JSON.parse(data.choices[0].message.content);
        
        // Update store with AI result
        currentCV.value.summary = result.summary;
        currentCV.value.experience = result.experience;
        currentCV.value.skills = result.skills;
        currentCV.value.keywords = result.keywords;
        currentCV.value.matchScore = result.matchScore;
      }
    } catch (error) {
      console.error("OpenAI Error:", error);
    } finally {
      isGenerating.value = false
    }
  }

  const syncWithUser = (user) => {
    if (!user) return
    currentCV.value.personalInfo.fullName = user.user_metadata?.full_name || user.email.split('@')[0]
    currentCV.value.personalInfo.email = user.email
    
    // Set default phone and location if empty
    if (!currentCV.value.personalInfo.phone || currentCV.value.personalInfo.phone === '+1 234 567 890') {
       currentCV.value.personalInfo.phone = '+998 90 123 45 67'
    }
    if (!currentCV.value.personalInfo.location || currentCV.value.personalInfo.location === 'New York, US') {
       currentCV.value.personalInfo.location = 'Tashkent, Uzbekistan'
    }
  }

  return {
    currentJobDescription,
    isGenerating,
    currentCV,
    selectedTemplate,
    templates,
    cvs,
    generateCV,
    syncWithUser
  }
})
