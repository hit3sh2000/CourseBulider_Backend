const mongoose = require('mongoose');
const User = mongoose.model('User');
const Cart = mongoose.model('Cart');
const config = require('../Paytm/config')
const checksum_lib = require('../Paytm/checksum')
module.exports = {
    pay: async (req, res) => {
        try {
            const id = req.body.id;
            const user = await User.findById(id);
            let temp = user.U_contact.toString()
            var paymentDetails = {
                amount: req.body.amount,
                customerId: user.U_firstname,
                customerEmail: user.U_email,
                customerPhone: temp
            }
        } catch (error) {
            res.send(error)
        }
        if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
            res.status(400).send('Payment failed')
        } else {
            var params = {};
            params['MID'] = config.PaytmConfig.mid;
            params['WEBSITE'] = config.PaytmConfig.website;
            params['CHANNEL_ID'] = 'WEB';
            params['INDUSTRY_TYPE_ID'] = 'Retail';
            params['ORDER_ID'] = 'TEST_' + new Date().getTime();
            params['CUST_ID'] = paymentDetails.customerId;
            params['TXN_AMOUNT'] = paymentDetails.amount;
            params['CALLBACK_URL'] = 'https://coursebuild3r.herokuapp.com/callback';
            params['EMAIL'] = paymentDetails.customerEmail;
            params['MOBILE_NO'] = paymentDetails.customerPhone;
            checksum_lib.genchecksum(params, config.PaytmConfig.key, function (err, checksum) {
                var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
                // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production
                params.CHECKSUMHASH = checksum
                res.json(params)
            });
        }

    },
    bill: async (req, res) => {
        try {
            const id = req.body.id;
            const user = await User.findById(id);
            const cart = await Cart.findOne({ user: id }).populate('cartItems.courseId').populate('cartItems.universityId');
            cart.cartItems.map(item=>{
                const courses = { 
                    course: item.courseId._id,
                    university: item.universityId._id
                }
                user.courses.push(courses)
            })
            res.json({user,cart:cart.cartItems})
            cart.cartItems.splice(0,cart.cartItems.length)

            await user.save();
            await cart.save();


        } catch (error) {

        }

    }

}
