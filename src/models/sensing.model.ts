import {Entity, model, property} from '@loopback/repository';
import {generate} from '../utils';

@model()
export class Sensing extends Entity {
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
      format: 'uri-reference',
    },
    default: '',
  })
  url: string;

  @property({
    type: 'string',
    default: '',
  })
  originalname: string;

  @property({
    type: 'number',
    default: 0,
  })
  size: number;

  // TODO: 型定義 & 未実装
  @property({
    type: 'object',
    default: {},
  })
  meta: object;

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

  @property({
    type: 'string',
  })
  owner?: string;

  @property({
    type: 'string',
  })
  projectId?: string;

  constructor(data?: Partial<Sensing>) {
    super(data);
  }
}

export interface SensingRelations {
  // describe navigational properties here
}

export type SensingWithRelations = Sensing & SensingRelations;
