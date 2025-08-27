import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useRoles } from '@/hooks/useRoles';
import { Loader2, ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });
  const { signIn, signUp, user } = useAuth();
  const { isAdmin, loading: rolesLoading } = useRoles();
  const navigate = useNavigate();

  // Handle redirect after successful authentication
  useEffect(() => {
    if (user && !loading && !rolesLoading && !redirecting) {
      setRedirecting(true);
      
      // Small delay to ensure role data is fully loaded
      setTimeout(() => {
        if (isAdmin()) {
          toast({
            title: "Welcome back, Admin!",
            description: "Redirecting to admin dashboard...",
          });
          navigate('/admin');
        } else {
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          navigate('/');
        }
      }, 500);
    }
  }, [user, isAdmin, loading, rolesLoading, navigate, redirecting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRedirecting(false);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
    // Don't set loading to false here - let the useEffect handle redirect and loading state
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signUp(formData.email, formData.password, formData.fullName);
    
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm ibm-plex-serif-regular text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
        </div>

        <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl ibm-plex-serif-bold text-black dark:text-white">A2Z AI Tools</CardTitle>
            <CardDescription className="ibm-plex-serif-regular text-gray-600 dark:text-gray-400">
              Access your favorite AI tools and discover new ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900">
                <TabsTrigger value="signin" className="ibm-plex-serif-medium">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="ibm-plex-serif-medium">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="ibm-plex-serif-medium text-black dark:text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="ibm-plex-serif-medium text-black dark:text-white">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                    />
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 ibm-plex-serif-regular text-center p-2 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                    <i className="ri-information-line mr-1"></i>
                    Admin users will be automatically redirected to the admin dashboard
                  </div>

                  <Button type="submit" className="w-full ibm-plex-serif-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors" disabled={loading || redirecting}>
                    {(loading || redirecting) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {redirecting ? 'Redirecting...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="ibm-plex-serif-medium text-black dark:text-white">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="ibm-plex-serif-medium text-black dark:text-white">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="ibm-plex-serif-medium text-black dark:text-white">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className="ibm-plex-serif-regular border-gray-300 dark:border-gray-700 focus:border-black dark:focus:border-white"
                    />
                  </div>
                  <Button type="submit" className="w-full ibm-plex-serif-medium bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors" disabled={loading}>
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Sign Up
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
