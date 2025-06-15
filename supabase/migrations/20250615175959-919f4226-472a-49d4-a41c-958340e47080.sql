
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tools table
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  website TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  pricing TEXT NOT NULL CHECK (pricing IN ('free', 'freemium', 'paid')),
  rating DECIMAL(2,1) DEFAULT 4.0,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  trending BOOLEAN DEFAULT false,
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookmarks table for favorite tools
CREATE TABLE public.bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_id UUID REFERENCES public.tools(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_id)
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" 
  ON public.categories FOR SELECT 
  USING (true);

-- RLS Policies for tools (public read, authenticated users can submit)
CREATE POLICY "Tools are viewable by everyone" 
  ON public.tools FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can insert tools" 
  ON public.tools FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own submitted tools" 
  ON public.tools FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = submitted_by);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for bookmarks
CREATE POLICY "Users can view their own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Conversational AI & Chatbots', 'chatbots', 'AI-powered chat and conversation tools'),
  ('Content Writing & Copywriting', 'text-copywriting', 'AI tools for writing and content creation'),
  ('Image Generation & Editing', 'image-art', 'AI tools for creating and editing images'),
  ('Video Generation & Editing', 'video-audio', 'AI tools for video creation and editing'),
  ('Audio & Music Generation', 'audio-music', 'AI tools for audio and music creation'),
  ('Code Generation & Development', 'developer', 'AI tools for software development and coding'),
  ('Productivity & Automation', 'productivity', 'AI tools for productivity and workflow automation'),
  ('Data Analysis & Business Intelligence', 'data-analysis', 'AI tools for data analysis and business intelligence'),
  ('Marketing & SEO', 'marketing', 'AI tools for marketing, SEO, and digital growth'),
  ('Design & Creative Tools', 'design', 'AI tools for design and creative work'),
  ('Customer Service & Support', 'customer-service', 'AI tools for customer support and service'),
  ('Translation & Language', 'translation', 'AI tools for translation and language processing');
