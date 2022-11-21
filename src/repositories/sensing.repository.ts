import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Sensing, SensingRelations} from '../models';

export class SensingRepository extends DefaultCrudRepository<
  Sensing,
  typeof Sensing.prototype.id,
  SensingRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Sensing, dataSource);
  }
}
