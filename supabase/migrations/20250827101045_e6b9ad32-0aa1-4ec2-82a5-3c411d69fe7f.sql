-- Create project ideas table for student AI projects
CREATE TABLE public.project_ideas (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  detailed_description text,
  difficulty_level text NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  estimated_time text NOT NULL,
  ai_tools_used text[] NOT NULL DEFAULT '{}',
  tech_stack text[] NOT NULL DEFAULT '{}',
  business_potential text NOT NULL CHECK (business_potential IN ('High', 'Medium', 'Low')),
  market_size text,
  target_audience text,
  monetization_ideas text[],
  similar_successful_companies text[],
  required_skills text[] NOT NULL DEFAULT '{}',
  learning_resources text[],
  featured boolean DEFAULT false,
  trending boolean DEFAULT false,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  upvotes_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create project idea categories table
CREATE TABLE public.project_idea_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create project idea upvotes table for user engagement
CREATE TABLE public.project_idea_upvotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_idea_id uuid NOT NULL REFERENCES public.project_ideas(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, project_idea_id)
);

-- Enable RLS
ALTER TABLE public.project_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_idea_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_idea_upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_ideas
CREATE POLICY "Project ideas are viewable by everyone"
ON public.project_ideas FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create project ideas"
ON public.project_ideas FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own project ideas"
ON public.project_ideas FOR UPDATE
USING (auth.uid() = created_by);

-- RLS Policies for project_idea_categories
CREATE POLICY "Project idea categories are viewable by everyone"
ON public.project_idea_categories FOR SELECT
USING (true);

-- RLS Policies for project_idea_upvotes
CREATE POLICY "Users can view all upvotes"
ON public.project_idea_upvotes FOR SELECT
USING (true);

CREATE POLICY "Users can create their own upvotes"
ON public.project_idea_upvotes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes"
ON public.project_idea_upvotes FOR DELETE
USING (auth.uid() = user_id);

-- Insert categories
INSERT INTO public.project_idea_categories (name, slug, description, icon) VALUES
('AI/ML Applications', 'ai-ml-applications', 'Machine learning and artificial intelligence projects', 'brain'),
('Computer Vision', 'computer-vision', 'Image and video processing projects', 'eye'),
('Natural Language Processing', 'nlp', 'Text processing and language understanding projects', 'message-square'),
('Healthcare Tech', 'healthcare-tech', 'AI-powered healthcare solutions', 'heart'),
('FinTech', 'fintech', 'Financial technology and AI trading projects', 'dollar-sign'),
('EdTech', 'edtech', 'Educational technology powered by AI', 'graduation-cap'),
('E-commerce', 'ecommerce', 'AI-powered shopping and recommendation systems', 'shopping-cart'),
('Social Media', 'social-media', 'AI-enhanced social platforms and tools', 'users'),
('Productivity Tools', 'productivity-tools', 'AI assistants and automation tools', 'zap'),
('Gaming & Entertainment', 'gaming-entertainment', 'AI in games and entertainment platforms', 'gamepad-2');

-- Insert sample project ideas
INSERT INTO public.project_ideas (
  title, description, detailed_description, difficulty_level, estimated_time,
  ai_tools_used, tech_stack, business_potential, market_size, target_audience,
  monetization_ideas, similar_successful_companies, required_skills,
  learning_resources, featured, trending, category, tags
) VALUES
('AI-Powered Resume Builder', 
 'Create a smart resume builder that uses AI to optimize content for ATS systems and specific job roles.',
 'This project involves building a web application that analyzes job descriptions and tailors resumes accordingly. The AI can suggest improvements, rewrite bullet points for impact, and ensure ATS compatibility. Features include skill gap analysis, industry-specific templates, and real-time optimization suggestions.',
 'Intermediate', 
 '3-4 months',
 ARRAY['OpenAI GPT-4', 'Hugging Face Transformers', 'Google Cloud NLP'],
 ARRAY['React', 'Node.js', 'Python', 'MongoDB', 'Express'],
 'High',
 '$2.8B (Resume Services Market)',
 'Job seekers, career changers, students',
 ARRAY['Freemium model', 'Premium templates', 'Career coaching services', 'Corporate partnerships'],
 ARRAY['Zety', 'Resume.io', 'Canva Resume Builder'],
 ARRAY['Web Development', 'NLP', 'API Integration', 'UI/UX Design'],
 ARRAY['OpenAI API docs', 'React documentation', 'MongoDB tutorials'],
 true, true, 'AI/ML Applications',
 ARRAY['career', 'job-search', 'nlp', 'optimization']),

