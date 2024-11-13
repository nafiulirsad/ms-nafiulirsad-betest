require('dotenv').config();
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');

class JwtController {
    static async getToken(req, res) {
        try {
            const token = jwt.sign(
                { 
                    appName: 'Technical Test Code.ID x Jenius - ' + uniqid()
                },
                process.env.JWT_SECRET,
                { 
                    expiresIn: '1h' 
                }
            );
            res.status(201).json({
                status: 'success',
                message: 'Token generated successfully.',
                token: token
            });
        } catch (error) {
            res.status(500).json({ 
                status: 'error',
                message: 'An unexpected error occurred while login to system. Please try again later.',
                code: 500
            });
        }
    }
}
  
module.exports = JwtController;