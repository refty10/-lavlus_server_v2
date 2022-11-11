import {Entity, model, property} from '@loopback/repository';

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

@model({settings: {strict: false}})
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
      minLength: 1,
      maxLength: 1000,
    },
  })
  refreshRate: number;

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Sensor>) {
    super(data);
  }
}

export interface SensorRelations {
  // describe navigational properties here
}

export type SensorWithRelations = Sensor & SensorRelations;
