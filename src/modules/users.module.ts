import { Module } from '@nestjs/common';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../services/users.service';
import { FirestoreService } from '../services/firestore.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FirestoreService],
  exports: [UsersService],
})
export class UsersModule {}
