import {Entity, model, property, hasMany} from '@loopback/repository';
import {Project} from './project.model';

@model()
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
}

@model()
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

  @property(RequesterInfo)
  requesterInfo: RequesterInfo;

  @property({
    type: 'boolean',
    default: false,
  })
  allowRequest: boolean;

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

  @hasMany(() => Project, {keyTo: 'owner'})
  projects: Project[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
