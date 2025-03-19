
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({
  tag,
  onClick,
  onRemove,
  removable = false,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all",
        "bg-primary/10 text-primary hover:bg-primary/20",
        onClick && "cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      {tag}
      {removable && (
        <button
          type="button"
          className="ml-1.5 text-primary/70 hover:text-primary"
          onClick={handleRemove}
          aria-label={`Remove ${tag} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default TagBadge;
