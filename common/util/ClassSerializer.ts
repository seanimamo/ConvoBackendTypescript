import 'reflect-metadata'; //required for class transformer to work;
import { ClassConstructor, instanceToPlain, plainToInstance } from "class-transformer";

/**
 * This class is a wrapper on top of the class-transformer npm package.
 * The use case of this class is:
 * 1. Avoid an unecessary global import of 'reflect-metadata' 
 * (See: https://www.npmjs.com/package/class-transformer#Installation)
 * 
 * 2. Keep consistency in serialization behavior by abstracting the 
 * parameters passed to class-transform functions.
 * 
 */
export class ClassSerializer {
  plainJsonToClass<T>(classType: ClassConstructor<T>, json: Record<any, any>): T {
    return plainToInstance(classType, json, { excludeExtraneousValues: true});
  }

  classToPlainJson(classBasedObject: Record<any, any>) {
    return instanceToPlain(classBasedObject, {exposeUnsetFields: false})
  }

  serialize(classBasedObject: Record<any, any>): string {
    return JSON.stringify(instanceToPlain(classBasedObject, {exposeUnsetFields: false}));
  }

  deserialize<T>(classType: ClassConstructor<T>, serializedJson: string): T {
    return plainToInstance(classType, JSON.parse(serializedJson), { excludeExtraneousValues: true});
  }
}