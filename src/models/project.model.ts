import {Entity, model, property} from '@loopback/repository';
import {Sensor, Spatiotemporal} from '.';
import {generate} from '../utils';

@model()
export class Project extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    useDefaultIdType: false,
    default: () => generate(),
  })
  id: string;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 4,
      maxLength: 30,
    },
  })
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 10,
      maxLength: 2000,
    },
  })
  overview: string;

  @property.array(Date, {
    jsonSchema: {
      format: 'date-time',
    },
  })
  expiration: string[];

  @property({
    type: 'string',
    jsonSchema: {
      format: 'uri-reference',
    },
  })
  image: string;

  @property.array(Sensor, {
    type: 'object',
  })
  sensors: Sensor[];

  @property({
    type: 'object',
  })
  spatiotemporal: Spatiotemporal;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  createdAt: string;

  [prop: string]: any;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
