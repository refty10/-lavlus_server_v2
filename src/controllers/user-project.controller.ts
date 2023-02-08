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

  @get('/users/{uid}/projects', {
    responses: {
      '200': {
        description:
          '指定したuidのユーザが作成したプロジェクトの一覧を返します',
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
        description:
          '指定したnameのユーザが作成したプロジェクトの一覧を返します',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Project)},
          },
        },
      },
    },
  })
  async findByName(
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
