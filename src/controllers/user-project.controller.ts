import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, HttpErrors} from '@loopback/rest';
import {User, Project} from '../models';
import {UserRepository} from '../repositories';
// Authentication
import {authenticate} from '@loopback/authentication';

@authenticate('jwt')
export class UserProjectController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @get('/users/{id}/projects', {
    responses: {
      '200': {
        description: 'Array of User has many Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('uid') uid: string,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.userRepository.projects(uid).find(filter);
  }

  @get('/users/name/{name}/projects', {
    responses: {
      '200': {
        description: 'Array of User has many Project',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async findOnName(
    @param.path.string('name') name: string,
    @param.query.object('filter') filter?: Filter<Project>,
  ): Promise<Project[]> {
    // TODO: nameの重複に対して未対策
    const user = await this.userRepository.findOne({where: {name}});
    if (!user)
      throw new HttpErrors.NotFound(`Entity not found: User with name ${name}`);
    return this.userRepository.projects(user.uid).find(filter);
  }
}
