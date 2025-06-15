
interface BackgroundProps {
  variant?: 'gradient' | 'dots' | 'grid';
  className?: string;
}

export const Background = ({ variant = 'gradient', className = '' }: BackgroundProps) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black';
      case 'dots':
        return 'bg-gray-50 dark:bg-gray-900 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.15)_1px,transparent_0)] [background-size:20px_20px]';
      case 'grid':
        return 'bg-gray-50 dark:bg-gray-900 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] [background-size:20px_20px]';
      default:
        return 'bg-gradient-to-br from-slate-50 via-white to-gray-50 dark:from-black dark:via-gray-900 dark:to-black';
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundStyle()} ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)]"></div>
    </div>
  );
};
