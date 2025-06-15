
import ToolCard from '@/components/ToolCard';
import { Tool } from '@/types/tool';

interface ToolsGridProps {
  tools: Tool[];
}

const ToolsGrid = ({ tools }: ToolsGridProps) => {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-4">
          Discover AI Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-light">
          {tools.length} {tools.length === 1 ? 'tool' : 'tools'} found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-6">🔍</div>
          <h3 className="text-2xl font-light text-gray-900 dark:text-white mb-2">No tools found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ToolsGrid;
