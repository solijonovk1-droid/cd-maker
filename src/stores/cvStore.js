import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCvStore = defineStore('cv', () => {
  const currentJobDescription = ref('')
  const isGenerating = ref(false)
  const currentCV = ref({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: ''
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    interests: [],
    keywords: [],
    matchScore: 0
  })

  const tailoringOptions = ref({
    level: 'Mid-level',
    tone: 'Professional',
    language: 'English'
  })

  const selectedTemplate = ref('minimal')

  const templates = ref([
    { id: 'minimal', name: 'Modern Split', premium: false, color: '#0f172a', accent: '#6366f1', bg: '#ffffff', layout: 'minimal' },
    { id: 'professional', name: 'Enterprise Sidebar', premium: false, color: '#1e293b', accent: '#0ea5e9', bg: '#f8fafc', layout: 'sidebar' },
    { id: 'creative', name: 'Neo-Glow', premium: false, color: '#4c1d95', accent: '#ec4899', bg: '#ffffff', layout: 'bold' },
    { id: 't4', name: 'Executive Gold', premium: true, color: '#451a03', accent: '#d97706', bg: '#fffbeb', layout: 'split' },
  ])

  const cvs = ref([])

  const generateCV = async () => {
    isGenerating.value = true
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY

    if (!apiKey) {
      console.warn("OpenAI API Key not found. Falling back to mock data.")
      return new Promise((resolve) => {
        setTimeout(() => {
          currentCV.value.summary = "Passionate and results-driven Frontend Developer with a strong foundation in modern web technologies. Passionate about building responsive, user-friendly applications and continuously improving performance and design quality. Quick learner with a problem-solving mindset."
          currentCV.value.experience = [
            {
              title: "Freelance Frontend Developer",
              company: "Independent / Self-Employed",
              date: "2024 – Present",
              bullets: [
                "Developed modern websites for small clients using React.js and Tailwind CSS.",
                "Improved website responsiveness and performance by 30% through code optimization.",
                "Collaborated with users to deliver customized solutions and interactive UI components.",
                "Integrated RESTful APIs and ensured cross-browser compatibility across mobile and desktop."
              ]
            }
          ]
          currentCV.value.projects = [
            { name: "Portfolio Website", description: "Designed and developed a personal portfolio website with responsive design." },
            { name: "E-commerce Demo", description: "Built a dynamic online store interface with product filtering." },
            { name: "CV Maker App", description: "Developed a resume-building web application with live preview." }
          ]
          currentCV.value.skills = ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Git & GitHub', 'Responsive Web Design', 'UI/UX Basics', 'Debugging & Optimization']
          currentCV.value.certifications = ['Certified Responsive Web Designer', 'JS Developer Associate']
          currentCV.value.languages = ['Uzbek (Native)', 'English (Intermediate)', 'Russian (Basic)']
          currentCV.value.interests = ['Web Development', 'Technology & Startups', 'UI/UX Design']
          currentCV.value.matchScore = 98
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
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: `You are an Elite Executive Resume Writer. 
              TONE: ${tailoringOptions.value.tone}
              TARGET LEVEL: ${tailoringOptions.value.level}
              OUTPUT LANGUAGE: ${tailoringOptions.value.language}

              Output MUST be a valid JSON object matching the following structure:
              {
                "summary": "Impactful summary in ${tailoringOptions.value.language}...",
                "experience": [ { "title": "...", "company": "...", "date": "...", "bullets": ["...", "..."] } ],
                "projects": [ { "name": "...", "description": "...", "link": "..." } ],
                "skills": ["Skill 1", "Skill 2"],
                "certifications": ["Cert 1"],
                "languages": ["Lang 1 (Level)"],
                "interests": ["Interest 1"],
                "matchScore": 95
              }
              Translate ALL content to ${tailoringOptions.value.language}.`
            },
            {
              role: "user",
              content: `Optimize this CV for the job. Current content: ${JSON.stringify(currentCV.value)}`
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        const result = JSON.parse(data.choices[0].message.content);
        currentCV.value.summary = result.summary;
        currentCV.value.experience = result.experience;
        currentCV.value.projects = result.projects || [];
        currentCV.value.certifications = result.certifications || [];
        currentCV.value.languages = result.languages || [];
        currentCV.value.interests = result.interests || [];
        currentCV.value.skills = result.skills;
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
    if (!currentCV.value.personalInfo.phone || currentCV.value.personalInfo.phone === '+1 234 567 890') {
      currentCV.value.personalInfo.phone = '+998 90 123 45 67'
    }
    if (!currentCV.value.personalInfo.location || currentCV.value.personalInfo.location === 'New York, US') {
      currentCV.value.personalInfo.location = 'Tashkent, Uzbekistan'
    }
  }

  const saveCV = () => {
    const newId = cvs.value.length > 0 ? Math.max(...cvs.value.map(c => c.id)) + 1 : 1
    const title = currentCV.value.experience?.[0]?.title 
      ? `${currentCV.value.experience[0].title} - ${currentCV.value.experience[0].company || 'Resume'}`
      : `New Resume ${newId}`
      
    cvs.value.unshift({
      id: newId,
      title: title,
      status: currentCV.value.matchScore > 80 ? 'Optimized' : 'Ready',
      lastModified: 'Just now',
      template: templates.value.find(t => t.id === selectedTemplate.value)?.name || 'Minimal',
      data: JSON.parse(JSON.stringify(currentCV.value))
    })
  }

  const clearCurrentCV = () => {
    currentCV.value = {
      personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '' },
      summary: '',
      skills: [],
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: [],
      interests: [],
      keywords: [],
      matchScore: 0
    }
    currentJobDescription.value = ''
  }

  return {
    currentJobDescription,
    isGenerating,
    currentCV,
    tailoringOptions,
    selectedTemplate,
    templates,
    cvs,
    generateCV,
    saveCV,
    clearCurrentCV,
    syncWithUser
  }
})