('Smart Fitness Trainer App',
 'Develop an AI-powered fitness app that creates personalized workout plans and provides real-time form correction using computer vision.',
 'This comprehensive fitness application uses computer vision to analyze user movements and provide real-time feedback on exercise form. The AI creates personalized workout plans based on user goals, fitness level, and available equipment. Features include progress tracking, injury prevention alerts, and social challenges.',
 'Advanced',
 '4-6 months',
 ARRAY['MediaPipe', 'TensorFlow', 'OpenPose', 'Computer Vision APIs'],
 ARRAY['React Native', 'Python', 'TensorFlow.js', 'Firebase', 'Node.js'],
 'High',
 '$4.4B (Fitness App Market)',
 'Fitness enthusiasts, gym beginners, personal trainers',
 ARRAY['Subscription plans', 'Personal trainer marketplace', 'Premium content', 'Corporate wellness'],
 ARRAY['Mirror', 'Tonal', 'FitnessBlender', 'Nike Training Club'],
 ARRAY['Mobile Development', 'Computer Vision', 'Machine Learning', 'Health Tech'],
 ARRAY['MediaPipe documentation', 'TensorFlow tutorials', 'React Native guides'],
 true, true, 'Computer Vision',
 ARRAY['fitness', 'health', 'computer-vision', 'mobile']),

('AI Study Buddy Platform',
 'Create an intelligent tutoring system that adapts to student learning patterns and provides personalized explanations.',
 'This EdTech platform uses AI to understand how each student learns best and adapts its teaching methods accordingly. Features include automatic quiz generation, concept explanation in multiple ways, progress tracking, and peer collaboration tools. The AI can identify knowledge gaps and suggest targeted learning resources.',
 'Intermediate',
 '3-5 months',
 ARRAY['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini', 'Wolfram Alpha API'],
 ARRAY['React', 'Python', 'FastAPI', 'PostgreSQL', 'WebSockets'],
 'High',
 '$340B (Global Education Market)',
 'Students, teachers, educational institutions',
 ARRAY['Freemium model', 'School licenses', 'Tutoring marketplace', 'Content partnerships'],
 ARRAY['Khan Academy', 'Coursera', 'Duolingo', 'Socratic'],
 ARRAY['Web Development', 'AI/ML', 'Educational Psychology', 'API Integration'],
 ARRAY['OpenAI documentation', 'FastAPI tutorials', 'Educational technology resources'],
 true, false, 'EdTech',
 ARRAY['education', 'tutoring', 'adaptive-learning', 'ai-assistant']),

('AI-Powered Investment Advisor',
 'Build a robo-advisor that provides personalized investment recommendations using machine learning algorithms.',
 'This FinTech application analyzes market trends, user risk tolerance, and financial goals to provide automated investment advice. Features include portfolio optimization, risk assessment, market sentiment analysis, and educational content. The AI continuously learns from market data and user feedback to improve recommendations.',
 'Advanced',
 '5-7 months',
 ARRAY['TensorFlow', 'Scikit-learn', 'Alpha Vantage API', 'Yahoo Finance API'],
 ARRAY['Python', 'React', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
 'High',
 '$4.6B (Robo-Advisory Market)',
 'Young investors, millennials, beginner traders',
 ARRAY['Management fees', 'Premium features', 'Financial education courses', 'Partnership commissions'],
 ARRAY['Betterment', 'Wealthfront', 'Robinhood', 'Acorns'],
 ARRAY['Finance Knowledge', 'Machine Learning', 'Data Analysis', 'Regulatory Compliance'],
 ARRAY['Quantitative finance courses', 'TensorFlow finance tutorials', 'Investment basics'],
 false, true, 'FinTech',
 ARRAY['investing', 'fintech', 'machine-learning', 'portfolio-management']),

('Smart Recipe Generator',
 'Create an AI-powered app that generates recipes based on available ingredients, dietary restrictions, and nutritional goals.',
 'This culinary AI application helps users create delicious meals from ingredients they have at home. The system considers dietary restrictions, nutritional requirements, cuisine preferences, and cooking skill level. Features include meal planning, shopping list generation, cooking instructions with timers, and nutritional analysis.',
 'Beginner',
 '2-3 months',
 ARRAY['OpenAI GPT-4', 'Spoonacular API', 'Edamam API'],
 ARRAY['React', 'Node.js', 'MongoDB', 'Express', 'Material-UI'],
 'Medium',
 '$150B (Food Tech Market)',
 'Home cooks, health-conscious individuals, busy professionals',
 ARRAY['Premium recipe collections', 'Meal kit partnerships', 'Grocery delivery integration', 'Nutrition coaching'],
 ARRAY['Yummly', 'Allrecipes', 'HelloFresh', 'Blue Apron'],
 ARRAY['Web Development', 'API Integration', 'Basic AI Understanding'],
 ARRAY['OpenAI cookbook', 'React tutorials', 'Food API documentation'],
 false, false, 'AI/ML Applications',
 ARRAY['food', 'recipes', 'nutrition', 'meal-planning']);

-- Create function to update upvotes count
CREATE OR REPLACE FUNCTION public.update_project_idea_upvotes()
RETURNS trigger
language plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
  UPDATE public.project_ideas 
  SET upvotes_count = (
    SELECT COUNT(*)
    FROM public.project_idea_upvotes 
    WHERE project_idea_id = COALESCE(NEW.project_idea_id, OLD.project_idea_id)
  )
  WHERE id = COALESCE(NEW.project_idea_id, OLD.project_idea_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for upvotes count
CREATE TRIGGER update_project_idea_upvotes_trigger
  AFTER INSERT OR DELETE ON public.project_idea_upvotes
  FOR EACH ROW EXECUTE FUNCTION public.update_project_idea_upvotes();