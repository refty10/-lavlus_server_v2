import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Project, Sensing} from '../models';
import {ProjectRepository} from './project.repository';
import {SensingRepository} from './sensing.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.uid,
  UserRelations
> {

  public readonly projects: HasManyRepositoryFactory<Project, typeof User.prototype.uid>;

  public readonly sensings: HasManyRepositoryFactory<Sensing, typeof User.prototype.uid>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>, @repository.getter('SensingRepository') protected sensingRepositoryGetter: Getter<SensingRepository>,
  ) {
    super(User, dataSource);
    this.sensings = this.createHasManyRepositoryFactoryFor('sensings', sensingRepositoryGetter,);
    this.projects = this.createHasManyRepositoryFactoryFor('projects', projectRepositoryGetter,);
    this.registerInclusionResolver('projects', this.projects.inclusionResolver);
  }
}
