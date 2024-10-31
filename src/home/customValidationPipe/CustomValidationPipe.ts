import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class   
 CustomTransformerPipe<T> implements PipeTransform<string, T> {
  constructor(private transformFunction: (value: string) => T, private isOptional : boolean) {}

  transform(value: string, metadata: ArgumentMetadata): T {
    if(!value && this.isOptional){
        // returns empty string if the value is not passed, good use case for validating optional Query Params
        return '' as T;
    }
    try {
      const transformedValue = this.transformFunction(value);
      return transformedValue;
    } catch (error) {
      throw new BadRequestException(`Invalid input value passed in ${metadata.data}, ${error?.message}` );
    }
  }
}

export function parseToInt(value: string): number {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
        throw new Error('Invalid Integer value');
    }
    return parsedValue;
}