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
}

