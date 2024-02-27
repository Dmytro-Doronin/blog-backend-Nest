import { Module } from '@nestjs/common';
import { CatsController } from './cat.controller';
import { CatsRepository } from './cat-repositoriy.service';
import { catsProviders } from '../../database/models/cats.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [CatsController],
    providers: [
        CatsRepository,
        ...catsProviders,
    ],
})
export class CatsModule {}