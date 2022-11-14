import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RequesterInfo extends Entity {
  @property({
    type: 'string',
    jsonSchema: {
      minLength: 2,
      maxLength: 20,
    },
    required: true,
  })
  realm: string;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
    },
    required: true,
  })
  gender: 'male' | 'female' | 'other';

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 0,
      maxLength: 140,
    },
    default: '',
  })
  introduction: string;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 2,
      maxLength: 20,
    },
    required: true,
  })
  organization: string;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'uri-reference',
    },
    default: '',
  })
  url: string;

  @property({
    type: 'date',
    jsonSchema: {
      format: 'date-time',
    },
    required: true,
  })
  birthDate: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RequesterInfo>) {
    super(data);
  }
}

export interface RequesterInfoRelations {
  // describe navigational properties here
}

export type RequesterInfoWithRelations = RequesterInfo & RequesterInfoRelations;
