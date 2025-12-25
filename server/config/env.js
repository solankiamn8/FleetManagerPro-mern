import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fleetmanagerpro',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  MAIL_USER: "solankiamn8@gmail.com",
  MAIL_PASS: "igafcirojgtdbcwm",
  ORS_API_KEY: "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjlkNzkwOTdmZWJkYzQ2ODQ4YWYzNDE5MWMwZWYwM2M5IiwiaCI6Im11cm11cjY0In0=",

};
