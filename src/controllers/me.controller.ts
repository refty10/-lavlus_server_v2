import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {User, RequesterInfo} from '../models';
import {UserRepository} from '../repositories';
// Authentication
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class MeController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile & Omit<User, 'uid'>,
  ) {}

  @get('/me')
  @response(200, {
    description: 'Own User model instances',
    content: {
      'application/json': {
        schema: {
          items: getModelSchemaRef(User),
        },
      },
    },
  })
  async find(
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    const uid = this.currentUserProfile[securityId];
    return this.userRepository.findById(uid, filter);
  }

  @patch('/me/requesterInfo')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async RequesterRegistration(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RequesterInfo, {
            title: 'NewRequesterInfo',
          }),
        },
      },
    })
    requesterInfo: RequesterInfo,
  ): Promise<User> {
    const uid = this.currentUserProfile[securityId];
    const user = await this.userRepository.findById(uid);
    user.requesterInfo = requesterInfo;
    user.allowRequest = true;
    user.updatedAt = new Date().toISOString();
    await this.userRepository.updateById(uid, user);
    return user;
  }

  // TODO: ユーザー登録を削除する場合の実装

  // @del('/me')
  // @response(204, {
  //   description: 'User DELETE success',
  // })
  // async deleteById(): Promise<void> {
  //   const uid = this.currentUserProfile[securityId];
  //   await this.userRepository.deleteById(uid);
  // }
}
