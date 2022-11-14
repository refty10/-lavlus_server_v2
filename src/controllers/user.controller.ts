import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {param, get, getModelSchemaRef, response} from '@loopback/rest';
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
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(User) where?: Where<User>): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users/requester')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
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
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
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
    const users = await this.userRepository.find({
      ...filter,
      ...onlyRequesterFilter,
    });
    const filteredUid = users?.[0]?.uid ?? `${uid}"`;
    return this.userRepository.findById(filteredUid);
  }
}