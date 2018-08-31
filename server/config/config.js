/**************ENVIROMENT************/

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**************DATABASE************/

let mongoUrl;

if (process.env.NODE_ENV === 'dev') {
  mongoUrl = 'mongodb://localhost:27017/coffee';
} else {
  mongoUrl = process.env.MONGO_URL;
}

process.env.URLDB = mongoUrl;

/**************WEB TOKENS************/

// expire date
// 60 seconds, 60 minutes, 20 hour, 30 days
process.env.TOKEN_EXPIRES = 60 * 60 * 24 * 30;

// seed for jwt
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'super-secret';

/**************Google ClientID************/

process.env.CLIENT_ID = process.env.CLIENT_ID || "568646530013-r0k3pqtneln9f5e400akslotk5dh8drf.apps.googleusercontent.com";
