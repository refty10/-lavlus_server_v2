import {injectable, BindingScope} from '@loopback/core';
import * as firebaseAdmin from 'firebase-admin';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';

import {repository} from '@loopback/repository';
import {UserRepository} from '../repositories';

import _ from 'lodash';

// Add this so that loopback can tell the user what error happened
class FirebaseTokenError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 403) {
    super(message);
    this.statusCode = statusCode;
  }
}

@injectable({scope: BindingScope.TRANSIENT})
export class FirebaseTokenService implements TokenService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  async tokenToUserProfile(
    token: firebaseAdmin.auth.DecodedIdToken,
  ): Promise<UserProfile> {
    // 新規ユーザーか判定
    if (!(await this.userRepository.exists(token.uid))) {
      // 新規ユーザーなら作成
      const user = await this.userRepository.create({
        uid: token.uid,
        email: token.email,
        name: token.name,
        picture: token.picture,
      });
      return {
        [securityId]: token.uid,
        ..._.omit(user, ['uid']),
      };
    } else {
      // 既存ユーザーならデータを取得して返す
      const user = await this.userRepository.findById(token.uid);
      return {
        [securityId]: token.uid,
        ..._.omit(user, ['uid']),
      };
    }
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      return this.tokenToUserProfile(decodedToken);
    } catch (error) {
      console.error(error);
      throw new FirebaseTokenError(`${error.code}`, 401);
    }
  }

  generateToken(userProfile: UserProfile): Promise<string> {
    throw new FirebaseTokenError('Method not implemented.');
  }
}
