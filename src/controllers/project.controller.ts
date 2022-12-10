import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Project, User} from '../models';
import {ProjectRepository} from '../repositories';
import {getRandomImage} from '../utils/getRandomImage';
// Authentication
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class ProjectController {
  constructor(
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile & Omit<User, 'uid'>,
  ) {}

  @post('/projects')
  @response(200, {
    description: '[依頼者登録を行ったユーザのみ] 新規プロジェクトを作成します',
    content: {'application/json': {schema: getModelSchemaRef(Project)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            title: 'NewProject',
            exclude: ['id', 'updatedAt', 'createdAt', 'owner', 'members'],
          }),
        },
      },
    })
    project: Omit<Project, 'id'>,
  ): Promise<Project> {
    if (!this.currentUserProfile.allowRequest)
      throw new HttpErrors.Unauthorized(
        'このエンドポイントへの権限がありません',
      );
    project.image = await getRandomImage();
    project.owner = this.currentUserProfile[securityId];
    return this.projectRepository.create(project);
  }

  @get('/projects/count')
  @response(200, {
    description: '現在のプロジェクトの数を返します',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Project) where?: Where<Project>): Promise<Count> {
    return this.projectRepository.count(where);
  }

  @get('/projects')
  @response(200, {
    description: 'プロジェクトの一覧を返します',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Project, {includeRelations: false}),
        },
      },
    },
  })
  async find(
    @param.filter(Project) filter?: Filter<Project>,
  ): Promise<Project[]> {
    return this.projectRepository.find(filter);
  }

  @get('/projects/{id}')
  @response(200, {
    description: '指定したidのプロジェクトを返します',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Project, {includeRelations: false}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Project, {exclude: 'where'})
    filter?: FilterExcludingWhere<Project>,
  ): Promise<Project> {
    return this.projectRepository.findById(id, filter);
  }

  @patch('/projects/{id}')
  @response(204, {
    description: '[オーナーのみ] プロジェクトを編集します',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Project, {
            partial: true,
            exclude: ['id', 'updatedAt', 'createdAt', 'owner'],
          }),
        },
      },
    })
    project: Project,
  ): Promise<void> {
    const foundProject = await this.projectRepository.findById(id);
    if (this.currentUserProfile[securityId] !== foundProject.owner)
      throw new HttpErrors.Unauthorized(
        'このエンドポイントへの権限がありません',
      );
    project.updatedAt = new Date().toISOString();
    await this.projectRepository.updateById(id, project);
  }

  @del('/projects/{id}')
  @response(204, {
    description: '[オーナーのみ] プロジェクトを削除します',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const foundProject = await this.projectRepository.findById(id);
    if (this.currentUserProfile[securityId] !== foundProject.owner)
      throw new HttpErrors.Unauthorized(
        'このエンドポイントへの権限がありません',
      );
    await this.projectRepository.deleteById(id);
  }
}
