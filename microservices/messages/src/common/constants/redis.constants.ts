export const REDIS_PROVIDER = "REDIS_PROVIDER"

export const REDIS_URL = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
export const REDIS_PASS = ""
export const REDIS_USER = ""
export const REDIS_DEFAULT_TTL = 300 // 10m.