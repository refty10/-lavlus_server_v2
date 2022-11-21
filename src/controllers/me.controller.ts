import {FilterExcludingWhere, repository, Filter} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {User, RequesterInfo, Sensing} from '../models';
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
    description: '自身のログイン情報を返します',
    content: {
      'application/json': {
        schema: {
          items: getModelSchemaRef(User),
        },
      },
    },
  })
  async me(
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
  async requesterRegistration(
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

  @get('/me/sensings', {
    responses: {
      '200': {
        description: '自身がアップロードしたセンシングデータの一覧を返します',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Sensing)},
          },
        },
      },
    },
  })
  async findSensings(
    @param.query.object('filter') filter?: Filter<Sensing>,
  ): Promise<Sensing[]> {
    const uid = this.currentUserProfile[securityId];
    return this.userRepository.sensings(uid).find(filter);
  }

  // TODO: ユーザー登録を削除する場合の実装

  // @del('/me')
  // @response(204, {
  //   description: '自身のユーザ登録を削除します',
  // })
  // async deleteById(): Promise<void> {
  //   const uid = this.currentUserProfile[securityId];
  //   await this.userRepository.deleteById(uid);
  // }
}
