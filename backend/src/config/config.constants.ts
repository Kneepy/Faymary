export const SECRET_ACCESS_JWT = Buffer.from("Faymary").toString("base64");
export const SECRET_REFRESH_JWT = Buffer.from("Faymary Refresh Token").toString(
    "base64"
);
export const EXPIRENS_IN_REFRESH_TOKEN = 1209600000; // 14d
export const EXPIRENS_IN_ACCESS_TOKEN = 900000; // 15min
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const EXPIRES_IN_CONFORMATION = 300000; // 5 min

export const SMTP = {
    HOST: "smtp.gmail.com",
    PORT: 465,
    PASS: "rhwdejvnmlrfgtgn",
    USER: "ilyafamin4@gmail.com"
};
