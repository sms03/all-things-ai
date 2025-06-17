
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const endpoint = pathParts[pathParts.length - 1];

    console.log('API endpoint called:', endpoint);

    switch (req.method) {
      case 'GET':
        if (endpoint === 'tools' || endpoint === 'api-tools') {
          // Get all approved tools
          const { data: tools, error } = await supabase
            .from('tools')
            .select(`
              id,
              name,
              description,
              website,
              pricing,
              rating,
              tags,
              created_at,
              updated_at,
              categories (
                name,
                slug
              )
            `)
            .eq('status', 'approved')
            .order('name');

          if (error) throw error;

          const formattedTools = tools?.map(tool => ({
            ...tool,
            category: tool.categories?.slug || 'other'
          })) || [];

          return new Response(
            JSON.stringify({
              success: true,
              data: formattedTools,
              count: formattedTools.length
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }

        if (endpoint === 'categories') {
          // Get all categories
          const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

          if (error) throw error;

          return new Response(
            JSON.stringify({
              success: true,
              data: categories || [],
              count: categories?.length || 0
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }

        // Get tool by ID
        const toolId = url.searchParams.get('id');
        if (toolId) {
          const { data: tool, error } = await supabase
            .from('tools')
            .select(`
              *,
              categories (
                name,
                slug
              )
            `)
            .eq('id', toolId)
            .eq('status', 'approved')
            .single();

          if (error) throw error;

          const formattedTool = tool ? {
            ...tool,
            category: tool.categories?.slug || 'other'
          } : null;

          return new Response(
            JSON.stringify({
              success: true,
              data: formattedTool
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }

        break;

      case 'POST':
        if (endpoint === 'search') {
          const { query, filters } = await req.json();
          
          let dbQuery = supabase
            .from('tools')
            .select(`
              *,
              categories (
                name,
                slug
              )
            `)
            .eq('status', 'approved');

          // Apply search query
          if (query?.trim()) {
            dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
          }

          // Apply filters
          if (filters?.category && filters.category !== 'all') {
            dbQuery = dbQuery.eq('categories.slug', filters.category);
          }

          if (filters?.pricing && filters.pricing !== 'all') {
            dbQuery = dbQuery.eq('pricing', filters.pricing);
          }

          if (filters?.rating && filters.rating > 0) {
            dbQuery = dbQuery.gte('rating', filters.rating);
          }

          if (filters?.tags && filters.tags.length > 0) {
            dbQuery = dbQuery.overlaps('tags', filters.tags);
          }

          // Apply sorting
          const sortBy = filters?.sortBy || 'name';
          const sortOrder = filters?.sortOrder === 'desc' ? false : true;
          
          if (sortBy === 'rating') {
            dbQuery = dbQuery.order('rating', { ascending: sortOrder });
          } else if (sortBy === 'created_at') {
            dbQuery = dbQuery.order('created_at', { ascending: sortOrder });
          } else {
            dbQuery = dbQuery.order('name', { ascending: sortOrder });
          }

          const { data: results, error } = await dbQuery.limit(100);

          if (error) throw error;

          const formattedResults = results?.map(tool => ({
            ...tool,
            category: tool.categories?.slug || 'other'
          })) || [];

          return new Response(
            JSON.stringify({
              success: true,
              data: formattedResults,
              count: formattedResults.length,
              query,
              filters
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }
        break;

      default:
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Method not allowed'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 405,
          }
        );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Endpoint not found'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      }
    );

  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
