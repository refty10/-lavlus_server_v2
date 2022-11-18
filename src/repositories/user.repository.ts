import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Project} from '../models';
import {ProjectRepository} from './project.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.uid,
  UserRelations
> {

  public readonly projects: HasManyRepositoryFactory<Project, typeof User.prototype.uid>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('ProjectRepository') protected projectRepositoryGetter: Getter<ProjectRepository>,
  ) {
    super(User, dataSource);
    this.projects = this.createHasManyRepositoryFactoryFor('projects', projectRepositoryGetter,);
    this.registerInclusionResolver('projects', this.projects.inclusionResolver);
  }
}
