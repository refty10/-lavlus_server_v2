import {Entity, model, property} from '@loopback/repository';
import {Period} from '.';
import {Feature} from 'geojson';

@model({settings: {strict: false}})
export class Spatiotemporal extends Entity {
  @property({
    type: 'object',
  })
  location: Feature;

  @property({
    type: 'object',
  })
  area: Feature;

  // TODO: 型定義 & 未実装
  @property({
    type: 'object',
    default: {},
  })
  ble: object;

  // TODO: 型定義 & 未実装
  @property({
    type: 'object',
    default: {},
  })
  wifi: object;

  @property.array(Period)
  periods: Period[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Spatiotemporal>) {
    super(data);
  }
}

export interface SpatiotemporalRelations {
  // describe navigational properties here
}

export type SpatiotemporalWithRelations = Spatiotemporal &
  SpatiotemporalRelations;
