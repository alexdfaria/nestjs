import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

/*

curl -X POST -H "Content-Type: application/json" -d '{
  "userID": "exampleUserID",
  "terms": true,
  "languages": ["en", "fr"],
  "showProfilePreferences": true,
  "showLanguages": false
}' http://localhost:3000/v1/user/preferences


*/
