import {Filter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Project, Sensing, User} from '../models';
import {ProjectRepository} from '../repositories';
// Authentication
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class ProjectSensingController {
  constructor(
    @repository(ProjectRepository)
    protected projectRepository: ProjectRepository,
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile & Omit<User, 'uid'>,
  ) {}

  @get('/projects/{id}/sensings', {
    responses: {
      '200': {
        description:
          '[プロジェクトのオーナーとメンバーのみ] センシングデータの一覧を返します',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Sensing)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Sensing>,
  ): Promise<Sensing[]> {
    // オーナーとメンバーが閲覧可能
    const uid = this.currentUserProfile[securityId];
    const foundProject = await this.projectRepository.findById(id);
    const allowedUsers = [...foundProject.members, foundProject.owner];
    if (!allowedUsers.includes(uid))
      throw new HttpErrors.Unauthorized(
        'このエンドポイントへの権限がありません',
      );
    return this.projectRepository.sensings(id).find(filter);
  }

  @post('/projects/{id}/sensings', {
    responses: {
      '200': {
        description: 'そのプロジェクトへセンシングデータを登録します',
        content: {'application/json': {schema: getModelSchemaRef(Sensing)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Project.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Sensing, {
            title: 'NewSensingInProject',
            exclude: ['id', 'updatedAt', 'createdAt', 'owner', 'projectId'],
            optional: ['projectId'],
          }),
        },
      },
    })
    sensing: Omit<Sensing, 'id'>,
  ): Promise<Sensing> {
    const uid = this.currentUserProfile[securityId];
    sensing.owner = uid;
    return this.projectRepository.sensings(id).create(sensing);
  }
}
