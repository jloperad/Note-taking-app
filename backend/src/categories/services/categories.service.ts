import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  async getCategoryById(id: number): Promise<Category> {
    return this.categoriesRepository.findById(id);
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesRepository.create(createCategoryDto);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  async deleteCategory(id: number): Promise<void> {
    return this.categoriesRepository.delete(id);
  }
}
