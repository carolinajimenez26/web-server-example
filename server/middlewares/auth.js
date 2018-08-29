const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {
  let token = req.get('token');
  jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      });
    }
    req.user = decoded.user;
    next();
  });
};

let verifyAdmin = (req, res, next) => {
  let user = req.user;

  if (user.role === 'ADMIN_ROLE') {
    next();
  } else {
    return res.json({
      ok: false,
      err: "User is not admin"
    });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin
}
