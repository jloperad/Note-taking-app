import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Note } from '../entities/note.entity';
import { CreateNoteDto } from '../dto/create-note.dto';
import { UpdateNoteDto } from '../dto/update-note.dto';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(active: boolean): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { isArchived: !active },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });
  }

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    return this.prisma.note.create({
      data: createNoteDto,
    });
  }

  async update(id: number, updateNoteDto: UpdateNoteDto): Promise<Note> {
    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.note.delete({
      where: { id },
    });
  }

  async addCategoryToNote(noteId: number, categoryId: number): Promise<void> {
    await this.prisma.categoryOnNote.create({
      data: {
        noteId,
        categoryId
      }
    });
  }

  async removeCategoryFromNote(noteId: number, categoryId: number): Promise<void> {
    await this.prisma.categoryOnNote.delete({
      where: {
        noteId_categoryId: {
          noteId,
          categoryId
        }
      }
    });
  }

  async findByCategory(categoryId: number, active: boolean): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: {
        isArchived: !active,
        categories: {
          some: {
            categoryId: categoryId
          }
        }
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findCategoryNoteRelation(noteId: number, categoryId: number): Promise<boolean> {
    const relation = await this.prisma.categoryOnNote.findUnique({
      where: {
        noteId_categoryId: {
          noteId,
          categoryId
        }
      }
    });
    return !!relation;
  }

  async findCategoriesByNoteId(noteId: number): Promise<{ id: number; name: string; color: string }[]> {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });

    if (!note) {
      return [];
    }

    return note.categories.map(categoryOnNote => ({
      id: categoryOnNote.category.id,
      name: categoryOnNote.category.name,
      color: categoryOnNote.category.color
    }));
  }
}
