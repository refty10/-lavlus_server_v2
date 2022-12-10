import {repository} from '@loopback/repository';
import {param, del, response, HttpErrors} from '@loopback/rest';
import {User} from '../models';
import {SensingRepository, ProjectRepository} from '../repositories';
// Authentication
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

@authenticate('jwt')
export class SensingController {
  constructor(
    @repository(SensingRepository)
    public sensingRepository: SensingRepository,
    @repository(ProjectRepository)
    public projectRepository: ProjectRepository,
    @inject(SecurityBindings.USER)
    public currentUserProfile: UserProfile & Omit<User, 'uid'>,
  ) {}

  @del('/sensings/{id}')
  @response(204, {
    description: 'Sensing DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    const uid = this.currentUserProfile[securityId];
    const target = await this.sensingRepository.findById(id);
    if (!target.projectId || !target.owner)
      throw new HttpErrors.NotFound(`Entity not found: Sensing with id ${id}`);
    const targetProject = await this.projectRepository.findById(
      target.projectId,
    );

    if (target.owner === uid || targetProject.owner === uid) {
      await this.sensingRepository.deleteById(id);
    } else {
      throw new HttpErrors.Unauthorized(
        'このエンドポイントへの権限がありません',
      );
    }
  }
}
