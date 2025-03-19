
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Wand2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TagBadge from './TagBadge';

interface NoteEditorProps {
  initialNote?: any;
  onSave: (note: any) => void;
  onCancel: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ initialNote, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Initialize editor with note data if editing an existing note
  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setTags(initialNote.tags || []);
    }
  }, [initialNote]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tag.trim()) {
      e.preventDefault();
      if (!tags.includes(tag.trim().toLowerCase())) {
        setTags([...tags, tag.trim().toLowerCase()]);
      }
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content before generating a summary.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingSummary(true);

    try {
      // Simulate AI summary generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feature not yet implemented",
        description: "AI summarization will be available soon!",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary Generation Failed",
        description: "Could not generate summary. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please add a title for your note.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please add some content to your note.",
        variant: "destructive",
      });
      return;
    }

    const noteData = {
      ...initialNote,
      title: title.trim(),
      content,
      tags,
      updatedAt: new Date()
    };

    if (!initialNote) {
      noteData.createdAt = new Date();
    }

    onSave(noteData);
  };

  // Quill modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialNote ? 'Edit Note' : 'Create New Note'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <div className="min-h-[200px] border rounded-md">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              placeholder="Write your note content here..."
              className="h-[200px] overflow-y-auto"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((t, i) => (
              <TagBadge 
                key={i} 
                tag={t} 
                removable 
                onRemove={() => handleRemoveTag(t)} 
              />
            ))}
          </div>
          <Input
            id="tags"
            placeholder="Add a tag and press Enter"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={handleAddTag}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button variant="outline" onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
          </Button>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Note
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteEditor;
