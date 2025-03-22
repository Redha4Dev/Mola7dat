
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Pencil, Trash2, Eye } from "lucide-react";
import TagBadge from './TagBadge';
import { cn } from '@/lib/utils';

export interface Note {
  id: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: {
    toDate: () => Date;
  };
  updatedAt: {
    toDate: () => Date;
  };
  tags: string[];
  userId: string[];
}

interface NoteCardProps {
  note: Note;
  onEdit?: (note: Note) => void;
  onDelete: (id: string) => void;
  onView?: (note: Note) => void;
  onClick?: () => void;
  onTagClick?: (tag: string) => void;
  className?: string;
  layout?: 'grid' | 'list';
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onDelete,
  onView,
  onClick,
  onTagClick,
  className,
  layout = 'grid'
}) => {
  const { id, title, content, createdAt, updatedAt, tags } = note;
  
  // Format dates
  const createdDate = createdAt ? format(createdAt.toDate(), 'MMM d, yyyy') : '';
  const updatedDate = updatedAt ? format(updatedAt.toDate(), 'MMM d, yyyy') : '';
  
  // Create a plain text version of content for preview
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  const contentPreview = stripHtml(content).substring(0, 120) + (stripHtml(content).length > 120 ? '...' : '');
  
  const handleEdit = () => {
    if (onEdit) onEdit(note);
  };
  
  const handleDelete = () => {
    onDelete(id);
  };
  
  const handleView = () => {
    if (onView) onView(note);
  };

  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking on tag
    if (onTagClick) onTagClick(tag);
  };

  return (
    <Card 
      className={cn(
        'overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer',
        layout === 'grid' ? 'h-[320px] flex flex-col' : 'flex flex-col md:flex-row',
        className
      )}
      onClick={handleCardClick}
    >
      <div className={cn(
        'flex-1 flex flex-col',
        layout === 'list' && 'md:max-w-[70%]'
      )}>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-1 text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 flex-1 min-h-0">
          <div className="mb-2 flex flex-wrap gap-1">
            {tags && tags.length > 0 && tags.map((tag, index) => (
              <TagBadge 
                key={index} 
                tag={tag} 
                onClick={(e) => handleTagClick(tag, e)} 
              />
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
            {contentPreview}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-2 flex-shrink-0 text-xs text-muted-foreground">
          <div className="w-full flex justify-between items-center">
            <div>
              Created: {createdDate}
              {updatedDate !== createdDate && (
                <span className="ml-2">(Updated: {updatedDate})</span>
              )}
            </div>
            
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {onView && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleView} 
                  aria-label="View note"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={handleEdit} 
                  aria-label="Edit note"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive" 
                onClick={handleDelete} 
                aria-label="Delete note"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default NoteCard;
