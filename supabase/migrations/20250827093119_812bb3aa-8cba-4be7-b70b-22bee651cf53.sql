-- Add comprehensive list of AI tools from user images with proper categorization

-- Insert new AI tools with proper categorization
INSERT INTO public.tools (name, description, website, pricing, category_id, tags, rating, featured, trending, status) VALUES

-- Code Generation & Development Tools
('Cognition AI', 'AI-powered coding assistant that helps developers write better code faster', 'https://cognition.ai/', 'paid', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['AI Coding', 'Development', 'Code Assistant', 'Programming'], 4.3, false, true, 'approved'),
('Sourcegraph', 'AI-powered code search and navigation platform for development teams', 'https://sourcegraph.com/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Code Search', 'Development', 'AI Assistant', 'Team Collaboration'], 4.4, false, false, 'approved'),
('LiteLLM', 'Unified API for 100+ LLMs - call all LLM APIs using the OpenAI format', 'https://www.litellm.ai/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['LLM API', 'Development', 'Integration', 'AI Models'], 4.2, false, false, 'approved'),
('CopilotKit', 'Open-source React components for AI copilots and chatbots', 'https://www.copilotkit.ai/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['React', 'Open Source', 'Chatbots', 'Development'], 4.1, true, false, 'approved'),
('Bolt.new', 'AI-powered web development platform for rapid prototyping', 'https://bolt.new/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Web Development', 'Prototyping', 'AI Assistant', 'No Code'], 4.5, true, true, 'approved'),
('V0.dev', 'AI-powered UI generation tool by Vercel for React components', 'https://v0.dev/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['UI Generation', 'React', 'Components', 'Vercel'], 4.6, true, true, 'approved'),
('Replit', 'Collaborative AI-powered coding platform with real-time collaboration', 'https://replicate.com/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Collaborative Coding', 'AI Assistant', 'Cloud IDE', 'Development'], 4.4, false, false, 'approved'),
('OpenRouter', 'API gateway for accessing multiple AI models through one interface', 'https://openrouter.ai/', 'paid', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['API Gateway', 'AI Models', 'Development', 'Integration'], 4.3, false, false, 'approved'),
('GitHub Copilot Chat', 'AI-powered coding assistant integrated with GitHub', 'https://github.com/features/copilot', 'paid', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['GitHub', 'AI Assistant', 'Code Completion', 'Development'], 4.7, true, false, 'approved'),
('GitIngest', 'Convert any Git repository into a single LLM-friendly text file', 'https://gitingest.com/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Git', 'Documentation', 'LLM', 'Repository Analysis'], 4.0, false, false, 'approved'),
('GitDiagram', 'Generate diagrams from your Git repository structure', 'https://gitdiagram.com/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Git', 'Diagrams', 'Visualization', 'Repository'], 3.9, false, false, 'approved'),
('AnythingLLM', 'Full-stack application for turning any document into an intelligent chatbot', 'https://anythingllm.com/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Chatbot', 'Document Processing', 'Open Source', 'LLM'], 4.2, false, true, 'approved'),
('LM Studio', 'Desktop application for running LLMs locally on your machine', 'https://lmstudio.ai/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Local LLM', 'Desktop App', 'AI Models', 'Privacy'], 4.5, false, true, 'approved'),
('Google IDX', 'AI-powered cloud-based development environment by Google', 'https://idx.google.com/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Cloud IDE', 'Google', 'Development Environment', 'AI Assistant'], 4.3, false, true, 'approved'),

