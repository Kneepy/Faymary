export const SECRET_ACCESS_JWT = Buffer.from("Faymary").toString("base64");
export const SECRET_REFRESH_JWT = Buffer.from("Faymary Refresh Token").toString(
    "base64"
);
export const EXPIRENS_IN_REFRESH_TOKEN = 1209600000; // 14d
export const EXPIRENS_IN_ACCESS_TOKEN = 900000; // 15min
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const MAIL_HOST = "smtp.gmail.com"
export const MAIL_PORT = 465
export const MAIL_ACCOUNT_PASS = "tgazfbnbvnzjypyg"
export const MAIL_ACCOUNT_USER = "ilyafamin4@gmail.com"
