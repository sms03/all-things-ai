
import ToolCard from '@/components/ToolCard';
import type { Tool } from '@/hooks/useSupabaseData';

interface ToolsGridProps {
  tools: Tool[];
}

const ToolsGrid = ({ tools }: ToolsGridProps) => {
  return (
    <div className="space-y-20 pb-32">
      <div className="text-center space-y-8">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent tracking-tight leading-tight">
          Discover AI Tools
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium tracking-tight">
          {tools.length} {tools.length === 1 ? 'tool' : 'tools'} to transform your workflow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-32">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg">
            <div className="text-5xl">🔍</div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">No tools found</h3>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-md mx-auto font-medium tracking-tight">Try adjusting your search criteria or explore different categories</p>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
