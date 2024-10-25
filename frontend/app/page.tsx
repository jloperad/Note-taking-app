'use client'

import { useState, useEffect } from 'react'
import { Archive, CheckSquare, Edit3, Plus, Trash2, X, Pencil, Save } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getActiveNotes, getArchivedNotes, createNote, updateNote, deleteNote, toggleArchiveStatus, getNotesByCategory, addCategoryToNote, removeCategoryFromNote, getCategoriesForNote } from '../services/notes-service'
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/category-service'

export type Note = {
  id: number
  title: string
  content: string
  isArchived: boolean
}

type Category = {
  id: number
  name: string
  color: string
}

export default function NoteTakingApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showArchived, setShowArchived] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [newCategory, setNewCategory] = useState('')
  const [noteCategories, setNoteCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('bg-gray-200 text-gray-800')
  const [deletingCategory, setDeletingCategory] = useState<number | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      let fetchedNotes;
      if (selectedCategory === null) {
        fetchedNotes = showArchived ? await getArchivedNotes() : await getActiveNotes();
      } else {
        fetchedNotes = await getNotesByCategory(selectedCategory, !showArchived);
      }
      setNotes(fetchedNotes);
      setLoading(false);
    };
    fetchNotes();
  }, [showArchived, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', (error as Error).message);
      }
    };
    fetchCategories();
  }, []);

  const filteredNotes = notes.filter(note => note.isArchived === showArchived)

  const fetchNoteCategories = async (noteId: number) => {
    setNoteCategories([]) // Clear previous categories
    setLoadingCategories(true)
    try {
      const fetchedCategories = await getCategoriesForNote(noteId)
      setNoteCategories(fetchedCategories)
    } catch (error) {
      console.error('Error fetching note categories:', (error as Error).message)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleNoteClick = async (note: Note) => {
    setEditingNote(note)
    await fetchNoteCategories(note.id)
  }
  
  const handleNoteUpdate = async (updatedNote: Note) => {
    if (!updatedNote.title.trim() || !updatedNote.content.trim()) {
      alert('Note title or content cannot be empty.');
      return;
    }

    try {
      const savedNote = await updateNote(updatedNote.id, updatedNote);
      
      setNotes(prevNotes => {
        const noteIndex = prevNotes.findIndex(note => note.id === savedNote.id);
        if (noteIndex !== -1) {
          // Update existing note
          return prevNotes.map(note => note.id === savedNote.id ? savedNote : note);
        } else {
          // Add new note
          return [savedNote, ...prevNotes];
        }
      });

      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', (error as Error).message);
      alert('Failed to save the note. Please try again.');
    }
  }

  const handleArchiveToggle = async (noteId: number) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    );
    setNotes(updatedNotes);

    try {
      const updatedNote = await toggleArchiveStatus(noteId);
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error toggling archive status:', (error as Error).message);
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
      ));
    }
  }

  const handleDeleteNote = async (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));

    try {
      await deleteNote(noteId);
    } catch (error) {
      console.error('Error deleting note:', (error as Error).message);
      const deletedNote = notes.find(note => note.id === noteId);
      if (deletedNote) {
        setNotes(prevNotes => [...prevNotes, deletedNote]);
      }
    }
    setDeleteConfirmation(null);
  }

  const handleCreateNote = async () => {
    const newNote = {title: '', content: '', isArchived: false};
    const createdNote = await createNote(newNote as any);
    setNotes(prevNotes => [createdNote, ...prevNotes]); // Add the new note to the beginning of the list
    setEditingNote(createdNote);
    setNoteCategories([]); // Clear the noteCategories state for the new note
  }

  const closeEditingModal = () => {
    if (editingNote && (!editingNote.title.trim() || !editingNote.content.trim())) {
      // Remove the note if it has no content
      setNotes(notes.filter(note => note.id !== editingNote.id));
      deleteNote(editingNote.id); // Optionally, remove it from the backend as well
    }
    setEditingNote(null);
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    setIsAddingCategory(true)
    try {
      const createdCategory = await createCategory({ name: newCategoryName, color: newCategoryColor })
      setCategories(prev => [...prev, createdCategory])
      setNewCategoryName('')
      setNewCategoryColor('bg-gray-200 text-gray-800')
    } catch (error) {
      console.error('Error creating category:', (error as Error).message)
    } finally {
      setIsAddingCategory(false)
    }
  }

  const handleUpdateCategory = async (category: Category) => {
    try {
      const updatedCategory = await updateCategory(category.id, {
        name: category.name,
        color: category.color,
      })
      setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c))
      setEditingCategory(null)
    } catch (error) {
      console.error('Error updating category:', (error as Error).message)
    }
  }

  const handleAddCategory = async (noteId: number, categoryId: number) => {
    const categoryToAdd = categories.find(c => c.id === categoryId);
    if (!categoryToAdd) return;

    // Optimistic update
    setNoteCategories(prev => [...prev, categoryToAdd]);

    try {
      await addCategoryToNote(noteId, categoryId);
      // No need to update state here as we've already done it optimistically
    } catch (error) {
      console.error('Error adding category to note:', (error as Error).message);
      // Revert optimistic update on error
      setNoteCategories(prev => prev.filter(c => c.id !== categoryId));
    }
  }

  const handleRemoveCategory = async (noteId: number, categoryId: number) => {
    // Optimistic update
    setNoteCategories(prev => prev.filter(c => c.id !== categoryId));

    try {
      await removeCategoryFromNote(noteId, categoryId);
      // No need to update state here as we've already done it optimistically
    } catch (error) {
      console.error('Error removing category from note:', (error as Error).message);
      // Revert optimistic update on error
      const categoryToRestore = categories.find(c => c.id === categoryId);
      if (categoryToRestore) {
        setNoteCategories(prev => [...prev, categoryToRestore]);
      }
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategory(categoryId)
      setCategories(prev => prev.filter(c => c.id !== categoryId))
      setDeletingCategory(null)
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category. Please try again.')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Categories</h2>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <button
            className={`w-full text-left p-2 mb-2 rounded-md transition-colors ${
              selectedCategory === null ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All Notes
          </button>
          {categories.map(category => (
            <div key={category.id} className="flex items-center mb-2">
              {editingCategory?.id === category.id ? (
                <>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="flex-grow mr-2"
                  />
                  <Button size="sm" onClick={() => handleUpdateCategory(editingCategory)}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingCategory(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <button
                    className={`flex-grow text-left p-2 rounded-md transition-colors ${
                      selectedCategory === category.id ? category.color : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingCategory(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Dialog open={deletingCategory === category.id} onOpenChange={(open) => setDeletingCategory(open ? category.id : null)}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete the category "{category.name}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingCategory(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}>Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          ))}
        </ScrollArea>
        <div className="mt-4">
          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="New category name"
            className="mb-2"
          />
          <Select value={newCategoryColor} onValueChange={setNewCategoryColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bg-red-200 text-red-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  Red
                </div>
              </SelectItem>
              <SelectItem value="bg-blue-200 text-blue-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                  Blue
                </div>
              </SelectItem>
              <SelectItem value="bg-green-200 text-green-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                  Green
                </div>
              </SelectItem>
              <SelectItem value="bg-yellow-200 text-yellow-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                  Yellow
                </div>
              </SelectItem>
              <SelectItem value="bg-purple-200 text-purple-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                  Purple
                </div>
              </SelectItem>
              <SelectItem value="bg-pink-200 text-pink-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                  Pink
                </div>
              </SelectItem>
              <SelectItem value="bg-indigo-200 text-indigo-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-indigo-500 mr-2"></div>
                  Indigo
                </div>
              </SelectItem>
              <SelectItem value="bg-teal-200 text-teal-800">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-teal-500 mr-2"></div>
                  Teal
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={handleCreateCategory} 
            className="w-full mt-2"
            disabled={isAddingCategory || !newCategoryName.trim()}
          >
            {isAddingCategory ? 'Adding...' : 'Add Category'}
          </Button>
        </div>
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

        {/* Loading Indicator */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredNotes.length > 0 ? (
          // Notes Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <Card key={note.id} className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-gray-800">{note.title}</CardTitle>
                  {/* <div className="flex flex-wrap gap-1 mt-1">
                    {note.categoryIds && note.categoryIds.map(categoryId => {
                      const category = categories.find(c => c.id === categoryId)
                      return category ? (
                        <span key={category.id} className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                          {category.name}
                        </span>
                      ) : null
                    })}
                  </div> */}
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
        ) : (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">No notes found.</p>
          </div>
        )}
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
              <Button variant="ghost" size="icon" onClick={closeEditingModal} className="text-gray-600 hover:text-gray-800">
                <X className="h-6 w-6" />
              </Button>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col space-y-4 py-4">
              <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
                {loadingCategories ? (
                  <span className="text-sm text-gray-500">Loading categories...</span>
                ) : noteCategories.length > 0 ? (
                  noteCategories.map(category => (
                    <span key={category.id} className={`text-xs px-2 py-1 rounded-full ${category.color} flex items-center`}>
                      {category.name}
                      <button
                        className="ml-1 text-gray-600 hover:text-gray-800"
                        onClick={() => handleRemoveCategory(editingNote.id, category.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No categories</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={selectedCategoryId}
                  onValueChange={setSelectedCategoryId}
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    if (selectedCategoryId) {
                      handleAddCategory(editingNote.id, parseInt(selectedCategoryId));
                      setSelectedCategoryId(null);
                    } else {
                      setNewCategory('');
                    }
                  }} 
                  className="text-gray-600 hover:text-gray-800"
                  disabled={isAddingCategory}
                >
                  {isAddingCategory ? (
                    <span className="animate-spin">↻</span>
                  ) : selectedCategoryId ? (
                    'Add'
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
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
                  <Button 
                    onClick={handleCreateCategory} 
                    size="sm"
                    disabled={isAddingCategory || !newCategory.trim()}
                  >
                    Add
                  </Button>
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
