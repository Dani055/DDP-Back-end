const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.get('Authorization').split(' ')[1];
    decodedToken = jwt.verify(token, 'somesupersecret')
    if(decodedToken.roles.indexOf('Admin') === -1){
        return res.status(401)
            .json({ message: 'Not authorized.' });
    }
    next();
};