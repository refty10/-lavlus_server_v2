import {Entity, model, property} from '@loopback/repository';
import {Feature} from 'geojson';
import {generate} from '../utils';

// 対応センサの種類
const sensorTypes = [
  'accelerometer',
  'gyroscope',
  'magnetometer',
  'location',
  'pressure',
  'light',
  'proximity',
  'noiseLevel',
  'wifi',
  'ble',
];

@model()
export class Sensor extends Entity {
  @property({
    type: 'string',
    jsonSchema: {
      enum: sensorTypes,
    },
  })
  type: typeof sensorTypes[number];

  @property({
    type: 'number',
    jsonSchema: {
      minimum: 1,
      maximum: 1000,
    },
  })
  refreshRate: number;
}

@model()
export class Period extends Entity {
  @property({
    type: 'number',
    jsonSchema: {
      minimum: 1,
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

  @property.array(String, {
    jsonSchema: {type: 'string', format: 'time', default: '10:00:00'},
  })
  expiration: string[];

  constructor(data?: Partial<Sensor>) {
    super(data);
  }
}

@model()
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
}

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
    jsonSchema: {
      type: 'string',
      minLength: 4,
      maxLength: 30,
    },
  })
  name: string;

  @property({
    jsonSchema: {
      type: 'string',
      minLength: 10,
      maxLength: 2000,
    },
  })
  overview: string;

  @property.array(String, {
    jsonSchema: {type: 'string', format: 'date-time'},
  })
  expiration: string[];

  @property({
    jsonSchema: {
      type: 'string',
      format: 'uri-reference',
    },
  })
  image: string;

  @property.array(Sensor)
  sensors: Sensor[];

  @property(Spatiotemporal)
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

  @property({
    type: 'string',
  })
  owner?: string;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
