import {Entity, model, property} from '@loopback/repository';
import {RequestorInfo} from '.';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    useDefaultIdType: false,
  })
  uid: string;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 4,
      maxLength: 20,
    },
  })
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'uri-reference',
    },
  })
  picture: string;

  @property({
    type: 'object',
    default: {},
  })
  requestorInfo: RequestorInfo;

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

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
