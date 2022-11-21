import {injectable, BindingScope} from '@loopback/core';
import * as firebaseAdmin from 'firebase-admin';
import {TokenService} from '@loopback/authentication';
import {securityId, UserProfile} from '@loopback/security';
import {HttpErrors} from '@loopback/rest';

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
    const accessedUser = {
      uid: token.uid,
      email: token.email,
      name: token.name,
      picture: token.picture,
    };
    // 新規ユーザーか判定
    const isRegistered = await this.userRepository.exists(token.uid);

    // 既存ユーザーの情報を更新
    isRegistered &&
      (await this.userRepository.updateById(token.uid, accessedUser));

    const user = isRegistered
      ? // 既存ユーザーならデータを取得
        await this.userRepository.findById(token.uid)
      : // 新規ユーザーなら登録
        await this.userRepository.create(accessedUser);

    return {
      [securityId]: token.uid,
      ..._.omit(user, ['uid']),
    };
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      return this.tokenToUserProfile(decodedToken);
    } catch (error) {
      console.error(error);
      throw new HttpErrors.Unauthorized(`Error encoding token : ${error.code}`);
    }
  }

  generateToken(userProfile: UserProfile): Promise<string> {
    throw new FirebaseTokenError('Method not implemented.');
  }
}
