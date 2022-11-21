import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Project, ProjectRelations, Sensing} from '../models';
import {SensingRepository} from './sensing.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly sensings: HasManyRepositoryFactory<Sensing, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SensingRepository') protected sensingRepositoryGetter: Getter<SensingRepository>,
  ) {
    super(Project, dataSource);
    this.sensings = this.createHasManyRepositoryFactoryFor('sensings', sensingRepositoryGetter,);
    this.registerInclusionResolver('sensings', this.sensings.inclusionResolver);
  }
}
