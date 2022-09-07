import { Expose } from "class-transformer";

@Expose()
export class ICustomHeaders extends Headers {
    authorization: string;
    fingerprint: string;
}
