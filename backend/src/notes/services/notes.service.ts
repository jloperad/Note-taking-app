import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { NotesRepository } from '../repositories/notes.repository';
import { CategoriesService } from '../../categories/services/categories.service';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';


@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly categoriesService: CategoriesService
  ) {}

  async getAllNotes(active: boolean): Promise<Note[]> {
    return this.notesRepository.findAll(active);
  }

  async getActiveNotes(): Promise<Note[]> {
    return this.notesRepository.findAll(true);
  }

  async getArchivedNotes(): Promise<Note[]> {
    return this.notesRepository.findAll(false);
  }

  async getNoteById(id: number): Promise<Note> {
    const note = await this.notesRepository.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async createNote(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesRepository.create(createNoteDto);
  }

  async updateNote(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    await this.getNoteById(id); // Ensure the note exists
    return this.notesRepository.update(id, updateNoteDto);
  }

  async deleteNote(id: number): Promise<void> {
    await this.getNoteById(id); // Ensure the note exists
    return this.notesRepository.delete(id);
  }

  async toggleArchiveStatus(id: number): Promise<Note> {
    const note = await this.getNoteById(id);
    return this.notesRepository.update(id, { isArchived: !note.isArchived });
  }

  async addCategoryToNote(noteId: number, categoryId: number): Promise<void> {
    await this.getNoteById(noteId); // Ensure the note exists
    await this.categoriesService.getCategoryById(categoryId); // Ensure the category exists
    const existingRelation = await this.notesRepository.findCategoryNoteRelation(noteId, categoryId);
    if (!existingRelation) {
      await this.notesRepository.addCategoryToNote(noteId, categoryId);
    }
  }

  async removeCategoryFromNote(noteId: number, categoryId: number): Promise<void> {
    await this.getNoteById(noteId); // Ensure the note exists
    await this.categoriesService.getCategoryById(categoryId); // Ensure the category exists
    const existingRelation = await this.notesRepository.findCategoryNoteRelation(noteId, categoryId);
    if (existingRelation) {
      await this.notesRepository.removeCategoryFromNote(noteId, categoryId);
    }
  }

  async getNotesByCategory(categoryId: number, active?: boolean): Promise<Note[]> {
    await this.categoriesService.getCategoryById(categoryId); // Ensure the category exists
    return this.notesRepository.findByCategory(categoryId, active);
  }

  async getCategoriesForNote(noteId: number): Promise<{ id: number; name: string; color: string }[]> {
    await this.getNoteById(noteId); // Ensure the note exists
    return this.notesRepository.findCategoriesByNoteId(noteId);
  }
}
