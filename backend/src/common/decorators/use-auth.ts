import { SetMetadata } from "@nestjs/common"

// контролирует использование глобального защитника AuthGuard

export const USE_AUTH_METADATA = "useAuth"

// true - on; false - off
export const UseAuth = (use: boolean) => SetMetadata(USE_AUTH_METADATA, use)
// off
export const DisableAuth = () => SetMetadata(USE_AUTH_METADATA, false)