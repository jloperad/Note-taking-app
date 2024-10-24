'use client'

import { useState, useEffect } from 'react'
import { Archive, CheckSquare, Edit3, Plus, Trash2, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { getActiveNotes, getArchivedNotes, createNote, updateNote, deleteNote, toggleArchiveStatus } from '../services/notes-service'

 export type Note = {
  id: number
  title: string
  content: string
  isArchived: boolean
}

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)
  const [loading, setLoading] = useState(true) // Add loading state

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true); // Set loading to true before fetching
      const fetchedNotes = showArchived ? await getArchivedNotes() : await getActiveNotes();
      setNotes(fetchedNotes);
      setLoading(false); // Set loading to false after fetching
    };
    fetchNotes();
  }, [showArchived]);

  const filteredNotes = notes.filter(note => note.isArchived === showArchived)

  const handleNoteClick = (note: Note) => {
    setEditingNote(note)
  }
  
  const handleNoteUpdate = async (updatedNote: Note) => {
    if (!updatedNote.title.trim() || !updatedNote.content.trim()) {
      alert('Note title or content cannot be empty.');
      return;
    }
    await updateNote(updatedNote.id, updatedNote);
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    setEditingNote(null); 
  }

  const handleArchiveToggle = async (noteId: number) => {
    // Optimistically update the UI
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    );
    setNotes(updatedNotes);

    // Perform the archive operation
    try {
      const updatedNote = await toggleArchiveStatus(noteId);
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error toggling archive status:', (error as Error).message);
      // Revert the optimistic update if the operation fails
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
      ));
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    // Optimistically update the UI
    setNotes(notes.filter(note => note.id !== noteId));

    // Perform the delete operation
    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error('Error deleting note:', (error as Error).message);
      // Optionally, revert the optimistic update if the operation fails
      const deletedNote = notes.find(note => note.id === noteId);
      if (deletedNote) {
        setNotes(prevNotes => [...prevNotes, deletedNote]);
      }
    }
    setDeleteConfirmation(null);
  }

  const handleCreateNote = async () => {
    const newNote = {id: 0, title: '', content: '', isArchived: false };
    const createdNote = await createNote(newNote);
    setEditingNote(createdNote);
  }

  const closeEditingModal = () => {
    if (editingNote && (!editingNote.title.trim() || !editingNote.content.trim())) {
      // Remove the note if it has no content
      setNotes(notes.filter(note => note.id !== editingNote.id));
      deleteNote(editingNote.id); // Optionally, remove it from the backend as well
    }
    setEditingNote(null);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notes</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="archived"
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <Label htmlFor="archived">Show Archived</Label>
            </div>
            <Button onClick={handleCreateNote}>
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          // Notes Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <Card key={note.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="line-clamp-6">{note.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm" onClick={() => handleNoteClick(note)}>
                    <Edit3 className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleArchiveToggle(note.id)}>
                    {note.isArchived ? <CheckSquare className="mr-1 h-4 w-4" /> : <Archive className="mr-1 h-4 w-4" />}
                    {note.isArchived ? 'Unarchive' : 'Archive'}
                  </Button>
                  <Dialog open={deleteConfirmation === note.id} onOpenChange={(open) => setDeleteConfirmation(open ? note.id : null)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this note? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteNote(note.id)}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Full-screen Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <Input
                className="text-2xl font-bold border-none focus:ring-0 p-0"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                placeholder="Note Title"
              />
              <Button variant="ghost" size="icon" onClick={closeEditingModal}>
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4">
              <Textarea
                className="flex-grow resize-none"
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                placeholder="Start writing your note here..."
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button onClick={() => handleNoteUpdate(editingNote)}>Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
