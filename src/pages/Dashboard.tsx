
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, doc, deleteDoc, where, Timestamp, serverTimestamp, arrayUnion  } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import NoteCard, { Note } from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Filter, X } from 'lucide-react';
import AnimatedTransition from '@/components/AnimatedTransition';
import { useToast } from '@/hooks/use-toast';
import TagBadge from '@/components/TagBadge';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  // Fetch notes from Firestore
  const fetchNotes = async () => {
    if (!currentUser) return;
  
    setIsLoading(true);
    try {
      console.log("Fetching notes for user:", currentUser.uid);
  
      // Query for notes where user is the owner OR a collaborator
      const q = query(
        collection(db, 'notes'),
        where('collaborators', 'array-contains', currentUser.uid) 
      );
      const qOwner = query(
        collection(db, 'notes'),
        where('userId', '==', currentUser.uid) 
      );
  
      // Fetch both queries in parallel
      const [collabSnap, ownerSnap] = await Promise.all([
        getDocs(q),
        getDocs(qOwner)
      ]);
  
      const collabNotes = collabSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const ownerNotes = ownerSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      // Combine and sort by updatedAt (newest first)
      const fetchedNotes = [...collabNotes, ...ownerNotes].sort(
        (a, b) => b.updatedAt?.toMillis() - a.updatedAt?.toMillis()
      );
  
      console.log("Fetched notes:", fetchedNotes);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error.code, error.message);
      
      toast({
        title: "Error",
        description: error.code === "permission-denied"
          ? "You don't have access to these notes."
          : "Failed to fetch notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchNotes();
  }, [currentUser]);

  // Create a new note
  const createNote = async () => {
    if (!currentUser) return;
    
    try {
      const timestamp = serverTimestamp();
      const newNoteData = {
        title: 'Untitled Note',
        content: '',
        tags: [],
        userId: currentUser.uid,
        collaborators: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
      const docRef = await addDoc(collection(db, 'notes'), newNoteData);
      
      // Create a Note object with Firebase timestamp wrappers
      const newNote: Note = {
        id: docRef.id,
        title: newNoteData.title,
        content: newNoteData.content,
        tags: newNoteData.tags,
        userId: newNoteData.userId,
        createdAt: {
          toDate: () => new Date()
        },
        updatedAt: {
          toDate: () => new Date()
        }
      };
      
      setNotes([newNote, ...notes]);
      selectNote(newNote);
      
      toast({
        title: 'Success',
        description: 'New note created',
      });
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  // Save a note
  const saveNote = async (title: string, content: string, tags: string[]) => {
    if (!currentUser || !selectedNote) return;
    
    setIsSaving(true);
    try {
      const noteRef = doc(db, 'notes', selectedNote.id);
      const timestamp = serverTimestamp();
      
      await updateDoc(noteRef, {
        title,
        content,
        tags,
        updatedAt: timestamp,
      });
      
      // Create a Note object with Firebase timestamp wrapper for updatedAt
      const updatedNote: Note = {
        ...selectedNote,
        title,
        content,
        tags,
        updatedAt: {
          toDate: () => new Date()
        }
      };
      
      setSelectedNote(updatedNote);
      
      // Update notes list
      setNotes(prev => 
        prev.map(note => 
          note.id === selectedNote.id ? updatedNote : note
        )
      );
      
      // Update unique tags
      const allTags = new Set<string>(uniqueTags);
      tags.forEach(tag => allTags.add(tag));
      setUniqueTags(Array.from(allTags));
      
      toast({
        title: 'Success',
        description: 'Note saved successfully',
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error',
        description: 'Failed to save note',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    if (!currentUser) return;
    
    try {
      await deleteDoc(doc(db, 'notes', id));
      
      setNotes(prev => prev.filter(note => note.id !== id));
      
      if (selectedNote?.id === id) {
        setSelectedNote(null);
        setIsEditorOpen(false);
      }
      
      toast({
        title: 'Success',
        description: 'Note deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note',
        variant: 'destructive',
      });
    }
  };

  // Select a note for editing
  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditorOpen(true);
  };

  // Toggle a tag in the filter
  const toggleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTags([]);
  };

  // Filter notes based on search and selected tags
  const filteredNotes = notes.filter(note => {
    // Search term filter
    const searchMatch = searchTerm === '' || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tags filter
    const tagsMatch = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    return searchMatch && tagsMatch;
  });



const addCollaborator = async (noteId: string, collaboratorId: string) => {
  try {
    const noteRef = doc(db, "notes", noteId);
    
    // Only update the collaborators array, NOT the userId
    await updateDoc(noteRef, {
      collaborators: arrayUnion(collaboratorId) // Add without replacing
    });

    console.log("Collaborator added successfully!");
  } catch (error) {
    console.error("Error adding collaborator:", error);
  }
};


  return (
    <div className="h-full flex flex-col">
      <main className="flex flex-1 overflow-hidden">
        {/* Notes List */}
        <AnimatedTransition 
          type="fadeIn" 
          className={`w-full md:w-1/3 lg:w-1/4 overflow-auto h-full border-r border-border p-4 ${isEditorOpen ? 'hidden md:block' : ''}`}
        >
          <div className="mb-4 sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-2 pb-3">
            <div className="flex items-center mb-4">
              <h1 className="text-2xl font-bold">Notes</h1>
              <Button 
                variant="outline" 
                size="icon"
                className="ml-auto"
                onClick={createNote}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {uniqueTags.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Filter className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter by tags</span>
                  {selectedTags.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-7 py-0 px-2 text-xs"
                      onClick={clearFilters}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {uniqueTags.map(tag => (
                    <TagBadge
                      key={tag}
                      tag={tag}
                      className={selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : ''}
                      onClick={() => toggleTagFilter(tag)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex flex-col space-y-2 mt-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-32 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => selectNote(note)}
                  onEdit={(note) => selectNote(note)}
                  onTagClick={toggleTagFilter}
                  onDelete={deleteNote}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center">
              <p className="text-muted-foreground mb-4">No notes found</p>
              <Button onClick={createNote}>Create your first note</Button>
            </div>
          )}
        </AnimatedTransition>
        
        {/* Note Editor */}
        {isEditorOpen && selectedNote ? (
          <AnimatedTransition type="fadeIn" className="flex-1 h-full p-4 overflow-auto">
            <div className="h-full flex flex-col">
              <div className="flex items-center mb-4">
                <Button 
                  variant="ghost" 
                  className="md:hidden mr-2"
                  onClick={() => setIsEditorOpen(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>
              
              <NoteEditor
                initialTitle={selectedNote.title}
                initialContent={selectedNote.content}
                initialTags={selectedNote.tags}
                onSave={saveNote}
                onCancel={() => setIsEditorOpen(false)}
                loading={isSaving}
                className="flex-1"
              />
              <div className='flex flex-col item-center text-center py-3 px-8 rounded-xl my-4 shadow-lg bg-[background] mx-auto gap-3'>
              <h1>Add collabarator</h1>
              <Input value={email} placeholder='Enter User id' onChange={(e) => setEmail(e.target.value)}/>
              <Button onClick={() => addCollaborator(selectedNote.id, email)}>Add</Button>
              </div>
            </div>
            
          </AnimatedTransition>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <h2 className="text-xl font-medium mb-2">Select a note to view and edit</h2>
              <p className="text-muted-foreground mb-4">
                Or create a new note to get started
              </p>
              <Button onClick={createNote}>Create new note</Button>
            </div>
          </div>
        )}
        <div className=''>
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
