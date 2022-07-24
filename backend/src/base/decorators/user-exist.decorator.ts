// Необходимо разобраться с тем как делать декораторы для валидации

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"


export interface UserExistOptions {
    message: string
}

export interface UserExistValidationOptions {

}

export interface Validator {
    validate: (value: any) => boolean,
    defaultMessage: () => string
}

export interface ValidateOptions {
    name: string
    validator: Validator
}

export interface RegisterDecoratorOptions {
    name: string
    target: Function
    propertyName: string
    validator: Validator
}

const registerDecorator = (options: RegisterDecoratorOptions) => {
    // Reflect.defineMetadata()
}

export function Validate(options: ValidateOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: options.name,
            target: object.constructor,
            propertyName: propertyName,
            validator: options.validator
        })
    }
}

export function UserExist(options: UserExistOptions, validationOptions: UserExistValidationOptions) {
    return Validate({
        name: "USER_EXIST",
        validator: {
            validate: (value): boolean => {
                console.log(value)
                return true
            },
            defaultMessage: () => "User already exist "
        }
    })
}

@Injectable()
export class ValPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(value)
    }
}