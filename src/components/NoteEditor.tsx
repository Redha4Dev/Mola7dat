
import React, { useCallback, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import TagBadge from './TagBadge';
import { cn } from '@/lib/utils';

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave: (title: string, content: string, tags: string[]) => void;
  className?: string;
  loading?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  onSave,
  className,
  loading = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [tagInput, setTagInput] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTags(initialTags);
    setIsDirty(false);
  }, [initialTitle, initialContent, initialTags]);

  const handleContentChange = useCallback((value: string) => {
    setContent(value);
    setIsDirty(true);
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      setIsDirty(true);
    }
  }, [tagInput, tags]);

  const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  }, [handleAddTag]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    setIsDirty(true);
  }, [tags]);

  const handleSave = useCallback(() => {
    onSave(title, content, tags);
    setIsDirty(false);
  }, [title, content, tags, onSave]);

  // Quill modules and formats configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'code-block',
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between mb-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-3">
        <Input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={handleTitleChange}
          className="text-xl font-medium border-none focus-visible:ring-0 px-0 flex-1 mr-4"
        />
        <Button 
          onClick={handleSave} 
          disabled={!isDirty || loading}
          className={cn(
            "transition-all",
            isDirty ? "opacity-100" : "opacity-0"
          )}
        >
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
          <TagBadge 
            key={tag} 
            tag={tag} 
            removable 
            onRemove={() => handleRemoveTag(tag)} 
          />
        ))}
        <div className="flex items-center">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tag..."
            className="h-7 text-xs w-24 mr-1"
          />
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border">
        <CardContent className="p-0 h-full">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start writing..."
            className="h-full overflow-y-auto"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditor;
