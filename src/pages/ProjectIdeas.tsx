import React, { useState } from 'react';
import { Lightbulb, TrendingUp, Clock, Users, Star, ChevronDown, ChevronUp, Heart, Zap, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectIdeas } from '@/hooks/useProjectIdeas';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';

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
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen pt-20">
          <div className="text-center border border-gray-200 rounded-lg p-12 shadow-sm max-w-md mx-auto">
            <div className="w-12 h-12 mx-auto mb-6 border-2 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
            <div className="text-xl font-medium text-gray-900 mb-2">Loading project ideas</div>
            <div className="text-gray-600 text-sm">Discovering innovative AI projects</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                AI Project Ideas
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover innovative AI project ideas perfect for college students. Each project has real startup potential and uses cutting-edge AI tools.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 border border-gray-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all-categories" className="text-gray-900">All Categories</SelectItem>
                    {categories.filter(category => category.name && category.name.trim() !== '').map(category => (
                      <SelectItem key={category.slug} value={category.name} className="text-gray-900">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all-difficulties" className="text-gray-900">All Difficulties</SelectItem>
                    <SelectItem value="Beginner" className="text-gray-900">Beginner</SelectItem>
                    <SelectItem value="Intermediate" className="text-gray-900">Intermediate</SelectItem>
                    <SelectItem value="Advanced" className="text-gray-900">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedBusinessPotential} onValueChange={setSelectedBusinessPotential}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Business Potential" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="all-potential" className="text-gray-900">All Potential</SelectItem>
                    <SelectItem value="High" className="text-gray-900">High Potential</SelectItem>
                    <SelectItem value="Medium" className="text-gray-900">Medium Potential</SelectItem>
                    <SelectItem value="Low" className="text-gray-900">Low Potential</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="featured" className="text-gray-900">Featured First</SelectItem>
                    <SelectItem value="upvotes" className="text-gray-900">Most Upvoted</SelectItem>
                    <SelectItem value="newest" className="text-gray-900">Newest First</SelectItem>
                    <SelectItem value="difficulty" className="text-gray-900">By Difficulty</SelectItem>
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
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredIdeas.length} project ideas
            </p>
          </div>

          {/* Project Ideas Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {idea.featured && (
                          <Badge className="bg-blue-600 text-white">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {idea.trending && (
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl text-gray-900 mb-2">{idea.title}</CardTitle>
                      <CardDescription className="text-sm text-gray-600">
                        {idea.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant={isUpvoted(idea.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpvote(idea.id)}
                        disabled={!user}
                        className={`min-w-[60px] ${
                          isUpvoted(idea.id) 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
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
                      <Zap className="h-4 w-4 text-gray-400" />
                      <Badge className={getDifficultyColor(idea.difficulty_level)}>
                        {idea.difficulty_level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{idea.estimated_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <Badge className={getBusinessPotentialColor(idea.business_potential)}>
                        {idea.business_potential} Potential
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{idea.category}</span>
                    </div>
                  </div>

                  {/* AI Tools */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">AI Tools Used:</h4>
                    <div className="flex flex-wrap gap-1">
                      {idea.ai_tools_used.slice(0, 3).map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {tool}
                        </Badge>
                      ))}
                      {idea.ai_tools_used.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
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
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
                          {tech}
                        </Badge>
                      ))}
                      {idea.tech_stack.length > 4 && (
                        <Badge variant="secondary" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
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
                        <p className="text-sm text-gray-600">{idea.detailed_description}</p>
                      </div>

                      {idea.market_size && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Market Size:</h4>
                          <p className="text-sm text-gray-600">{idea.market_size}</p>
                        </div>
                      )}

                      {idea.target_audience && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Target Audience:</h4>
                          <p className="text-sm text-gray-600">{idea.target_audience}</p>
                        </div>
                      )}

                      {idea.monetization_ideas && idea.monetization_ideas.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2">Monetization Ideas:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
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
                              <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
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
                              <Badge key={index} variant="secondary" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
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
                    className="w-full mt-4 text-gray-600 hover:bg-gray-50"
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

          {/* No Results */}
          {filteredIdeas.length === 0 && (
            <div className="text-center py-16">
              <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No project ideas found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more ideas.</p>
              <Button
                onClick={() => {
                  setSelectedCategory('all-categories');
                  setSelectedDifficulty('all-difficulties');
                  setSelectedBusinessPotential('all-potential');
                  setSortBy('featured');
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {!user && (
            <div className="mt-8 text-center">
              <Card className="max-w-md mx-auto border border-gray-200">
                <CardContent className="pt-6">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Join to Upvote Ideas</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Sign in to upvote your favorite project ideas and help the community discover the best ones.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectIdeas;