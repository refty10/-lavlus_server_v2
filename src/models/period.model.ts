import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Period extends Entity {
  @property({
    type: 'number',
    jsonSchema: {
      minLength: 1,
    },
  })
  interval: number;

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['day', 'week'],
    },
  })
  entity: 'day' | 'week';

  @property({
    type: 'string',
    jsonSchema: {
      enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    },
  })
  dayOfWeek: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';

  @property.array(Date, {
    jsonSchema: {
      format: 'date-time',
    },
  })
  expiration: string[];

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Period>) {
    super(data);
  }
}

export interface PeriodRelations {
  // describe navigational properties here
}

export type PeriodWithRelations = Period & PeriodRelations;
