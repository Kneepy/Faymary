import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform
} from "@nestjs/common";

export interface Validator {
    validate: (value: any) => boolean;
    defaultMessage: () => string;
}

export interface ValidationOptions {
    message?: string | ((value: any) => string);
}

export interface ValidateOptions {
    name: string;
    validator: Validator;
    options: ValidationOptions;
}

export interface RegisterDecoratorOptions {
    name: string;
    target: Function;
    propertyName: string;
    validator: Validator;
    options: ValidationOptions;
}

export interface ValidationMetadata {
    type: string;
    target: Function;
    propertyName: string;
    validator: Validator;
    options: ValidationOptions;
}

const registerDecorator = (options: RegisterDecoratorOptions) => {
    const validationMetadata: ValidationMetadata = {
        target: options.target,
        propertyName: options.propertyName,
        validator: options.validator,
        type: options.name,
        options: options.options
    };
    Reflect.defineMetadata(
        validationMetadata.type,
        validationMetadata,
        validationMetadata.target
    );
};

export function Validate(options: ValidateOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            name: options.name,
            target: object.constructor,
            propertyName: propertyName,
            validator: options.validator,
            options: options.options
        });
    };
}

export function UserExist(options?: ValidationOptions) {
    return Validate({
        name: "USER_EXIST",
        validator: {
            validate: (value): boolean => {
                return true;
            },
            defaultMessage: () => "User already exist "
        },
        options
    });
}

export function NotNull(options?: ValidationOptions) {
    return Validate({
        name: "NOT_NULL",
        validator: {
            validate: (value): boolean => {
                return false;
            },
            defaultMessage: () => "not null"
        },
        options
    });
}

@Injectable()
export class ValPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const errors = [];
        const metadataKeys = Reflect.getMetadataKeys(metadata.metatype);

        metadataKeys.forEach(key => {
            const constraint: ValidationMetadata = Reflect.getMetadata(key, metadata.metatype);

            if (!constraint.validator.validate(value[constraint.propertyName])) {
                const message =
                    (constraint.options?.message instanceof Function
                        ? (constraint.options?.message)(value[constraint.propertyName])
                        : constraint.options?.message
                    ) || constraint.validator.defaultMessage();
                errors.push(message);
            }
        });

        if (errors.length) {
            throw new BadRequestException(errors);
        }

        return value;
    }
}
