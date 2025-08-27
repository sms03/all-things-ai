
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting to populate tools...')

    // First, get all categories to map them
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }

    console.log('Categories found:', categories?.length)

    // Create a map of category slug to category id
    const categoryMap = new Map()
    categories?.forEach(cat => {
      categoryMap.set(cat.slug, cat.id)
    })

    // Define the tools data
    const toolsData = [
      // Conversational AI & Chatbots
      { name: 'ChatGPT', description: 'Advanced conversational AI chatbot by OpenAI', website: 'https://chat.openai.com', category_slug: 'chatbots', pricing: 'freemium', rating: 4.8, tags: ['chat', 'ai', 'conversation'] },
      { name: 'Claude', description: 'AI assistant by Anthropic for conversations and analysis', website: 'https://claude.ai', category_slug: 'chatbots', pricing: 'freemium', rating: 4.7, tags: ['chat', 'ai', 'assistant'] },
      { name: 'Google Gemini', description: 'Google\'s advanced AI model for conversations', website: 'https://gemini.google.com', category_slug: 'chatbots', pricing: 'freemium', rating: 4.6, tags: ['google', 'ai', 'chat'] },
      { name: 'Microsoft Copilot', description: 'AI-powered assistant by Microsoft', website: 'https://copilot.microsoft.com', category_slug: 'chatbots', pricing: 'freemium', rating: 4.5, tags: ['microsoft', 'ai', 'assistant'] },
      { name: 'Perplexity AI', description: 'AI-powered search and answer engine', website: 'https://perplexity.ai', category_slug: 'chatbots', pricing: 'freemium', rating: 4.4, tags: ['search', 'ai', 'answers'] },
      
      // AI Agents
      { name: 'AutoGPT', description: 'Autonomous GPT-4 agent for complex task automation', website: 'https://autogpt.net', category_slug: 'chatbots', pricing: 'free', rating: 4.2, tags: ['ai-agent', 'automation', 'autonomous', 'gpt-4'] },
      { name: 'BabyAGI', description: 'Autonomous AI agent for task management and execution', website: 'https://github.com/yoheinakajima/babyagi', category_slug: 'productivity', pricing: 'free', rating: 4.1, tags: ['ai-agent', 'task-management', 'autonomous'] },
      { name: 'LangChain Agents', description: 'Framework for building autonomous AI agents', website: 'https://langchain.com', category_slug: 'developer', pricing: 'free', rating: 4.3, tags: ['ai-agent', 'framework', 'autonomous', 'langchain'] },
      { name: 'Multi-Agent System', description: 'CrewAI multi-agent collaboration framework', website: 'https://crewai.com', category_slug: 'productivity', pricing: 'freemium', rating: 4.0, tags: ['ai-agent', 'collaboration', 'multi-agent', 'crew'] },
      { name: 'Agent GPT', description: 'Browser-based autonomous AI agent platform', website: 'https://agentgpt.reworkd.ai', category_slug: 'productivity', pricing: 'freemium', rating: 4.1, tags: ['ai-agent', 'browser', 'autonomous'] },
      { name: 'MetaGPT', description: 'Multi-agent framework for software development', website: 'https://github.com/geekan/MetaGPT', category_slug: 'developer', pricing: 'free', rating: 4.2, tags: ['ai-agent', 'software-development', 'multi-agent'] },
      { name: 'SuperAGI', description: 'Open-source autonomous AI agent framework', website: 'https://superagi.com', category_slug: 'productivity', pricing: 'free', rating: 4.0, tags: ['ai-agent', 'open-source', 'autonomous'] },
      { name: 'Godmode AI', description: 'Web-based autonomous AI agent for various tasks', website: 'https://godmode.space', category_slug: 'productivity', pricing: 'free', rating: 3.9, tags: ['ai-agent', 'web-based', 'autonomous'] },
      
      // MCP Servers
      { name: 'GitHub MCP Server', description: 'Model Context Protocol server for GitHub integration', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.4, tags: ['mcp-server', 'github', 'integration', 'protocol'] },
      { name: 'PostgreSQL MCP Server', description: 'MCP server for PostgreSQL database operations', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.3, tags: ['mcp-server', 'postgresql', 'database'] },
      { name: 'Filesystem MCP Server', description: 'Model Context Protocol server for file operations', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.2, tags: ['mcp-server', 'filesystem', 'files'] },
      { name: 'Slack MCP Server', description: 'MCP server for Slack workspace integration', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'productivity', pricing: 'free', rating: 4.1, tags: ['mcp-server', 'slack', 'communication'] },
      { name: 'Google Drive MCP Server', description: 'Model Context Protocol server for Google Drive', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'productivity', pricing: 'free', rating: 4.0, tags: ['mcp-server', 'google-drive', 'storage'] },
      { name: 'SQLite MCP Server', description: 'MCP server for SQLite database operations', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.2, tags: ['mcp-server', 'sqlite', 'database'] },
      { name: 'Brave Search MCP Server', description: 'Model Context Protocol server for Brave Search', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'productivity', pricing: 'free', rating: 4.0, tags: ['mcp-server', 'brave-search', 'search'] },
      { name: 'AWS MCP Server', description: 'MCP server for Amazon Web Services integration', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.3, tags: ['mcp-server', 'aws', 'cloud'] },
      { name: 'Docker MCP Server', description: 'Model Context Protocol server for Docker operations', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.1, tags: ['mcp-server', 'docker', 'containers'] },
      { name: 'Kubernetes MCP Server', description: 'MCP server for Kubernetes cluster management', website: 'https://github.com/modelcontextprotocol/servers', category_slug: 'developer', pricing: 'free', rating: 4.2, tags: ['mcp-server', 'kubernetes', 'orchestration'] },
      
      // Content Writing & Copywriting
      { name: 'Jasper AI', description: 'AI writing assistant for content creation', website: 'https://jasper.ai', category_slug: 'text-copywriting', pricing: 'paid', rating: 4.5, tags: ['writing', 'content', 'copywriting'] },
      { name: 'Copy.ai', description: 'AI-powered copywriting tool', website: 'https://copy.ai', category_slug: 'text-copywriting', pricing: 'freemium', rating: 4.3, tags: ['copywriting', 'ai', 'marketing'] },
      { name: 'Writesonic', description: 'AI writer for articles, blogs, and ads', website: 'https://writesonic.com', category_slug: 'text-copywriting', pricing: 'freemium', rating: 4.2, tags: ['writing', 'blogs', 'ads'] },
      { name: 'Rytr', description: 'AI writing assistant for various content types', website: 'https://rytr.me', category_slug: 'text-copywriting', pricing: 'freemium', rating: 4.1, tags: ['writing', 'ai', 'content'] },
      
      // Image Generation & Editing
      { name: 'DALL-E 3', description: 'Advanced AI image generator by OpenAI', website: 'https://openai.com/dall-e-3', category_slug: 'image-art', pricing: 'paid', rating: 4.8, tags: ['image', 'generation', 'ai'] },
      { name: 'Midjourney', description: 'AI image generation through Discord', website: 'https://midjourney.com', category_slug: 'image-art', pricing: 'paid', rating: 4.7, tags: ['image', 'art', 'generation'] },
      { name: 'Stable Diffusion', description: 'Open-source AI image generation model', website: 'https://stability.ai', category_slug: 'image-art', pricing: 'freemium', rating: 4.6, tags: ['image', 'open-source', 'generation'] },
      { name: 'Adobe Firefly', description: 'Adobe\'s AI-powered creative tools', website: 'https://firefly.adobe.com', category_slug: 'image-art', pricing: 'freemium', rating: 4.5, tags: ['adobe', 'creative', 'ai'] },
      
      // Video Generation & Editing
      { name: 'Runway ML', description: 'AI-powered video editing and generation', website: 'https://runwayml.com', category_slug: 'video-audio', pricing: 'freemium', rating: 4.6, tags: ['video', 'editing', 'generation'] },
      { name: 'Synthesia', description: 'AI video generation with avatars', website: 'https://synthesia.io', category_slug: 'video-audio', pricing: 'paid', rating: 4.5, tags: ['video', 'avatars', 'generation'] },
      { name: 'D-ID', description: 'AI-powered video creation platform', website: 'https://d-id.com', category_slug: 'video-audio', pricing: 'freemium', rating: 4.3, tags: ['video', 'ai', 'creation'] },
      
      // Audio & Music Generation
      { name: 'ElevenLabs', description: 'AI voice synthesis and cloning', website: 'https://elevenlabs.io', category_slug: 'audio-music', pricing: 'freemium', rating: 4.7, tags: ['voice', 'synthesis', 'ai'] },
      { name: 'Murf AI', description: 'AI voice generator for voiceovers', website: 'https://murf.ai', category_slug: 'audio-music', pricing: 'freemium', rating: 4.4, tags: ['voice', 'voiceover', 'ai'] },
      { name: 'AIVA', description: 'AI music composition assistant', website: 'https://aiva.ai', category_slug: 'audio-music', pricing: 'freemium', rating: 4.3, tags: ['music', 'composition', 'ai'] },
      
      // Code Generation & Development
      { name: 'GitHub Copilot', description: 'AI pair programmer by GitHub', website: 'https://github.com/features/copilot', category_slug: 'developer', pricing: 'paid', rating: 4.6, tags: ['coding', 'programming', 'github'] },
      { name: 'Tabnine', description: 'AI code completion assistant', website: 'https://tabnine.com', category_slug: 'developer', pricing: 'freemium', rating: 4.3, tags: ['coding', 'completion', 'ai'] },
      { name: 'Cursor', description: 'AI-powered code editor', website: 'https://cursor.sh', category_slug: 'developer', pricing: 'freemium', rating: 4.5, tags: ['editor', 'coding', 'ai'] },
      
      // Productivity & Automation
      { name: 'Notion AI', description: 'AI-powered workspace and note-taking', website: 'https://notion.so', category_slug: 'productivity', pricing: 'freemium', rating: 4.4, tags: ['notes', 'workspace', 'productivity'] },
      { name: 'Grammarly', description: 'AI writing assistant and grammar checker', website: 'https://grammarly.com', category_slug: 'productivity', pricing: 'freemium', rating: 4.5, tags: ['writing', 'grammar', 'productivity'] },
      { name: 'Otter.ai', description: 'AI meeting transcription and notes', website: 'https://otter.ai', category_slug: 'productivity', pricing: 'freemium', rating: 4.3, tags: ['transcription', 'meetings', 'notes'] },
      
      // Design & Creative Tools
      { name: 'Canva AI', description: 'AI-powered design platform', website: 'https://canva.com', category_slug: 'design', pricing: 'freemium', rating: 4.6, tags: ['design', 'graphics', 'templates'] },
      { name: 'Figma AI', description: 'Collaborative design tool with AI features', website: 'https://figma.com', category_slug: 'design', pricing: 'freemium', rating: 4.7, tags: ['design', 'collaboration', 'ui'] },
      { name: 'Looka', description: 'AI-powered logo and brand design', website: 'https://looka.com', category_slug: 'design', pricing: 'paid', rating: 4.2, tags: ['logo', 'branding', 'design'] }
    ]

    console.log('Preparing to insert tools:', toolsData.length)

    // Prepare tools with category IDs
    const toolsToInsert = toolsData.map(tool => ({
      name: tool.name,
      description: tool.description,
      website: tool.website,
      category_id: categoryMap.get(tool.category_slug),
      pricing: tool.pricing,
      rating: tool.rating,
      tags: tool.tags,
      featured: Math.random() > 0.8, // Randomly mark some as featured
      trending: Math.random() > 0.9  // Randomly mark some as trending
    })).filter(tool => tool.category_id) // Only include tools with valid categories

    console.log('Tools to insert:', toolsToInsert.length)

    // Check if tools already exist
    const { data: existingTools, error: existingError } = await supabase
      .from('tools')
      .select('name')

    if (existingError) {
      console.error('Error checking existing tools:', existingError)
      throw new Error(`Failed to check existing tools: ${existingError.message}`)
    }

    const existingToolNames = new Set(existingTools?.map(tool => tool.name) || [])
    console.log('Existing tools count:', existingTools?.length || 0)

    // Filter out tools that already exist
    const newToolsToInsert = toolsToInsert.filter(tool => !existingToolNames.has(tool.name))
    console.log('New tools to insert:', newToolsToInsert.length)

    if (newToolsToInsert.length === 0) {
      console.log('No new tools to insert - all tools already exist')
      return new Response(
        JSON.stringify({ 
          message: 'All tools already exist in the database!',
          details: {
            categoriesFound: categories?.length,
            toolsProcessed: toolsToInsert.length,
            toolsInserted: 0,
            existingTools: existingTools?.length || 0
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Insert new tools in batches
    const batchSize = 10
    let totalInserted = 0

    for (let i = 0; i < newToolsToInsert.length; i += batchSize) {
      const batch = newToolsToInsert.slice(i, i + batchSize)
      console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}:`, batch.length, 'tools')
      
      const { data, error } = await supabase
        .from('tools')
        .insert(batch)
        .select()

      if (error) {
        console.error('Error inserting batch:', error)
        throw new Error(`Failed to insert tools batch: ${error.message}`)
      }

      totalInserted += data?.length || 0
      console.log(`Batch inserted successfully. Data:`, data?.length)
    }

    console.log('Population complete. Total tools processed:', totalInserted)

    return new Response(
      JSON.stringify({ 
        message: `Successfully populated ${totalInserted} AI tools!`,
        details: {
          categoriesFound: categories?.length,
          toolsProcessed: toolsToInsert.length,
          toolsInserted: totalInserted
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in populate-tools function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
