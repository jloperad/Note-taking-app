'use client'

import { useState } from 'react'
import { Archive, CheckSquare, Edit3, Plus, Trash2, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type Category = {
  id: number
  name: string
  color: string
}

type Note = {
  id: number
  title: string
  content: string
  categoryIds: number[]
  isArchived: boolean
}

const initialCategories: Category[] = [
  { id: 1, name: 'Work', color: 'bg-red-100 text-red-800' },
  { id: 2, name: 'Personal', color: 'bg-blue-100 text-blue-800' },
  { id: 3, name: 'Ideas', color: 'bg-green-100 text-green-800' },
  { id: 4, name: 'To-Do', color: 'bg-yellow-100 text-yellow-800' },
  { id: 5, name: 'Learning', color: 'bg-purple-100 text-purple-800' },
  { id: 6, name: 'Misc', color: 'bg-gray-100 text-gray-800' },
]

const initialNotes: Note[] = [
  { id: 1, title: 'Meeting Notes', content: 'Discuss project timeline and milestones. Review team assignments and deadlines.', categoryIds: [1], isArchived: false },
  { id: 2, title: 'Grocery List', content: 'Milk, eggs, bread, fruits, vegetables, chicken, pasta', categoryIds: [2], isArchived: false },
  { id: 3, title: 'App Idea', content: 'Create a note-taking app with categories, archive feature, and intuitive UI', categoryIds: [3], isArchived: false },
  { id: 4, title: 'Book Recommendations', content: '1. The Great Gatsby\n2. To Kill a Mockingbird\n3. 1984\n4. Pride and Prejudice', categoryIds: [5], isArchived: false },
  { id: 5, title: 'Weekend Plans', content: 'Visit the museum, have lunch at the new cafe, evening movie', categoryIds: [2], isArchived: false },
  { id: 6, title: 'Workout Routine', content: 'Monday: Cardio\nTuesday: Upper body\nWednesday: Lower body\nThursday: HIIT\nFriday: Yoga\nSaturday: Full body\nSunday: Rest', categoryIds: [4], isArchived: false },
]

export function NoteTakingAppComponent() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)
  const [newCategory, setNewCategory] = useState('')

  const filteredNotes = notes.filter(note => 
    (selectedCategory === null || note.categoryIds.includes(selectedCategory)) &&
    note.isArchived === showArchived
  )

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
    const newNote = { id: Date.now(), title: '', content: '', categoryIds: [], isArchived: false }
    setEditingNote(newNote)
    // Note: The actual creation in the state happens after editing, in handleNoteUpdate
    // TODO: Send API request to create note in the backend after editing
    // Example: const createdNote = await createNoteInBackend(newNote)
    // Then update the local state with the created note from the backend
  }

  const handleAddCategory = (noteId: number, categoryId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId
        ? { ...note, categoryIds: [...new Set([...note.categoryIds, categoryId])] }
        : note
    ))
  }

  const handleRemoveCategory = (noteId: number, categoryId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId
        ? { ...note, categoryIds: note.categoryIds.filter(id => id !== categoryId) }
        : note
    ))
  }

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObj = {
        id: Date.now(),
        name: newCategory.trim(),
        color: `bg-gray-100 text-gray-800`
      }
      setCategories([...categories, newCategoryObj])
      setNewCategory('')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Categories</h2>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <button
            className={`w-full text-left p-2 mb-2 rounded-md transition-colors ${
              selectedCategory === null ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Notes
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              className={`w-full text-left p-2 mb-2 rounded-md transition-colors ${
                selectedCategory === category.id ? category.color : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Notes</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="archived"
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <Label htmlFor="archived" className="text-sm text-gray-600">Show Archived</Label>
            </div>
            <Button onClick={handleCreateNote} className="bg-gray-800 text-white hover:bg-gray-700">
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <Card key={note.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">{note.title}</CardTitle>
                <div className="flex flex-wrap gap-1 mt-1">
                  {note.categoryIds.map(categoryId => {
                    const category = categories.find(c => c.id === categoryId)
                    return category ? (
                      <span key={category.id} className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                        {category.name}
                      </span>
                    ) : null
                  })}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="ghost" size="sm" onClick={() => handleNoteClick(note)} className="text-gray-600 hover:text-gray-800">
                  <Edit3 className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleArchiveToggle(note.id)} className="text-gray-600 hover:text-gray-800">
                  {note.isArchived ? <CheckSquare className="mr-1 h-4 w-4" /> : <Archive className="mr-1 h-4 w-4" />}
                  {note.isArchived ? 'Unarchive' : 'Archive'}
                </Button>
                <Dialog open={deleteConfirmation === note.id} onOpenChange={() => setDeleteConfirmation(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmation(note.id)} className="text-gray-600 hover:text-red-600">
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
      </main>

      {/* Full-screen Edit Modal */}
      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl h-[90vh] flex flex-col bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <Input
                className="text-xl font-semibold border-none focus:ring-0 p-0 text-gray-800"
                value={editingNote.title}
                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                placeholder="Note Title"
              />
              <Button variant="ghost" size="icon" onClick={() => setEditingNote(null)} className="text-gray-600 hover:text-gray-800">
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4 py-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {editingNote.categoryIds.map(categoryId => {
                  const category = categories.find(c => c.id === categoryId)
                  return category ? (
                    <span key={category.id} className={`text-xs px-2 py-1 rounded-full ${category.color} flex items-center`}>
                      {category.name}
                      <button
                        className="ml-1 text-gray-600 hover:text-gray-800"
                        onClick={() => handleRemoveCategory(editingNote.id, category.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ) : null
                })}
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  onValueChange={(value) => handleAddCategory(editingNote.id, parseInt(value))}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => setNewCategory('')} className="text-gray-600 hover:text-gray-800">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {newCategory !== '' && (
                <div className="flex items-center space-x-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    
                    className="flex-grow"
                  />
                  <Button onClick={handleCreateCategory} size="sm">Add</Button>
                </div>
              )}
              <Textarea
                className="flex-grow resize-none text-gray-700"
                value={editingNote.content}
                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                placeholder="Start writing your note here..."
              />
            </CardContent>
            <CardFooter className="flex justify-end space-x-2 border-t pt-4">
              <Button onClick={() => handleNoteUpdate(editingNote)} className="bg-gray-800 text-white hover:bg-gray-700">Save Changes</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}