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
    // phone and location can stay empty for user to fill, or we can use default mock placeholders if they are empty
    if (!currentCV.value.personalInfo.phone) currentCV.value.personalInfo.phone = '+998 90 123 45 67'
    if (!currentCV.value.personalInfo.location) currentCV.value.personalInfo.location = 'Tashkent, Uzbekistan'
  }

  return {
    currentJobDescription,
    isGenerating,
    currentCV,
    selectedTemplate,
    generateCV,
    syncWithUser
  }
})
