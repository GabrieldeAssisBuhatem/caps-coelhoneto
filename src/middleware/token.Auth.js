// Exemplo do que poderia estar em 'token.auth.js'
const jwt = require('jsonwebtoken');

const generate = (payload) => {
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { algorithm: 'HS256' }
    );
    return token;
};

module.exports = { generate };