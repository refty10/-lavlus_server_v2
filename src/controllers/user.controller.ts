import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
  HttpErrors,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
// Authentication
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @get('/users/count')
  @response(200, {
    description: 'ユーザの数を返します',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users/requester')
  @response(200, {
    description: '依頼者情報の一覧を返します',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User),
        },
      },
    },
  })
  async find(@param.filter(User) filter?: Filter<User>): Promise<User[]> {
    const onlyRequesterFilter: Filter<User> = {where: {allowRequest: true}};
    return this.userRepository.find({...filter, ...onlyRequesterFilter});
  }

  @get('/users/requester/{uid}')
  @response(200, {
    description: '指定したuidの依頼者情報を返します',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User),
      },
    },
  })
  async findById(
    @param.path.string('uid') uid: string,
    @param.filter(User, {exclude: 'where'})
    filter?: FilterExcludingWhere<User>,
  ): Promise<User> {
    const onlyRequesterFilter: Filter<User> = {
      where: {uid, allowRequest: true},
    };
    const user = await this.userRepository.findOne({
      ...filter,
      ...onlyRequesterFilter,
    });
    if (!user)
      throw new HttpErrors.NotFound(`Entity not found: User with id ${uid}`);
    return user;
  }
}
