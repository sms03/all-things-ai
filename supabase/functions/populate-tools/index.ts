
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AITool {
  name: string;
  website: string;
  pricing: 'free' | 'freemium' | 'paid';
  category: string;
  description: string;
  tags: string[];
  rating: number;
}

const aiToolsData: AITool[] = [
  // Conversational AI & Chatbots
  { name: "ChatGPT", website: "https://chat.openai.com", pricing: "freemium", category: "chatbots", description: "AI-powered conversational assistant for various tasks", tags: ["conversation", "assistant", "text"], rating: 4.8 },
  { name: "Claude", website: "https://claude.ai", pricing: "freemium", category: "chatbots", description: "Advanced AI assistant by Anthropic for helpful conversations", tags: ["conversation", "assistant", "helpful"], rating: 4.7 },
  { name: "Google Gemini", website: "https://gemini.google.com", pricing: "freemium", category: "chatbots", description: "Google's multimodal AI model for conversations and analysis", tags: ["multimodal", "google", "conversation"], rating: 4.6 },
  { name: "Microsoft Copilot", website: "https://copilot.microsoft.com", pricing: "freemium", category: "chatbots", description: "AI assistant integrated with Microsoft ecosystem", tags: ["microsoft", "productivity", "assistant"], rating: 4.5 },
  { name: "Anthropic Claude", website: "https://console.anthropic.com", pricing: "paid", category: "chatbots", description: "Constitutional AI for safe and helpful conversations", tags: ["safe", "helpful", "constitutional"], rating: 4.7 },
  { name: "Perplexity AI", website: "https://perplexity.ai", pricing: "freemium", category: "chatbots", description: "AI-powered search and research assistant", tags: ["search", "research", "citations"], rating: 4.6 },
  { name: "Character.AI", website: "https://character.ai", pricing: "freemium", category: "chatbots", description: "Create and chat with AI characters", tags: ["characters", "roleplay", "entertainment"], rating: 4.3 },
  { name: "Replika", website: "https://replika.ai", pricing: "freemium", category: "chatbots", description: "AI companion for emotional support and conversation", tags: ["companion", "emotional", "support"], rating: 4.2 },
  { name: "Jasper Chat", website: "https://jasper.ai", pricing: "paid", category: "chatbots", description: "AI chat for content creation and marketing", tags: ["content", "marketing", "business"], rating: 4.4 },
  { name: "YouChat", website: "https://you.com", pricing: "free", category: "chatbots", description: "Free AI chat with web search capabilities", tags: ["free", "search", "web"], rating: 4.1 },
  { name: "Poe", website: "https://poe.com", pricing: "freemium", category: "chatbots", description: "Access multiple AI models in one platform", tags: ["multiple", "models", "platform"], rating: 4.3 },
  { name: "Chatsonic", website: "https://writesonic.com/chat", pricing: "freemium", category: "chatbots", description: "AI chatbot with internet access and image generation", tags: ["internet", "images", "current"], rating: 4.2 },
  { name: "HuggingFace Chat", website: "https://huggingface.co/chat", pricing: "free", category: "chatbots", description: "Open-source AI models for conversation", tags: ["open-source", "models", "free"], rating: 4.0 },
  { name: "OpenAssistant", website: "https://open-assistant.io", pricing: "free", category: "chatbots", description: "Open-source conversational AI", tags: ["open-source", "community", "free"], rating: 3.9 },
  { name: "Cohere Command", website: "https://cohere.ai", pricing: "paid", category: "chatbots", description: "Enterprise-grade language model for businesses", tags: ["enterprise", "business", "language"], rating: 4.4 },

  // Content Writing & Copywriting
  { name: "Jasper AI", website: "https://jasper.ai", pricing: "paid", category: "text-copywriting", description: "AI writing assistant for marketing and content creation", tags: ["marketing", "content", "copywriting"], rating: 4.5 },
  { name: "Copy.ai", website: "https://copy.ai", pricing: "freemium", category: "text-copywriting", description: "AI-powered copywriting for marketing materials", tags: ["copywriting", "marketing", "templates"], rating: 4.3 },
  { name: "Writesonic", website: "https://writesonic.com", pricing: "freemium", category: "text-copywriting", description: "AI writing tool for articles, ads, and marketing copy", tags: ["articles", "ads", "marketing"], rating: 4.4 },
  { name: "Rytr", website: "https://rytr.me", pricing: "freemium", category: "text-copywriting", description: "AI writing assistant for various content types", tags: ["versatile", "content", "writing"], rating: 4.2 },
  { name: "Anyword", website: "https://anyword.com", pricing: "freemium", category: "text-copywriting", description: "AI copywriting with performance prediction", tags: ["performance", "prediction", "data"], rating: 4.3 },
  { name: "ContentBot", website: "https://contentbot.ai", pricing: "freemium", category: "text-copywriting", description: "AI content creation for blogs and marketing", tags: ["blogs", "automation", "content"], rating: 4.1 },
  { name: "Peppertype", website: "https://peppertype.ai", pricing: "freemium", category: "text-copywriting", description: "AI content creation platform for businesses", tags: ["business", "platform", "content"], rating: 4.2 },
  { name: "CopySmith", website: "https://copysmith.ai", pricing: "paid", category: "text-copywriting", description: "AI copywriting for e-commerce and marketing", tags: ["e-commerce", "product", "descriptions"], rating: 4.3 },
  { name: "Wordtune", website: "https://wordtune.com", pricing: "freemium", category: "text-copywriting", description: "AI writing companion for rewriting and improving text", tags: ["rewriting", "improvement", "editing"], rating: 4.4 },
  { name: "ShortlyAI", website: "https://shortlyai.com", pricing: "paid", category: "text-copywriting", description: "AI writing partner for creative and professional content", tags: ["creative", "professional", "partner"], rating: 4.2 },
  { name: "Article Forge", website: "https://articleforge.com", pricing: "paid", category: "text-copywriting", description: "AI article generator for SEO content", tags: ["articles", "SEO", "automated"], rating: 4.0 },
  { name: "INK Editor", website: "https://inkforall.com", pricing: "freemium", category: "text-copywriting", description: "AI writing and SEO optimization tool", tags: ["SEO", "optimization", "writing"], rating: 4.1 },
  { name: "Frase", website: "https://frase.io", pricing: "paid", category: "text-copywriting", description: "AI content optimization and research tool", tags: ["research", "optimization", "content"], rating: 4.3 },
  { name: "MarketMuse", website: "https://marketmuse.com", pricing: "paid", category: "text-copywriting", description: "AI content planning and optimization platform", tags: ["planning", "strategy", "content"], rating: 4.4 },
  { name: "Surfer SEO", website: "https://surferseo.com", pricing: "paid", category: "text-copywriting", description: "AI-powered SEO content optimization", tags: ["SEO", "optimization", "SERP"], rating: 4.5 },

  // Image Generation & Editing
  { name: "DALL-E 3", website: "https://openai.com/dall-e-3", pricing: "paid", category: "image-art", description: "Advanced AI image generation with improved quality", tags: ["generation", "creative", "art"], rating: 4.7 },
  { name: "Midjourney", website: "https://midjourney.com", pricing: "paid", category: "image-art", description: "AI art generation with artistic style", tags: ["art", "creative", "style"], rating: 4.8 },
  { name: "Stable Diffusion", website: "https://stability.ai", pricing: "freemium", category: "image-art", description: "Open-source AI image generation model", tags: ["open-source", "generation", "customizable"], rating: 4.6 },
  { name: "Adobe Firefly", website: "https://firefly.adobe.com", pricing: "freemium", category: "image-art", description: "Adobe's AI for creative image generation", tags: ["adobe", "creative", "integration"], rating: 4.5 },
  { name: "Canva AI", website: "https://canva.com", pricing: "freemium", category: "image-art", description: "AI-powered design tools within Canva", tags: ["design", "templates", "easy"], rating: 4.4 },
  { name: "Runway ML", website: "https://runwayml.com", pricing: "freemium", category: "image-art", description: "AI tools for creative content generation", tags: ["creative", "tools", "editing"], rating: 4.6 },
  { name: "Leonardo AI", website: "https://leonardo.ai", pricing: "freemium", category: "image-art", description: "AI image generation with fine-tuned models", tags: ["fine-tuned", "models", "quality"], rating: 4.5 },
  { name: "Playground AI", website: "https://playgroundai.com", pricing: "freemium", category: "image-art", description: "User-friendly AI image generation platform", tags: ["user-friendly", "playground", "creative"], rating: 4.3 },
  { name: "DreamStudio", website: "https://dreamstudio.ai", pricing: "paid", category: "image-art", description: "Stable Diffusion interface by Stability AI", tags: ["stable-diffusion", "interface", "professional"], rating: 4.4 },
  { name: "Artbreeder", website: "https://artbreeder.com", pricing: "freemium", category: "image-art", description: "Collaborative AI art creation platform", tags: ["collaborative", "breeding", "evolution"], rating: 4.2 },
  { name: "NightCafe", website: "https://nightcafe.studio", pricing: "freemium", category: "image-art", description: "AI art generator with multiple algorithms", tags: ["multiple", "algorithms", "community"], rating: 4.3 },
  { name: "Craiyon", website: "https://craiyon.com", pricing: "free", category: "image-art", description: "Free AI image generation tool", tags: ["free", "simple", "accessible"], rating: 3.8 },
  { name: "BlueWillow", website: "https://bluewillow.ai", pricing: "free", category: "image-art", description: "Free AI image generation alternative", tags: ["free", "alternative", "discord"], rating: 3.9 },
  { name: "Lexica", website: "https://lexica.art", pricing: "freemium", category: "image-art", description: "Stable Diffusion search and generation", tags: ["search", "stable-diffusion", "prompts"], rating: 4.1 },
  { name: "DeepAI", website: "https://deepai.org", pricing: "freemium", category: "image-art", description: "Various AI tools including image generation", tags: ["various", "tools", "API"], rating: 4.0 },

  // Video Generation & Editing
  { name: "Synthesia", website: "https://synthesia.io", pricing: "paid", category: "video-audio", description: "AI video generation with virtual presenters", tags: ["presenters", "avatars", "business"], rating: 4.6 },
  { name: "D-ID", website: "https://d-id.com", pricing: "freemium", category: "video-audio", description: "AI-powered talking head video generation", tags: ["talking-head", "avatars", "animation"], rating: 4.4 },
  { name: "Luma AI", website: "https://lumalabs.ai", pricing: "freemium", category: "video-audio", description: "3D capture and AI video generation", tags: ["3D", "capture", "photorealistic"], rating: 4.5 },
  { name: "Pika Labs", website: "https://pika.art", pricing: "freemium", category: "video-audio", description: "AI video generation from text prompts", tags: ["text-to-video", "creative", "generation"], rating: 4.3 },
  { name: "HeyGen", website: "https://heygen.com", pricing: "freemium", category: "video-audio", description: "AI video creation with avatars", tags: ["avatars", "creation", "multilingual"], rating: 4.4 },
  { name: "InVideo AI", website: "https://invideo.io", pricing: "freemium", category: "video-audio", description: "AI-powered video creation platform", tags: ["platform", "templates", "automation"], rating: 4.3 },
  { name: "Pictory", website: "https://pictory.ai", pricing: "freemium", category: "video-audio", description: "AI video creation from text and articles", tags: ["text-to-video", "articles", "social"], rating: 4.2 },
  { name: "Fliki", website: "https://fliki.ai", pricing: "freemium", category: "video-audio", description: "Text to video with AI voices", tags: ["text-to-video", "voices", "multilingual"], rating: 4.1 },
  { name: "Loom AI", website: "https://loom.com", pricing: "freemium", category: "video-audio", description: "Screen recording with AI enhancements", tags: ["screen-recording", "enhancement", "productivity"], rating: 4.3 },
  { name: "Descript", website: "https://descript.com", pricing: "freemium", category: "video-audio", description: "AI video editing with text-based interface", tags: ["editing", "text-based", "transcription"], rating: 4.5 },
  { name: "Kapwing", website: "https://kapwing.com", pricing: "freemium", category: "video-audio", description: "Online video editor with AI features", tags: ["online", "editor", "collaborative"], rating: 4.2 },
  { name: "Animaker", website: "https://animaker.com", pricing: "freemium", category: "video-audio", description: "AI-powered animation and video creation", tags: ["animation", "creation", "templates"], rating: 4.1 },
  { name: "Steve AI", website: "https://steve.ai", pricing: "freemium", category: "video-audio", description: "AI video creation for marketing", tags: ["marketing", "creation", "automation"], rating: 4.0 },
  { name: "Wondershare Filmora", website: "https://filmora.wondershare.com", pricing: "paid", category: "video-audio", description: "Video editor with AI features", tags: ["editor", "features", "effects"], rating: 4.3 },

  // Audio & Music Generation
  { name: "ElevenLabs", website: "https://elevenlabs.io", pricing: "freemium", category: "audio-music", description: "AI voice synthesis and cloning", tags: ["voice", "synthesis", "cloning"], rating: 4.7 },
  { name: "Murf AI", website: "https://murf.ai", pricing: "freemium", category: "audio-music", description: "AI voiceover generation platform", tags: ["voiceover", "generation", "professional"], rating: 4.5 },
  { name: "Speechify", website: "https://speechify.com", pricing: "freemium", category: "audio-music", description: "Text-to-speech with natural voices", tags: ["text-to-speech", "natural", "reading"], rating: 4.4 },
  { name: "AIVA", website: "https://aiva.ai", pricing: "freemium", category: "audio-music", description: "AI music composition for creators", tags: ["music", "composition", "creative"], rating: 4.3 },
  { name: "Amper Music", website: "https://ampermusic.com", pricing: "paid", category: "audio-music", description: "AI music creation for content", tags: ["music", "creation", "content"], rating: 4.2 },
  { name: "Boomy", website: "https://boomy.com", pricing: "freemium", category: "audio-music", description: "AI music creation and distribution", tags: ["music", "creation", "distribution"], rating: 4.0 },
  { name: "Soundraw", website: "https://soundraw.io", pricing: "freemium", category: "audio-music", description: "AI music generation for videos", tags: ["music", "generation", "videos"], rating: 4.1 },
  { name: "Beatoven", website: "https://beatoven.ai", pricing: "freemium", category: "audio-music", description: "AI music for video content", tags: ["music", "video", "adaptive"], rating: 4.2 },
  { name: "Voicemod", website: "https://voicemod.net", pricing: "freemium", category: "audio-music", description: "Real-time voice changer with AI", tags: ["voice", "changer", "real-time"], rating: 4.3 },
  { name: "Resemble AI", website: "https://resemble.ai", pricing: "freemium", category: "audio-music", description: "AI voice generation and cloning", tags: ["voice", "generation", "cloning"], rating: 4.4 },
  { name: "WellSaid Labs", website: "https://wellsaidlabs.com", pricing: "paid", category: "audio-music", description: "AI voiceover for enterprise", tags: ["voiceover", "enterprise", "quality"], rating: 4.5 },
  { name: "Descript Overdub", website: "https://descript.com", pricing: "freemium", category: "audio-music", description: "AI voice synthesis for editing", tags: ["voice", "synthesis", "editing"], rating: 4.4 },
  { name: "Replica Studios", website: "https://replicastudios.com", pricing: "freemium", category: "audio-music", description: "AI voice acting for games and films", tags: ["voice", "acting", "games"], rating: 4.3 },
  { name: "Suno AI", website: "https://suno.ai", pricing: "freemium", category: "audio-music", description: "AI music generation from text", tags: ["music", "generation", "text"], rating: 4.2 },
  { name: "Udio", website: "https://udio.com", pricing: "freemium", category: "audio-music", description: "AI music creation platform", tags: ["music", "creation", "platform"], rating: 4.1 },

  // Code Generation & Development
  { name: "GitHub Copilot", website: "https://github.com/features/copilot", pricing: "paid", category: "developer", description: "AI pair programmer for code completion", tags: ["code", "completion", "programming"], rating: 4.7 },
  { name: "Tabnine", website: "https://tabnine.com", pricing: "freemium", category: "developer", description: "AI code completion for developers", tags: ["code", "completion", "IDE"], rating: 4.5 },
  { name: "CodeT5", website: "https://huggingface.co/Salesforce/codet5-large", pricing: "free", category: "developer", description: "Open-source code generation model", tags: ["open-source", "generation", "model"], rating: 4.2 },
  { name: "Amazon CodeWhisperer", website: "https://aws.amazon.com/codewhisperer", pricing: "freemium", category: "developer", description: "AI coding companion by AWS", tags: ["AWS", "companion", "coding"], rating: 4.3 },
  { name: "Replit Ghostwriter", website: "https://replit.com", pricing: "freemium", category: "developer", description: "AI coding assistant in Replit", tags: ["replit", "assistant", "coding"], rating: 4.2 },
  { name: "Cursor", website: "https://cursor.sh", pricing: "freemium", category: "developer", description: "AI-powered code editor", tags: ["editor", "AI-powered", "coding"], rating: 4.4 },
  { name: "Codeium", website: "https://codeium.com", pricing: "freemium", category: "developer", description: "Free AI code completion tool", tags: ["free", "completion", "tool"], rating: 4.3 },
  { name: "CodeGPT", website: "https://codegpt.co", pricing: "freemium", category: "developer", description: "AI coding assistant extension", tags: ["extension", "assistant", "coding"], rating: 4.1 },
  { name: "Sourcegraph Cody", website: "https://sourcegraph.com/cody", pricing: "freemium", category: "developer", description: "AI coding assistant with codebase context", tags: ["context", "codebase", "assistant"], rating: 4.2 },
  { name: "Claude Code", website: "https://console.anthropic.com", pricing: "paid", category: "developer", description: "Claude AI for coding tasks", tags: ["claude", "coding", "tasks"], rating: 4.4 },
  { name: "Deepcode", website: "https://snyk.io/platform/deepcode-ai", pricing: "paid", category: "developer", description: "AI code review and security", tags: ["review", "security", "analysis"], rating: 4.3 },
  { name: "Aider", website: "https://aider.chat", pricing: "free", category: "developer", description: "AI pair programming in terminal", tags: ["terminal", "pair-programming", "free"], rating: 4.1 },
  { name: "Continue", website: "https://continue.dev", pricing: "free", category: "developer", description: "Open-source AI code assistant", tags: ["open-source", "assistant", "free"], rating: 4.0 },
  { name: "Blackbox AI", website: "https://blackbox.ai", pricing: "freemium", category: "developer", description: "AI code search and generation", tags: ["search", "generation", "coding"], rating: 4.2 },
  { name: "Codiga", website: "https://codiga.io", pricing: "freemium", category: "developer", description: "AI code analysis and review", tags: ["analysis", "review", "quality"], rating: 4.1 },

  // Productivity & Automation
  { name: "Notion AI", website: "https://notion.so", pricing: "freemium", category: "productivity", description: "AI writing assistant in Notion", tags: ["notion", "writing", "notes"], rating: 4.5 },
  { name: "Zapier", website: "https://zapier.com", pricing: "freemium", category: "productivity", description: "Automation platform with AI features", tags: ["automation", "integration", "workflow"], rating: 4.6 },
  { name: "Monday.com AI", website: "https://monday.com", pricing: "paid", category: "productivity", description: "Project management with AI insights", tags: ["project", "management", "insights"], rating: 4.4 },
  { name: "ClickUp AI", website: "https://clickup.com", pricing: "freemium", category: "productivity", description: "AI-powered project management", tags: ["project", "management", "tasks"], rating: 4.3 },
  { name: "Grammarly", website: "https://grammarly.com", pricing: "freemium", category: "productivity", description: "AI writing assistant and grammar checker", tags: ["writing", "grammar", "assistant"], rating: 4.5 },
  { name: "Todoist", website: "https://todoist.com", pricing: "freemium", category: "productivity", description: "Task management with AI features", tags: ["tasks", "management", "organization"], rating: 4.4 },
  { name: "Otter.ai", website: "https://otter.ai", pricing: "freemium", category: "productivity", description: "AI meeting transcription and notes", tags: ["transcription", "meetings", "notes"], rating: 4.3 },
  { name: "Calendly", website: "https://calendly.com", pricing: "freemium", category: "productivity", description: "Scheduling automation platform", tags: ["scheduling", "automation", "meetings"], rating: 4.5 },
  { name: "Reclaim AI", website: "https://reclaim.ai", pricing: "freemium", category: "productivity", description: "AI calendar scheduling and time blocking", tags: ["calendar", "scheduling", "time"], rating: 4.2 },
  { name: "Motion", website: "https://usemotion.com", pricing: "paid", category: "productivity", description: "AI-powered task and calendar management", tags: ["tasks", "calendar", "AI-powered"], rating: 4.3 },
  { name: "TimeTree", website: "https://timetreeapp.com", pricing: "freemium", category: "productivity", description: "Shared calendar with AI features", tags: ["shared", "calendar", "collaboration"], rating: 4.1 },
  { name: "Superhuman", website: "https://superhuman.com", pricing: "paid", category: "productivity", description: "AI-powered email client", tags: ["email", "client", "AI-powered"], rating: 4.4 },
  { name: "Clara", website: "https://clara.com", pricing: "paid", category: "productivity", description: "AI scheduling assistant", tags: ["scheduling", "assistant", "meetings"], rating: 4.2 },
  { name: "Clockify", website: "https://clockify.me", pricing: "freemium", category: "productivity", description: "Time tracking with AI insights", tags: ["time", "tracking", "insights"], rating: 4.3 },
  { name: "RescueTime", website: "https://rescuetime.com", pricing: "freemium", category: "productivity", description: "Automatic time tracking and productivity", tags: ["time", "tracking", "productivity"], rating: 4.2 },

  // Data Analysis & Business Intelligence  
  { name: "Tableau AI", website: "https://tableau.com", pricing: "paid", category: "data-analysis", description: "Business intelligence with AI insights", tags: ["BI", "visualization", "insights"], rating: 4.6 },
  { name: "Power BI", website: "https://powerbi.microsoft.com", pricing: "freemium", category: "data-analysis", description: "Microsoft's business analytics platform", tags: ["microsoft", "analytics", "dashboards"], rating: 4.5 },
  { name: "DataRobot", website: "https://datarobot.com", pricing: "paid", category: "data-analysis", description: "Automated machine learning platform", tags: ["machine-learning", "automated", "enterprise"], rating: 4.4 },
  { name: "H2O.ai", website: "https://h2o.ai", pricing: "freemium", category: "data-analysis", description: "Open-source machine learning platform", tags: ["machine-learning", "open-source", "platform"], rating: 4.3 },
  { name: "Alteryx", website: "https://alteryx.com", pricing: "paid", category: "data-analysis", description: "Data analytics and preparation platform", tags: ["analytics", "preparation", "workflow"], rating: 4.4 },
  { name: "Databricks", website: "https://databricks.com", pricing: "paid", category: "data-analysis", description: "Unified analytics platform for big data", tags: ["big-data", "analytics", "unified"], rating: 4.5 },
  { name: "Palantir", website: "https://palantir.com", pricing: "paid", category: "data-analysis", description: "Big data analytics for enterprises", tags: ["big-data", "enterprise", "analytics"], rating: 4.2 },
  { name: "Looker", website: "https://looker.com", pricing: "paid", category: "data-analysis", description: "Business intelligence and data platform", tags: ["BI", "data", "platform"], rating: 4.3 },
  { name: "Qlik Sense", website: "https://qlik.com", pricing: "paid", category: "data-analysis", description: "Self-service data analytics platform", tags: ["self-service", "analytics", "visualization"], rating: 4.2 },
  { name: "SAS Viya", website: "https://sas.com", pricing: "paid", category: "data-analysis", description: "Advanced analytics and AI platform", tags: ["advanced", "analytics", "AI"], rating: 4.3 },
  { name: "IBM Watson", website: "https://watson.ibm.com", pricing: "paid", category: "data-analysis", description: "AI and machine learning services", tags: ["IBM", "AI", "services"], rating: 4.2 },
  { name: "Google Analytics Intelligence", website: "https://analytics.google.com", pricing: "freemium", category: "data-analysis", description: "Web analytics with AI insights", tags: ["web", "analytics", "insights"], rating: 4.4 },
  { name: "Sisense", website: "https://sisense.com", pricing: "paid", category: "data-analysis", description: "AI-driven analytics platform", tags: ["AI-driven", "analytics", "simplification"], rating: 4.3 },
  { name: "Domo", website: "https://domo.com", pricing: "paid", category: "data-analysis", description: "Cloud-based business intelligence", tags: ["cloud", "BI", "real-time"], rating: 4.2 },
  { name: "ThoughtSpot", website: "https://thoughtspot.com", pricing: "paid", category: "data-analysis", description: "Search-driven analytics platform", tags: ["search", "analytics", "self-service"], rating: 4.3 },

  // Marketing & SEO
  { name: "Semrush", website: "https://semrush.com", pricing: "paid", category: "marketing", description: "Comprehensive SEO and marketing toolkit", tags: ["SEO", "marketing", "comprehensive"], rating: 4.6 },
  { name: "Ahrefs", website: "https://ahrefs.com", pricing: "paid", category: "marketing", description: "SEO tools for link building and research", tags: ["SEO", "backlinks", "research"], rating: 4.7 },
  { name: "BrightEdge", website: "https://brightedge.com", pricing: "paid", category: "marketing", description: "Enterprise SEO and content platform", tags: ["enterprise", "SEO", "content"], rating: 4.4 },
  { name: "Conductor", website: "https://conductor.com", pricing: "paid", category: "marketing", description: "Organic marketing platform", tags: ["organic", "marketing", "platform"], rating: 4.3 },
  { name: "Clearscope", website: "https://clearscope.io", pricing: "paid", category: "marketing", description: "Content optimization for SEO", tags: ["content", "optimization", "SEO"], rating: 4.4 },
  { name: "ContentKing", website: "https://contentkingapp.com", pricing: "paid", category: "marketing", description: "Real-time SEO monitoring", tags: ["real-time", "SEO", "monitoring"], rating: 4.2 },
  { name: "Screaming Frog", website: "https://screamingfrog.co.uk", pricing: "freemium", category: "marketing", description: "SEO spider tool for website analysis", tags: ["spider", "analysis", "technical"], rating: 4.5 },
  { name: "Moz Pro", website: "https://moz.com", pricing: "paid", category: "marketing", description: "SEO software suite", tags: ["SEO", "suite", "tools"], rating: 4.3 },
  { name: "Ubersuggest", website: "https://ubersuggest.com", pricing: "freemium", category: "marketing", description: "SEO and content marketing tool", tags: ["SEO", "content", "keyword"], rating: 4.2 },
  { name: "KWFinder", website: "https://kwfinder.com", pricing: "paid", category: "marketing", description: "Keyword research tool", tags: ["keyword", "research", "SEO"], rating: 4.3 },
  { name: "Answer The Public", website: "https://answerthepublic.com", pricing: "freemium", category: "marketing", description: "Keyword and content research tool", tags: ["keyword", "content", "research"], rating: 4.1 },
  { name: "BuzzSumo", website: "https://buzzsumo.com", pricing: "paid", category: "marketing", description: "Content marketing and influencer research", tags: ["content", "influencer", "research"], rating: 4.4 },
  { name: "Hootsuite Insights", website: "https://hootsuite.com", pricing: "paid", category: "marketing", description: "Social media analytics and management", tags: ["social", "analytics", "management"], rating: 4.3 },

  // Design & Creative Tools
  { name: "Adobe Creative Cloud AI", website: "https://adobe.com", pricing: "paid", category: "design", description: "Adobe's suite with AI-powered features", tags: ["adobe", "suite", "creative"], rating: 4.7 },
  { name: "Figma AI", website: "https://figma.com", pricing: "freemium", category: "design", description: "Design platform with AI features", tags: ["design", "collaboration", "UI"], rating: 4.6 },
  { name: "Sketch", website: "https://sketch.com", pricing: "paid", category: "design", description: "Vector graphics editor for UI design", tags: ["vector", "UI", "design"], rating: 4.4 },
  { name: "Framer", website: "https://framer.com", pricing: "freemium", category: "design", description: "Design and prototyping tool", tags: ["prototyping", "design", "interactive"], rating: 4.5 },
  { name: "Looka", website: "https://looka.com", pricing: "paid", category: "design", description: "AI logo and brand identity generator", tags: ["logo", "branding", "AI"], rating: 4.2 },
  { name: "LogoMaker", website: "https://logomaker.com", pricing: "paid", category: "design", description: "AI-powered logo creation tool", tags: ["logo", "creation", "AI"], rating: 4.0 },
  { name: "Wix ADI", website: "https://wix.com", pricing: "freemium", category: "design", description: "AI website design intelligence", tags: ["website", "AI", "design"], rating: 4.1 },
  { name: "Squarespace", website: "https://squarespace.com", pricing: "paid", category: "design", description: "Website builder with design templates", tags: ["website", "builder", "templates"], rating: 4.3 },
  { name: "Webflow", website: "https://webflow.com", pricing: "freemium", category: "design", description: "Visual web design and development", tags: ["web", "visual", "development"], rating: 4.4 },
  { name: "Uizard", website: "https://uizard.io", pricing: "freemium", category: "design", description: "AI-powered UI design tool", tags: ["UI", "AI-powered", "rapid"], rating: 4.1 },
  { name: "Remove.bg", website: "https://remove.bg", pricing: "freemium", category: "design", description: "AI background removal tool", tags: ["background", "removal", "AI"], rating: 4.3 },
  { name: "Upscale.media", website: "https://upscale.media", pricing: "freemium", category: "design", description: "AI image upscaling and enhancement", tags: ["upscaling", "enhancement", "AI"], rating: 4.2 },
  { name: "Pfpmaker", website: "https://pfpmaker.com", pricing: "freemium", category: "design", description: "AI profile picture maker", tags: ["profile", "picture", "AI"], rating: 4.0 },
  { name: "Designify", website: "https://designify.com", pricing: "freemium", category: "design", description: "AI design automation tool", tags: ["automation", "design", "AI"], rating: 4.1 },

  // Customer Service & Support
  { name: "Zendesk AI", website: "https://zendesk.com", pricing: "paid", category: "customer-service", description: "Customer service platform with AI", tags: ["customer", "service", "support"], rating: 4.5 },
  { name: "Intercom", website: "https://intercom.com", pricing: "paid", category: "customer-service", description: "Customer messaging with AI chatbots", tags: ["messaging", "chatbots", "customer"], rating: 4.4 },
  { name: "Freshworks", website: "https://freshworks.com", pricing: "freemium", category: "customer-service", description: "Customer experience platform", tags: ["experience", "platform", "CRM"], rating: 4.3 },
  { name: "LiveChat", website: "https://livechat.com", pricing: "paid", category: "customer-service", description: "Live chat software with AI features", tags: ["live", "chat", "AI"], rating: 4.2 },
  { name: "Drift", website: "https://drift.com", pricing: "freemium", category: "customer-service", description: "Conversational marketing platform", tags: ["conversational", "marketing", "chatbots"], rating: 4.3 },
  { name: "Ada", website: "https://ada.cx", pricing: "paid", category: "customer-service", description: "AI customer service automation", tags: ["automation", "customer", "AI"], rating: 4.2 },
  { name: "Bold360", website: "https://bold360.com", pricing: "paid", category: "customer-service", description: "AI-powered customer engagement", tags: ["engagement", "AI-powered", "customer"], rating: 4.1 },
  { name: "IBM Watson Assistant", website: "https://watson.ibm.com", pricing: "paid", category: "customer-service", description: "Enterprise AI assistant platform", tags: ["enterprise", "assistant", "IBM"], rating: 4.2 },
  { name: "Microsoft Bot Framework", website: "https://dev.botframework.com", pricing: "free", category: "customer-service", description: "Bot development framework", tags: ["bot", "development", "framework"], rating: 4.0 },
  { name: "Dialogflow", website: "https://dialogflow.cloud.google.com", pricing: "freemium", category: "customer-service", description: "Google's conversational AI platform", tags: ["conversational", "Google", "NLP"], rating: 4.3 },
  { name: "Rasa", website: "https://rasa.com", pricing: "freemium", category: "customer-service", description: "Open-source conversational AI", tags: ["open-source", "conversational", "AI"], rating: 4.1 },
  { name: "Botpress", website: "https://botpress.com", pricing: "freemium", category: "customer-service", description: "Open-source chatbot platform", tags: ["open-source", "chatbot", "platform"], rating: 4.0 },
  { name: "Tidio", website: "https://tidio.com", pricing: "freemium", category: "customer-service", description: "Live chat with chatbot integration", tags: ["live", "chat", "integration"], rating: 4.2 },
  { name: "Crisp", website: "https://crisp.chat", pricing: "freemium", category: "customer-service", description: "Customer messaging platform", tags: ["messaging", "customer", "platform"], rating: 4.1 },
  { name: "Helpshift", website: "https://helpshift.com", pricing: "paid", category: "customer-service", description: "In-app customer support platform", tags: ["in-app", "support", "mobile"], rating: 4.2 },

  // Translation & Language
  { name: "DeepL", website: "https://deepl.com", pricing: "freemium", category: "translation", description: "High-quality AI translation service", tags: ["translation", "quality", "languages"], rating: 4.6 },
  { name: "Google Translate", website: "https://translate.google.com", pricing: "free", category: "translation", description: "Free translation service by Google", tags: ["free", "Google", "translation"], rating: 4.2 },
  { name: "Microsoft Translator", website: "https://translator.microsoft.com", pricing: "free", category: "translation", description: "Translation service by Microsoft", tags: ["Microsoft", "translation", "free"], rating: 4.1 },
  { name: "Reverso", website: "https://reverso.net", pricing: "freemium", category: "translation", description: "Translation with context examples", tags: ["context", "examples", "translation"], rating: 4.0 },
  { name: "Linguee", website: "https://linguee.com", pricing: "free", category: "translation", description: "Translation dictionary with examples", tags: ["dictionary", "examples", "free"], rating: 4.1 },
  { name: "Unbabel", website: "https://unbabel.com", pricing: "paid", category: "translation", description: "AI translation for customer support", tags: ["customer", "support", "AI"], rating: 4.2 },
  { name: "Phrase", website: "https://phrase.com", pricing: "paid", category: "translation", description: "Translation management platform", tags: ["management", "platform", "localization"], rating: 4.3 },
  { name: "Lokalise", website: "https://lokalise.com", pricing: "paid", category: "translation", description: "Translation and localization platform", tags: ["localization", "platform", "collaboration"], rating: 4.2 },
  { name: "Smartling", website: "https://smartling.com", pricing: "paid", category: "translation", description: "Enterprise translation platform", tags: ["enterprise", "platform", "automation"], rating: 4.3 },
  { name: "SYSTRAN", website: "https://systran.net", pricing: "paid", category: "translation", description: "Professional translation software", tags: ["professional", "software", "neural"], rating: 4.1 },
  { name: "ModernMT", website: "https://modernmt.com", pricing: "freemium", category: "translation", description: "Adaptive machine translation", tags: ["adaptive", "machine", "translation"], rating: 4.0 },
  { name: "Lilt", website: "https://lilt.com", pricing: "paid", category: "translation", description: "AI-powered translation platform", tags: ["AI-powered", "platform", "efficiency"], rating: 4.2 },
  { name: "Amazon Translate", website: "https://aws.amazon.com/translate", pricing: "paid", category: "translation", description: "Neural machine translation service", tags: ["neural", "AWS", "service"], rating: 4.1 },
  { name: "Watson Language Translator", website: "https://watson.ibm.com", pricing: "paid", category: "translation", description: "IBM's AI translation service", tags: ["IBM", "AI", "service"], rating: 4.0 },
  { name: "Yandex Translate", website: "https://translate.yandex.com", pricing: "free", category: "translation", description: "Free translation by Yandex", tags: ["free", "Yandex", "translation"], rating: 3.9 },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get category mappings
    const { data: categories, error: categoriesError } = await supabaseClient
      .from('categories')
      .select('id, slug')

    if (categoriesError) {
      throw categoriesError
    }

    const categoryMap = categories.reduce((acc: Record<string, string>, cat) => {
      acc[cat.slug] = cat.id
      return acc
    }, {})

    // Insert tools
    const toolsToInsert = aiToolsData.map(tool => ({
      name: tool.name,
      description: tool.description,
      website: tool.website,
      category_id: categoryMap[tool.category],
      pricing: tool.pricing,
      rating: tool.rating,
      tags: tool.tags,
      featured: false,
      trending: false,
    }))

    const { error: insertError } = await supabaseClient
      .from('tools')
      .insert(toolsToInsert)

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully inserted ${aiToolsData.length} AI tools` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
