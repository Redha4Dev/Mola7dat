
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Wand2, Save, X, Mic2, Mic } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import TagBadge from './TagBadge';

interface NoteEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  onSave: (title: string, content: string, tags: string[]) => void;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  initialTitle = '', 
  initialContent = '', 
  initialTags = [], 
  onSave, 
  onCancel,
  loading = false,
  className
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isListening , setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const speechRecognition = new SpeechRecognitionAPI();
  
      speechRecognition.continuous = false; // Process only one phrase at a time
      speechRecognition.interimResults = false; // Only process final results
      speechRecognition.lang = "en-US";
  
      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setContent((prevContent) => prevContent + " " + transcript);
        
        // Restart recognition after a short delay to allow continuous dictation
        setTimeout(() => {
          if (isListening) recognition.start();
        }, 500);
      };
      
  
      speechRecognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
  
      setRecognition(speechRecognition);
    } else {
      console.warn("Speech recognition is not supported in this browser.");
    }
  }, []);
  
  

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };
  
  const stopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };
  
  
  // Update state when props change
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setTags(initialTags);
  }, [initialTitle, initialContent, initialTags]);

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

    onSave(title.trim(), content, tags);
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
    <Card className={className}>
      <CardHeader>
        <CardTitle>{initialTitle ? 'Edit Note' : 'Create New Note'}</CardTitle>
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
            ref={quillRef}
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
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          )}
          <Button variant="outline" onClick={handleGenerateSummary} disabled={isGeneratingSummary || loading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isGeneratingSummary ? 'Generating...' : 'AI Summary'}
          </Button>
          <Button variant="outline" onClick={isListening ? stopListening : startListening}>
            <Mic className="mr-2 h-4 w-4" />
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? 'Saving...' : 'Save Note'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteEditor;
