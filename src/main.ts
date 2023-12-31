import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as admin from 'firebase-admin';

const serviceAccount = require('../firebase-adminsdk.json');

async function bootstrap() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
