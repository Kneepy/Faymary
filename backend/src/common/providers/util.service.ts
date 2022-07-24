import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilService {
    public removeUndefined<T>(args: T) {
        return Object.fromEntries(
            Object.entries(args).filter(
                ([, value]: [string, unknown]) => value !== undefined
            )
        );
    }
}
