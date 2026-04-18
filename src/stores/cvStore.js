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
    { id: 'minimal', name: 'Modern Minimal', image: '/templates/template1.png', premium: false },
    { id: 'professional', name: 'Enterprise Pro', image: '/templates/template2.png', premium: false },
    { id: 'creative', name: 'Neo-Creative', image: '/templates/template3.png', premium: false },
    { id: 't4', name: 'Executive Gold', image: '/templates/template1.png', premium: true },
    { id: 't5', name: 'Clean Mint', image: '/templates/template2.png', premium: true },
    { id: 't6', name: 'Deep Maroon', image: '/templates/template3.png', premium: true },
    { id: 't7', name: 'Silicon Valley', image: '/templates/template1.png', premium: true },
    { id: 't8', name: 'Oxford Classic', image: '/templates/template2.png', premium: true },
    { id: 't9', name: 'Design Portfolio', image: '/templates/template3.png', premium: true },
    { id: 't10', name: 'Startup Vibe', image: '/templates/template1.png', premium: true },
    { id: 't11', name: 'Corporate Elite', image: '/templates/template2.png', premium: true },
    { id: 't12', name: 'Freelancer Bold', image: '/templates/template3.png', premium: true },
    { id: 't13', name: 'Medical Pro', image: '/templates/template1.png', premium: true },
    { id: 't14', name: 'Legal Standard', image: '/templates/template2.png', premium: true },
    { id: 't15', name: 'Academic Researcher', image: '/templates/template3.png', premium: true },
    { id: 't16', name: 'Sales Closer', image: '/templates/template1.png', premium: true },
    { id: 't17', name: 'Engineering Draft', image: '/templates/template2.png', premium: true },
    { id: 't18', name: 'Marketing Glow', image: '/templates/template3.png', premium: true },
    { id: 't19', name: 'Cloud Specialist', image: '/templates/template1.png', premium: true },
    { id: 't20', name: 'Global Vision', image: '/templates/template2.png', premium: true },
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
