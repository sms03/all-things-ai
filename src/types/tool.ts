
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: 'free' | 'freemium' | 'paid';
  website: string;
  tags: string[];
  rating: number;
  featured?: boolean;
  trending?: boolean;
}
