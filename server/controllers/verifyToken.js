const jwt = require('jsonwebtoken');
const secretKey = "Dinesh Kumar Juluri";

function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    } catch (err) {
        console.error("JWT verification failed:", err);

        throw err; // If you want the error to propagate
    }
}

module.exports = verifyToken;
