import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from '../repositories/notes.repository';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) {}

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
}

