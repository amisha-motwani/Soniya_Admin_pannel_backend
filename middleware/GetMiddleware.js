// Access JWT_SECRET from environment variables
const key = process.env.Admin_Secret_key;
console.log("secret_key==>", key)

const getMiddleware = (req, res, next) => {
    // Get the secret key from the request header
    const secretKeyFromHeader = req.header("Secret-Key");
    
    // Check if secret key exists
    if (!secretKeyFromHeader) {
        return res.status(401).send({
            error: "Secret key is missing"
        });
    }

    // Compare the secret key from the header with the predefined Secret_key
    if (secretKeyFromHeader !==key) {
        return res.status(401).send({
            error: "Invalid secret key"
        });
    }

    // If secret keys match, proceed to the next middleware
    next();
};

module.exports = getMiddleware;
