import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesController } from './notes/controllers/notes.controller';
import { NotesService } from './notes/services/notes.service';
import { NotesRepository } from './notes/repositories/notes.repository';
import { PrismaService } from './prisma/prisma.service';
import { CategoriesController } from './categories/controllers/categories.controller';
import { CategoriesService } from './categories/services/categories.service';
import { CategoriesRepository } from './categories/repositories/categories.repository';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [AppController, NotesController, CategoriesController],
  providers: [AppService, NotesService, NotesRepository, PrismaService, CategoriesService, CategoriesRepository],
})
export class AppModule {}
