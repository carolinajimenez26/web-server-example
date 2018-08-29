/**************ENVIROMENT************/

process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/**************DATABASE************/

let mongoUrl;

if (process.env.NODE_ENV === 'dev') {
  mongoUrl = 'mongodb://localhost:27017/coffee';
} else {
  mongoUrl = 'mongodb://coffee-user:coffee-123456@ds015334.mlab.com:15334/coffee';
}

process.env.URLDB = mongoUrl;

/**************WEB TOKENS************/

// expire date
// 60 seconds, 60 minutes, 20 hour, 30 days
process.env.TOKEN_EXPIRES = 60 * 60 * 24 * 30;

// seed for jwt
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'super-secret';
