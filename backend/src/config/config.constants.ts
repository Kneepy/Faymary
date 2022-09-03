export const SECRET_ACCESS_JWT = Buffer.from("Faymary").toString("base64");
export const SECRET_REFRESH_JWT = Buffer.from("Faymary Refresh Token").toString(
    "base64"
);
export const EXPIRENS_IN_REFRESH_TOKEN = 1209600000; // 14d
export const EXPIRENS_IN_ACCESS_TOKEN = 90000000000; // 15min 900000
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const EXPIRES_IN_CONFORMATION = 300000; // 5 min
export const EXPIRES_IN_NOTIFICATION = 86400000 * 2; // 2d

export const SMTP = {
    HOST: "smtp.gmail.com",
    PORT: 465,
    PASS: "rhwdejvnmlrfgtgn",
    USER: "ilyafamin4@gmail.com"
};
