import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class RequestorInfo extends Entity {
  @property({
    type: 'string',
    jsonSchema: {
      minLength: 2,
      maxLength: 20,
    },
    default: '',
  })
  realm: string;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
    },
    default: '',
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
    default: '',
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
    default: '',
  })
  birthDate: string;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<RequestorInfo>) {
    super(data);
  }
}

export interface RequestorInfoRelations {
  // describe navigational properties here
}

export type RequestorInfoWithRelations = RequestorInfo & RequestorInfoRelations;
