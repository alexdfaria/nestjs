import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { FirestoreService } from '../services/firestore.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly firestoreService: FirestoreService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const { userID } = payload;

    // Check if the user exists in Firestore based on the ID
    const userDoc = await this.firestoreService.db
      .collection('users')
      .where('userID', '==', userID)
      .get();

    if (userDoc.empty) {
      throw new Error('User not found');
    }

    return { userID };
  }
}