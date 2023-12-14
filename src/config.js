import dotenv from 'dotenv';

dotenv.config(); 

export default {
    port: process.env.PORT,
    mongoUri: process.env.MONGODB_URI,
    sessionSecret: process.env.SESSION_SECRET,
    clientSecret: process.env.CLIENT_SECRET
};
