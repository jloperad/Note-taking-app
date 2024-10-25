import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';
import { Note } from '../entities/note.entity';

@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getAllNotes(@Query('active') active: boolean): Promise<Note[]> {
    return this.notesService.getAllNotes(active);
  }

  @Get('active')
  async getActiveNotes(): Promise<Note[]> {
    return this.notesService.getActiveNotes();
  }

  @Get('archived')
  async getArchivedNotes(): Promise<Note[]> {
    return this.notesService.getArchivedNotes();
  }

  @Get(':id')
  async getNoteById(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    return this.notesService.getNoteById(id);
  }

  @Post()
  async createNote(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.createNote(createNoteDto);
  }

  @Put(':id')
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.updateNote(id, updateNoteDto);
  }

  @Delete(':id')
  async deleteNote(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.notesService.deleteNote(id);
  }

  @Put(':id/archive')
  async toggleArchive(@Param('id', ParseIntPipe) id: number): Promise<Note> {
    return this.notesService.toggleArchiveStatus(id);
  }

  @Post(':noteId/categories/:categoryId')
  async addCategoryToNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<void> {
    return this.notesService.addCategoryToNote(noteId, categoryId);
  }

  @Delete(':noteId/categories/:categoryId')
  async removeCategoryFromNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<void> {
    return this.notesService.removeCategoryFromNote(noteId, categoryId);
  }

  @Get('category/:categoryId')
  async getNotesByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('active') active: boolean,
  ): Promise<Note[]> {
    return this.notesService.getNotesByCategory(categoryId, active);
  }
}
