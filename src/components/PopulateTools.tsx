import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database, Upload } from 'lucide-react';

const PopulateTools = () => {
  const [isPopulating, setIsPopulating] = useState(false);

  const handlePopulateTools = async () => {
    setIsPopulating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('populate-tools');
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: `${data.message}`,
      });
      
      // Refresh the page to show new tools
      window.location.reload();
    } catch (error: any) {
      console.error('Error populating tools:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to populate tools",
        variant: "destructive",
      });
    } finally {
      setIsPopulating(false);
    }
  };

  return (
    <Button 
      onClick={handlePopulateTools}
      disabled={isPopulating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isPopulating ? (
        <>
          <Upload className="w-4 h-4 animate-spin" />
          Populating...
        </>
      ) : (
        <>
          <Database className="w-4 h-4" />
          Populate Tools
        </>
      )}
    </Button>
  );
};

export default PopulateTools;
