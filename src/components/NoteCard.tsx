
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { MoreHorizontal, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TagBadge from './TagBadge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NoteCardProps {
  note: Note;
  onClick: (id: string) => void;
  className?: string;
  onTagClick?: (tag: string) => void;
  onDelete?: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  className,
  onTagClick,
  onDelete,
}) => {
  // Strip HTML to get plain text for preview
  const contentPreview = note.content
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tag);
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all cursor-pointer hover:shadow-md",
        "hover:translate-y-[-2px] h-full flex flex-col group",
        className
      )}
      onClick={() => onClick(note.id)}
    >
      <CardHeader className="p-5 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-1">
            {note.title || "Untitled Note"}
          </CardTitle>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-3 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {contentPreview || "No content"}
          {note.content.length > 100 && "..."}
        </p>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex flex-col items-start">
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <TagBadge 
              key={tag} 
              tag={tag} 
              onClick={(e) => handleTagClick(tag, e as any)}
            />
          ))}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-auto">
          <Clock className="mr-1 h-3 w-3" />
          <span>
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
