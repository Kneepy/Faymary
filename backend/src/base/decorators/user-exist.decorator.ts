// Необходимо разобраться с тем как делать декораторы для валидации

import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"

export interface Validator {
    validate: (value: any) => boolean,
    defaultMessage: () => string
}

export interface ValidationOptions {
    message: string
}

export interface ValidateOptions {
    name: string
    validator: Validator
    options: ValidationOptions
}

export interface RegisterDecoratorOptions {
    name: string
    target: Function
    propertyName: string
    validator: Validator
    options: ValidationOptions
}

const registerDecorator = (options: RegisterDecoratorOptions) => {
    const validationMetadata = {
        target: options.target,
        propertyName: options.propertyName,
        validator: options.validator,
        type: options.name,
        options: options.options
    }
    Reflect.defineMetadata(validationMetadata.propertyName, validationMetadata, validationMetadata.target)
}

export function Validate(options: ValidateOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: options.name,
            target: object.constructor,
            propertyName: propertyName,
            validator: options.validator,
            options: options.options
        })
    }
}

export function UserExist(options?: ValidationOptions) {
    return Validate({
        name: "USER_EXIST",
        validator: {
            validate: (value): boolean => {
                console.log(value)
                return true
            },
            defaultMessage: () => "User already exist "
        },
        options
    })
}

export function NotNull(options?: ValidationOptions) {
    return Validate({
        name: "NOT_NULL",
        validator: {
            validate: (value): boolean => {
                console.log(value)
                return true
            },
            defaultMessage: () => "not null"
        },
        options
    })
}

@Injectable()
export class ValPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log(metadata)
        console.log(value)
    }
}