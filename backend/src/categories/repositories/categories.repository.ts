import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      include: {
        notes: {
          include: {
            note: true
          }
        }
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        notes: {
          include: {
            note: true
          }
        }
      }
    });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    await this.findById(id); // Ensure the category exists
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Ensure the category exists
    await this.prisma.$transaction(async (prisma) => {
      // First, delete all associations between the category and notes
      await prisma.categoryOnNote.deleteMany({
        where: { categoryId: id },
      });

      // Then, delete the category itself
      await prisma.category.delete({
        where: { id },
      });
    });
  }
}
