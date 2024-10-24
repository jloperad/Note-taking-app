'use client'

import { useState } from 'react'
import { Archive, CheckSquare, Edit3, Plus, Trash2, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type Note = {
  id: number
  title: string
  content: string
  isArchived: boolean
}

const initialNotes: Note[] = [
  { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline and milestones. Review team assignments and deadlines.', isArchived: false },
  { id: 2, title: 'Grocery List', content: 'Milk, eggs, bread, fruits, vegetables, chicken, pasta', isArchived: false },
  { id: 3, title: 'App Idea', content: 'Create a note-taking app with archive feature and intuitive UI', isArchived: false },
  { id: 4, title: 'Book Recommendations', content: '1. The Great Gatsby\n2. To Kill a Mockingbird\n3. 1984\n4. Pride and Prejudice', isArchived: true },
  { id: 5, title: 'Weekend Plans', content: 'Visit the museum, have lunch at the new cafe, evening movie', isArchived: false },
  { id: 6, title: 'Workout Routine', content: 'Monday: Cardio\nTuesday: Upper body\nWednesday: Lower body\nThursday: HIIT\nFriday: Yoga\nSaturday: Full body\nSunday: Rest', isArchived: true },
]

export function NoteTakingAppComponent() {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [showArchived, setShowArchived] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)

  const filteredNotes = notes.filter(note => note.isArchived === showArchived)

  const handleNoteClick = (note: Note) => {
    setEditingNote(note)
  }

  const handleNoteUpdate = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note))
    setEditingNote(null)
    // TODO: Send API request to update note in the backend
    // Example: await updateNoteInBackend(updatedNote)
  }

  const handleArchiveToggle = (noteId: number) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    )
    setNotes(updatedNotes)
    // TODO: Send API request to update note's archive status in the backend
    // Example: await updateNoteArchiveStatus(noteId, !notes.find(n => n.id === noteId)?.isArchived)
  }

  const handleDeleteNote = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId))
    setDeleteConfirmation(null)
    // TODO: Send API request to delete note in the backend
    // Example: await deleteNoteInBackend(noteId)
  }

  const handleCreateNote = () => {
    const newNote = { id: Date.now(), title: '', content: '', isArchived: false }
    setEditingNote(newNote)
    // Note: The actual creation in the state happens after editing, in handleNoteUpdate
    // TODO: Send API request to create note in the backend after editing
    // Example: const createdNote = await createNoteInBackend(newNote)
    // Then update the local state with the created note from the backend
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

        {/* Notes Grid */}
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
                <Dialog open={deleteConfirmation === note.id} onOpenChange={() => setDeleteConfirmation(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmation(note.id)}>
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
              <Button variant="ghost" size="icon" onClick={() => setEditingNote(null)}>
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