-- Conversational AI & Chatbots
('Character.AI', 'Platform for creating and chatting with AI characters and personalities', 'https://character.ai/', 'freemium', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['AI Characters', 'Chat', 'Entertainment', 'Roleplay'], 4.4, true, true, 'approved'),
('Claude AI', 'Anthropic''s advanced AI assistant for conversations and analysis', 'https://claude.ai/chats', 'freemium', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['AI Assistant', 'Anthropic', 'Conversation', 'Analysis'], 4.7, true, true, 'approved'),
('Ora.ai', 'Build custom AI chatbots and deploy them anywhere', 'https://ora.ai/', 'freemium', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Custom Chatbots', 'No Code', 'Deployment', 'AI Builder'], 4.2, false, false, 'approved'),
('Chat2DB', 'AI-powered database client with natural language queries', 'https://chat2db.ai/', 'freemium', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Database', 'SQL', 'Natural Language', 'Data Query'], 4.3, false, false, 'approved'),
('Qwen Chat', 'Alibaba''s large language model for conversations and tasks', 'https://chat.qwen.ai/', 'free', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Alibaba', 'LLM', 'Chat', 'AI Assistant'], 4.1, false, true, 'approved'),
('OpenWebUI', 'Self-hosted web interface for running LLMs locally', 'https://openwebui.com/', 'free', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Self-hosted', 'Open Source', 'Local LLM', 'Web Interface'], 4.4, false, true, 'approved'),
('MeetCody', 'AI assistant that can be trained on your business data and processes', 'https://meetcody.ai/', 'paid', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Business AI', 'Custom Training', 'AI Assistant', 'Enterprise'], 4.0, false, false, 'approved'),
('Chat4Data', 'AI-powered data analysis through natural language conversations', 'https://chat4data.ai/', 'freemium', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Data Analysis', 'Natural Language', 'Business Intelligence', 'Chat'], 4.2, false, false, 'approved'),

-- Image Generation & Editing
('Novita AI', 'Comprehensive AI platform for image generation, editing, and enhancement', 'https://novita.ai/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Image Generation', 'AI Art', 'Photo Enhancement', 'Multiple Models'], 4.3, false, true, 'approved'),
('Lexica Art', 'AI art generator and search engine for Stable Diffusion images', 'https://lexica.art/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['AI Art', 'Stable Diffusion', 'Art Search', 'Image Generation'], 4.4, true, false, 'approved'),
('Playground AI', 'Easy-to-use AI image generator with multiple artistic styles', 'https://playgroundai.com/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['AI Art', 'Image Generation', 'Artistic Styles', 'Easy to Use'], 4.5, true, true, 'approved'),
('PicFinder AI', 'AI-powered image search and generation tool', 'https://picfinder.ai/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Image Search', 'AI Generation', 'Photo Finding', 'Visual Search'], 4.1, false, false, 'approved'),
('Pika Art', 'AI video and image generator with text-to-visual capabilities', 'https://pika.art/try', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['AI Video', 'Text to Video', 'Image Generation', 'Creative'], 4.4, true, true, 'approved'),
('Ideogram', 'AI image generator with exceptional text rendering capabilities', 'https://ideogram.ai/t/explore', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['AI Art', 'Text in Images', 'Image Generation', 'Typography'], 4.6, true, true, 'approved'),
('AutoDraw', 'Google''s AI-powered drawing tool that suggests drawings', 'https://autodraw.com/', 'free', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Google', 'Drawing Assistant', 'AI Art', 'Free'], 4.0, false, false, 'approved'),
('Flux by Black Forest Labs', 'Advanced AI image generation model with high quality outputs', 'https://blackforestlabs.io/flux-1/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['AI Art', 'High Quality', 'Image Generation', 'Advanced Model'], 4.7, true, true, 'approved'),
('Krea AI', 'Real-time AI image generation and editing platform', 'https://www.krea.ai/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Real-time Generation', 'AI Art', 'Image Editing', 'Creative Tools'], 4.5, true, true, 'approved'),
('Stylar AI', 'AI-powered image editing with style transfer and enhancement', 'https://www.stylar.ai/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Style Transfer', 'Image Editing', 'AI Enhancement', 'Creative'], 4.3, false, false, 'approved'),
('Pikzels', 'AI-powered thumbnail and image generator for content creators', 'https://pikzels.com/', 'freemium', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Thumbnails', 'Content Creation', 'AI Generation', 'Marketing'], 4.2, false, false, 'approved'),
('Color Anything', 'AI tool for automatic image colorization and color manipulation', 'https://color-anything.com/', 'free', '2d5ea5a3-d132-4609-af44-d09630e7b51c', ARRAY['Colorization', 'Image Processing', 'Color Manipulation', 'Photo Enhancement'], 3.9, false, false, 'approved'),

-- Video Generation & Editing
('HaiLuo AI Video', 'Advanced AI video generation platform with realistic outputs', 'https://hailuoai.video/', 'freemium', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['AI Video', 'Video Generation', 'Realistic', 'Text to Video'], 4.4, true, true, 'approved'),
('RunwayML', 'AI-powered video editing and generation platform for creators', 'https://runwayml.com/', 'freemium', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['Video Editing', 'AI Video', 'Creative Tools', 'Machine Learning'], 4.6, true, true, 'approved'),
('Pixverse AI', 'AI video generation platform with character consistency', 'https://app.pixverse.ai/onboard', 'freemium', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['AI Video', 'Character Consistency', 'Animation', 'Video Generation'], 4.3, false, true, 'approved'),
('HeyGen', 'AI video generation platform with realistic avatars and voices', 'https://www.heygen.com/', 'paid', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['AI Avatars', 'Voice Synthesis', 'Video Generation', 'Business'], 4.5, true, false, 'approved'),
('Vidu Studio', 'AI-powered video creation and editing platform', 'https://www.vidu.studio/', 'freemium', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['Video Creation', 'AI Editing', 'Content Creation', 'Studio Tools'], 4.2, false, false, 'approved'),
('Kling AI', 'Advanced AI video generation with long-duration capabilities', 'https://www.klingai.com/', 'freemium', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['Long Video', 'AI Generation', 'High Quality', 'Advanced'], 4.4, true, true, 'approved'),
('AutoShorts AI', 'AI platform for creating short-form video content automatically', 'https://autoshorts.ai/', 'paid', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['Short Videos', 'Content Automation', 'Social Media', 'AI Creation'], 4.1, false, true, 'approved'),
('LensGo AI', 'AI-powered video and image generation with style control', 'https://lensgo.ai/', 'freemium', 'a703ff06-0743-4f72-811f-d46e44346650', ARRAY['Video Generation', 'Style Control', 'AI Creation', 'Image to Video'], 4.3, false, false, 'approved'),

-- Audio & Music Generation
('Suno AI', 'AI music generation platform for creating songs with lyrics', 'https://suno.com/', 'freemium', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['AI Music', 'Song Generation', 'Lyrics', 'Music Creation'], 4.6, true, true, 'approved'),
('Beatoven AI', 'AI-powered music composition for content creators', 'https://www.beatoven.ai/', 'freemium', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Music Composition', 'Content Creation', 'Royalty Free', 'AI Music'], 4.3, false, false, 'approved'),
('Mubert', 'AI-generated royalty-free music for content and apps', 'https://mubert.com/', 'freemium', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Royalty Free', 'AI Music', 'Content Creation', 'Background Music'], 4.4, false, false, 'approved'),
('Vocal Remover', 'AI-powered tool for removing vocals from songs', 'https://vocalremover.org/', 'free', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Vocal Removal', 'Audio Processing', 'Karaoke', 'Music Editing'], 4.1, false, false, 'approved'),
('VoiceMod Text to Song', 'Convert text into songs with AI-generated vocals', 'https://www.voicemod.net/text-to-song', 'freemium', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Text to Song', 'AI Vocals', 'Music Generation', 'Voice Synthesis'], 4.0, false, false, 'approved'),
('X-Minus Pro', 'Professional karaoke and vocal removal service', 'https://x-minus.pro/', 'paid', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Karaoke', 'Vocal Removal', 'Professional', 'Audio Processing'], 4.2, false, false, 'approved'),
('Adobe Podcast Enhance', 'AI-powered audio enhancement for podcasts and recordings', 'https://podcast.adobe.com/enhance', 'free', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Adobe', 'Podcast', 'Audio Enhancement', 'Noise Reduction'], 4.5, true, false, 'approved'),
('ElevenLabs', 'Advanced AI voice synthesis and cloning platform', 'https://elevenlabs.io/', 'freemium', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Voice Synthesis', 'Voice Cloning', 'Text to Speech', 'AI Voice'], 4.7, true, true, 'approved'),
('AssemblyAI', 'AI-powered speech recognition and audio intelligence API', 'https://www.assemblyai.com/', 'paid', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Speech Recognition', 'API', 'Audio Intelligence', 'Transcription'], 4.4, false, false, 'approved'),
('Deepgram', 'AI speech recognition and understanding platform', 'https://deepgram.com/', 'paid', '38cd8e05-7b22-4867-b5ee-b9d750765e15', ARRAY['Speech AI', 'Voice Recognition', 'Real-time', 'API'], 4.5, false, false, 'approved'),

-- Content Writing & Copywriting
('Copy.ai', 'AI-powered copywriting tool for marketing and business content', 'https://www.copy.ai/', 'freemium', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['Copywriting', 'Marketing', 'Business Content', 'AI Writing'], 4.4, true, false, 'approved'),
('Jasper AI', 'Enterprise-grade AI writing assistant for marketing teams', 'https://www.jasper.ai/', 'paid', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['Enterprise', 'Marketing', 'AI Writing', 'Team Collaboration'], 4.5, true, false, 'approved'),
('Gravity Write', 'AI writing tool for creating various types of content', 'https://app.gravitywrite.com/home', 'freemium', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['Content Creation', 'AI Writing', 'Multiple Formats', 'Marketing'], 4.2, false, false, 'approved'),
('HyperWrite AI', 'AI writing assistant with research and citation capabilities', 'https://www.hyperwriteai.com/', 'freemium', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['AI Writing', 'Research', 'Citations', 'Academic'], 4.3, false, false, 'approved'),
('Literally Anything', 'AI platform that can create anything from text descriptions', 'https://www.literallyanything.io/', 'freemium', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['Text to Creation', 'Versatile AI', 'Content Generation', 'Creative'], 4.1, false, true, 'approved'),
('PDF.ai', 'AI-powered PDF analysis and question-answering tool', 'https://pdf.ai/', 'freemium', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['PDF Analysis', 'Document AI', 'Q&A', 'Research'], 4.3, false, false, 'approved'),
('Fal.ai', 'Fast inference platform for AI models and content generation', 'https://fal.ai/', 'paid', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['AI Inference', 'Fast Generation', 'API', 'Content Creation'], 4.2, false, false, 'approved'),
('ContentCore', 'AI-powered content creation and optimization platform', 'https://contentcore.xyz/', 'freemium', '1c6657ff-c781-47d9-9b8e-3899a0137f7a', ARRAY['Content Optimization', 'SEO', 'AI Writing', 'Marketing'], 4.1, false, false, 'approved'),

-- Design & Creative Tools
('Framer AI', 'AI-powered web design tool with no-code capabilities', 'https://www.framer.com/ai', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Web Design', 'No Code', 'AI Design', 'Prototyping'], 4.5, true, true, 'approved'),
('Uizard', 'AI-powered UI/UX design tool for rapid prototyping', 'https://uizard.io/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['UI Design', 'Prototyping', 'AI Design', 'UX'], 4.4, false, false, 'approved'),
('Gamma', 'AI-powered presentation and webpage creation tool', 'https://gamma.app/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Presentations', 'Web Pages', 'AI Design', 'Content Creation'], 4.6, true, true, 'approved'),
('Canva AI (via Magic Studio)', 'AI-powered design features integrated into Canva', 'https://www.canva.com/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Graphic Design', 'AI Features', 'Templates', 'Easy Design'], 4.7, true, false, 'approved'),
('Figma AI', 'AI features integrated into Figma for design assistance', 'https://www.figma.com/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Design Tool', 'Collaboration', 'AI Features', 'Prototyping'], 4.8, true, false, 'approved'),
('Subframe', 'AI-powered component library and design system builder', 'https://www.subframe.com/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Design System', 'Components', 'AI Generation', 'Development'], 4.3, false, true, 'approved'),
('EdrawMax', 'AI-enhanced diagramming and design software', 'https://edrawmax.wondershare.com/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Diagramming', 'Design Software', 'AI Features', 'Business'], 4.2, false, false, 'approved'),
('InfographFX', 'AI-powered infographic creation tool', 'https://infografix.app/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['Infographics', 'Data Visualization', 'AI Design', 'Marketing'], 4.1, false, false, 'approved'),

-- Productivity & Automation
('Notion AI', 'AI-powered features integrated into Notion workspace', 'https://notion.so/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Productivity', 'Workspace', 'AI Writing', 'Organization'], 4.6, true, false, 'approved'),
('Zapier', 'Automation platform connecting thousands of apps with AI features', 'https://zapier.com/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Automation', 'Integration', 'Workflow', 'AI Features'], 4.5, true, false, 'approved'),
('Make (Integromat)', 'Visual automation platform with AI integration capabilities', 'https://www.make.com/en', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Automation', 'Visual Builder', 'Integration', 'AI Workflows'], 4.4, false, false, 'approved'),
('Raycast', 'Productivity launcher with AI-powered features for Mac', 'https://www.raycast.com/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Mac Productivity', 'Launcher', 'AI Features', 'Efficiency'], 4.7, false, true, 'approved'),
('TripNotes AI', 'AI-powered travel planning and note-taking app', 'https://tripnotes.ai/app', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Travel Planning', 'Note Taking', 'AI Assistant', 'Organization'], 4.0, false, false, 'approved'),
('Napkin AI', 'AI-powered visual note-taking and idea organization', 'https://www.napkin.ai/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Visual Notes', 'Idea Organization', 'AI Features', 'Creativity'], 4.2, false, false, 'approved'),
('NotebookLM', 'Google''s AI-powered research and note-taking assistant', 'https://notebooklm.google/', 'free', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Google', 'Research', 'Note Taking', 'AI Assistant'], 4.4, true, true, 'approved'),
('Guidde', 'AI-powered video documentation and tutorial creation', 'https://www.guidde.com/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Documentation', 'Video Tutorials', 'AI Creation', 'Productivity'], 4.3, false, false, 'approved'),

-- Data Analysis & Business Intelligence
('Perplexity AI', 'AI-powered search engine with real-time information and sources', 'https://www.perplexity.ai/', 'freemium', 'c9dd9f71-2768-4c76-adb1-49465ae468b4', ARRAY['AI Search', 'Research', 'Real-time Data', 'Sources'], 4.6, true, true, 'approved'),
('Mindgrasp AI', 'AI study assistant that creates notes, summaries, and quizzes', 'https://www.mindgrasp.ai/', 'freemium', 'c9dd9f71-2768-4c76-adb1-49465ae468b4', ARRAY['Study Assistant', 'Note Taking', 'Summaries', 'Education'], 4.3, false, false, 'approved'),
('DataButton', 'AI-powered data analysis and visualization platform', 'https://databutton.com/', 'freemium', 'c9dd9f71-2768-4c76-adb1-49465ae468b4', ARRAY['Data Analysis', 'Visualization', 'AI Insights', 'Business Intelligence'], 4.2, false, false, 'approved'),
('Artificial Analysis', 'Platform for comparing and analyzing AI models and their performance', 'https://artificialanalysis.ai/', 'free', 'c9dd9f71-2768-4c76-adb1-49465ae468b4', ARRAY['AI Comparison', 'Model Analysis', 'Performance', 'Research'], 4.1, false, false, 'approved'),
('Deep Agent', 'AI-powered business intelligence and data analysis platform', 'https://deepagent.abacus.ai/', 'paid', 'c9dd9f71-2768-4c76-adb1-49465ae468b4', ARRAY['Business Intelligence', 'Data Analysis', 'AI Agents', 'Enterprise'], 4.0, false, false, 'approved'),

-- Translation & Language
('DeepL', 'Advanced AI translation service with high accuracy', 'https://www.deepl.com/', 'freemium', 'a806d344-c225-426e-a224-6a9300847372', ARRAY['Translation', 'High Accuracy', 'Multiple Languages', 'Professional'], 4.7, true, false, 'approved'),
('Google Translate', 'Google''s AI-powered translation service', 'https://translate.google.com/', 'free', 'a806d344-c225-426e-a224-6a9300847372', ARRAY['Google', 'Translation', 'Free', 'Multiple Languages'], 4.5, true, false, 'approved'),
('Speechmatics', 'AI-powered speech recognition and language processing', 'https://www.speechmatics.com/flow', 'paid', 'a806d344-c225-426e-a224-6a9300847372', ARRAY['Speech Recognition', 'Language Processing', 'API', 'Enterprise'], 4.3, false, false, 'approved'),
('TextFX by Google', 'AI-powered text effects and creative writing tools', 'https://textfx.withgoogle.com/', 'free', 'a806d344-c225-426e-a224-6a9300847372', ARRAY['Google', 'Text Effects', 'Creative Writing', 'Language Play'], 4.0, false, false, 'approved'),
('Text to Speech Online', 'AI-powered text-to-speech converter with natural voices', 'https://www.text-to-speech.online/', 'freemium', 'a806d344-c225-426e-a224-6a9300847372', ARRAY['Text to Speech', 'Natural Voices', 'Audio Generation', 'Accessibility'], 4.1, false, false, 'approved'),

-- 3D & Spatial AI
('Luma Labs', 'AI-powered 3D capture and generation platform', 'https://lumalabs.ai/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['3D Generation', 'Spatial AI', '3D Capture', 'NeRF'], 4.5, true, true, 'approved'),
('Meshy AI', 'AI-powered 3D model generation from text and images', 'https://www.meshy.ai/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['3D Models', 'Text to 3D', 'Image to 3D', 'AI Generation'], 4.4, false, true, 'approved'),
('Tripo3D', 'Fast AI 3D model generation platform', 'https://www.tripo3d.ai/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['3D Generation', 'Fast Creation', 'AI Models', '3D Assets'], 4.3, false, false, 'approved'),
('InstantMesh', 'AI tool for generating 3D meshes from single images', 'https://www.insta3d.top/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['3D Mesh', 'Image to 3D', 'Instant Generation', 'AI Processing'], 4.2, false, false, 'approved'),
('Skybox AI', 'AI-powered 360° skybox and environment generation', 'https://skybox.blockadelabs.com/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['360 Environments', 'Skybox', 'VR/AR', 'Environment AI'], 4.4, false, false, 'approved'),
('Hiber3D', 'AI-powered 3D world creation and hosting platform', 'https://www.hiber3d.com/', 'freemium', '8398d6b7-c94d-472a-89bc-47b2a51e38fe', ARRAY['3D Worlds', 'Web3D', 'Hosting', 'Interactive'], 4.1, false, false, 'approved'),

-- AI Agents & Automation
('AgentGPT', 'Platform for creating autonomous AI agents for various tasks', 'https://agentgpt.reworkd.ai/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['AI Agents', 'Autonomous', 'Task Automation', 'GPT'], 4.2, false, true, 'approved'),
('MultiChatAI', 'Platform for managing multiple AI chatbots and agents', 'https://www.multichatai.com/', 'paid', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Multi-AI', 'Chat Management', 'AI Agents', 'Business'], 4.0, false, false, 'approved'),
('VectorShift', 'No-code platform for building AI workflows and automations', 'https://vectorshift.ai/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['No Code', 'AI Workflows', 'Automation', 'Vector Database'], 4.3, false, false, 'approved'),

-- Resume & Career Tools
('JobRight AI Resume Builder', 'AI-powered resume builder with job matching', 'https://jobright.ai/ai-resume-builder', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Resume Builder', 'Job Matching', 'Career', 'AI Optimization'], 4.2, false, false, 'approved'),
('ResumeTrick', 'AI-powered resume optimization and creation tool', 'https://resumetrick.com/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Resume Optimization', 'Career Tools', 'AI Writing', 'Job Search'], 4.1, false, false, 'approved'),

-- Specialized AI Tools
('Mistral AI', 'European AI company providing advanced language models', 'https://mistral.ai/', 'paid', '3a4c7a2e-b070-44ed-8a15-6782880c9d7c', ARRAY['Language Models', 'European AI', 'Enterprise', 'API'], 4.5, true, true, 'approved'),
('Groq', 'Ultra-fast AI inference platform for real-time applications', 'https://groq.com/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Fast Inference', 'Real-time AI', 'API', 'Performance'], 4.6, true, true, 'approved'),
('Together AI', 'Platform for running and fine-tuning open-source AI models', 'https://www.together.ai/', 'paid', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Open Source', 'Model Fine-tuning', 'AI Platform', 'Enterprise'], 4.4, false, false, 'approved'),
('DeepInfra', 'Serverless platform for running AI models with scalable infrastructure', 'https://deepinfra.com/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Serverless AI', 'Scalable', 'Model Hosting', 'API'], 4.3, false, false, 'approved'),
('Pinokio', 'Browser for AI applications - install and run AI programs locally', 'https://pinokio.computer/', 'free', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['AI Browser', 'Local AI', 'Application Manager', 'Open Source'], 4.2, false, true, 'approved'),

-- Business & Enterprise AI
('Pythagora AI', 'AI-powered software development and project management platform', 'https://www.pythagora.ai/', 'paid', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Software Development', 'Project Management', 'AI Automation', 'Enterprise'], 4.1, false, false, 'approved'),
('Phase', 'AI-powered project management and team collaboration tool', 'https://www.phase.com/', 'freemium', '132abe7a-7bc3-4ef3-9c8b-ce0b2d483a9c', ARRAY['Project Management', 'Team Collaboration', 'AI Features', 'Productivity'], 4.0, false, false, 'approved'),
('Lovable', 'AI-powered web development platform for rapid application building', 'https://lovable.dev/', 'freemium', 'f02dbf04-e68d-4d87-8def-4f5bd192be53', ARRAY['Web Development', 'No Code', 'AI Builder', 'Rapid Development'], 4.4, true, true, 'approved');

-- Update tool ratings based on recent activity (optional, for demonstration)
UPDATE public.tools 
SET updated_at = now()
WHERE website IN (
  'https://novita.ai/', 'https://cognition.ai/', 'https://claude.ai/chats', 
  'https://character.ai/', 'https://suno.com/', 'https://bolt.new/',
  'https://v0.dev/', 'https://lovable.dev/'
);