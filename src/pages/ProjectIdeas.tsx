import React, { useState } from 'react';
import { Lightbulb, TrendingUp, Clock, Users, Star, ChevronDown, ChevronUp, Heart, Zap, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectIdeas } from '@/hooks/useProjectIdeas';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectIdeas = () => {
  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all-difficulties');
  const [selectedBusinessPotential, setSelectedBusinessPotential] = useState('all-potential');
  const [sortBy, setSortBy] = useState('featured');
  const [expandedIdea, setExpandedIdea] = useState<string | null>(null);

  const { user } = useAuth();
  const { projectIdeas, categories, loading, upvoteIdea, isUpvoted } = useProjectIdeas();

  const filteredIdeas = projectIdeas.filter(idea => {
    return (
      (selectedCategory === 'all-categories' || idea.category === selectedCategory) &&
      (selectedDifficulty === 'all-difficulties' || idea.difficulty_level === selectedDifficulty) &&
      (selectedBusinessPotential === 'all-potential' || idea.business_potential === selectedBusinessPotential)
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case 'upvotes':
        return b.upvotes_count - a.upvotes_count;
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'difficulty':
        const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
        return difficultyOrder[a.difficulty_level as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty_level as keyof typeof difficultyOrder];
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || 
               (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getBusinessPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Low': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleUpvote = async (ideaId: string) => {
    if (!user) return;
    await upvoteIdea(ideaId);
  };

  const toggleExpanded = (ideaId: string) => {
    setExpandedIdea(expandedIdea === ideaId ? null : ideaId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lightbulb className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Project Ideas
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover innovative AI project ideas perfect for college students. Each project has real startup potential and uses cutting-edge AI tools.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.slug} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-difficulties">All Difficulties</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBusinessPotential} onValueChange={setSelectedBusinessPotential}>
              <SelectTrigger>
                <SelectValue placeholder="Business Potential" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-potential">All Potential</SelectItem>
                <SelectItem value="High">High Potential</SelectItem>
                <SelectItem value="Medium">Medium Potential</SelectItem>
                <SelectItem value="Low">Low Potential</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="upvotes">Most Upvoted</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="difficulty">By Difficulty</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedCategory('all-categories');
                setSelectedDifficulty('all-difficulties');
                setSelectedBusinessPotential('all-potential');
                setSortBy('featured');
              }}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Project Ideas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredIdeas.map((idea) => (
            <Card key={idea.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {idea.featured && (
                        <Badge className="bg-gradient-to-r from-primary to-primary/60 text-primary-foreground">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {idea.trending && (
                        <Badge variant="secondary">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mb-2">{idea.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {idea.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant={isUpvoted(idea.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpvote(idea.id)}
                      disabled={!user}
                      className="min-w-[60px]"
                    >
                      <Heart className={`h-4 w-4 ${isUpvoted(idea.id) ? 'fill-current' : ''}`} />
                      <span className="ml-1">{idea.upvotes_count}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <Badge className={getDifficultyColor(idea.difficulty_level)}>
                      {idea.difficulty_level}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{idea.estimated_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <Badge className={getBusinessPotentialColor(idea.business_potential)}>
                      {idea.business_potential} Potential
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{idea.category}</span>
                  </div>
                </div>

                {/* AI Tools */}
                <div>
                  <h4 className="font-medium text-sm mb-2">AI Tools Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {idea.ai_tools_used.slice(0, 3).map((tool, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                    {idea.ai_tools_used.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{idea.ai_tools_used.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Tech Stack:</h4>
                  <div className="flex flex-wrap gap-1">
                    {idea.tech_stack.slice(0, 4).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {idea.tech_stack.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{idea.tech_stack.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedIdea === idea.id && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Detailed Description:</h4>
                      <p className="text-sm text-muted-foreground">{idea.detailed_description}</p>
                    </div>

                    {idea.market_size && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Market Size:</h4>
                        <p className="text-sm text-muted-foreground">{idea.market_size}</p>
                      </div>
                    )}

                    {idea.target_audience && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Target Audience:</h4>
                        <p className="text-sm text-muted-foreground">{idea.target_audience}</p>
                      </div>
                    )}

                    {idea.monetization_ideas && idea.monetization_ideas.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Monetization Ideas:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {idea.monetization_ideas.map((idea_item, index) => (
                            <li key={index}>• {idea_item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {idea.similar_successful_companies && idea.similar_successful_companies.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Similar Successful Companies:</h4>
                        <div className="flex flex-wrap gap-1">
                          {idea.similar_successful_companies.map((company, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {idea.required_skills && idea.required_skills.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Required Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {idea.required_skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(idea.id)}
                  className="w-full mt-4"
                >
                  {expandedIdea === idea.id ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Show More Details
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No project ideas found</h3>
            <p className="text-muted-foreground">Try adjusting your filters to see more ideas.</p>
          </div>
        )}

        {!user && (
          <div className="mt-8 text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Join to Upvote Ideas</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sign in to upvote your favorite project ideas and help the community discover the best ones.
                </p>
                <Button className="w-full">Sign In</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectIdeas;