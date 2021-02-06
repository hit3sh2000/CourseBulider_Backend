const JWT = require('jsonwebtoken')


//for assigning a Access Token
module.exports = {
    signAccessToken: (id) => {
        return new Promise((resolve, reject) => {

            const payload = { id }
            const secret = "079d8c37cb8039d01b9ab2c9dc1f89f5eddc02ea15b80ece2a09620cce4d34bd"


            JWT.sign(payload, secret, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })
        })
    },

    //for verify a Access Token
    verifyAccessToken: (req, res, next) => {
        // const token = req.headers["authorization"]
        if(!req.headers['authorization']) return next()
         const authHeader = req.headers['authorization']
         const bearerToken = authHeader.split(' ');
         const token = bearerToken[1]

        if (!token) {
            res.json("give token")
        } else {
            JWT.verify(token, "079d8c37cb8039d01b9ab2c9dc1f89f5eddc02ea15b80ece2a09620cce4d34bd", (err, decoded) => {
                if (err) {
                    res.json({ auth: false, message: "U failed to authenticate" })
                } else {
                    req.userId = decoded.id;
                    next();
                }
            });
        }
    },

    //for assigning Refresh Token
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {

            const payload = {}
            const secret = "322e3b843e183ecaafa2683c31b6cf905170bf75360eb133bf2f73190f60d317"
            const options = {
                expiresIn: "1133s",
                issuer: 'hitesh',
                audience: userId
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) return reject(err)
                resolve(token)
            })
        })
    },
    // for verify a Refresh Token
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, "322e3b843e183ecaafa2683c31b6cf905170bf75360eb133bf2f73190f60d317", (err, payload) => {
                if (err) return reject(err)
                const userId = payload.aud

                resolve(userId)
            })
        })
    }
}