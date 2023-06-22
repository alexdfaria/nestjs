import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

//const serviceAccount = require('../../firebase-adminsdk.json');

@Injectable()
export class FirestoreService {
  public db: FirebaseFirestore.Firestore;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    this.db = admin.firestore();
  }

  async saveData(collection: string, documentId: string, data: any): Promise<void> {
    await this.db.collection(collection).doc(documentId).set(data);
  }

}