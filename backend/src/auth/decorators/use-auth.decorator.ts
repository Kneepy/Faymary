import { SetMetadata } from "@nestjs/common";
import { USE_AUTH_METADATA } from "../constants";

// Контролирует использование глобального защитника AuthGuard
// true - on; false - off
export const UseAuth = (isUse: boolean) =>
    SetMetadata(USE_AUTH_METADATA, isUse);

// off AuthGuard
export const DisableAuth = () => SetMetadata(USE_AUTH_METADATA, false);
