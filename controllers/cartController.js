const mongoose = require('mongoose');
const User = mongoose.model('User');
const Cart = mongoose.model('Cart');
module.exports = {
    addCourseInCart: async (req, res) => {
        try {
            const usid = req.body.usid;
            const cid = req.body.cid;
            const uid = req.body.uid;
            const cart = await Cart.findOne({ user: uid });
            const cart_course = await Cart.findOne({ user: uid }).populate("cartItems.courseId");
            let check = 0;
            let total = 0;

            cart.cartItems.map((item) => {
                if (item.courseId == cid) {
                    check = 1;
                }
            })
            if (check == 0) {
                cart.cartItems.push({courseId:cid,universityId:usid});
                // cart_course.cartItems.courseId.map(item => {
                //     total += parseInt(item.C_price)
                // })
                await cart.save();
                res.json({ TotalAmount: total, cart: true, cart })
            } else {
                cart_course.cartItems.map(item => {
                    total += parseInt(item.courseId.C_price)
                })
                // (total);
                // console.log({ message: "courese is already added in cart" });

                res.json({ TotalAmount: total, course: cart, cart: false, message: "courese is already added in cart" })
            }
        } catch (err) {
            res.send(err)
            // console.log(err);
        }
    },
    removeCourseInCart: async (req, res) => {
        try {
            const cid = req.body.cid;
            const uid = req.body.uid;
            const cart = await Cart.findOne({ user: uid });
            cart.cartItems.map(async(item, index) => {

                if (!item.courseId == cid) {
                    res.json({course: cart, status: "done", message: "item does not exist" })
                    await cart.save()
                } else if (item.courseId == cid) {
                    cart.cartItems.splice(index, 1);
                    res.json({ course: cart, status: "done", message: "remove " })
                    await cart.save()
                }
            })
           

        } catch (err) {
            res.send(err)
        }
    },
    cartItems: async (req, res) => {
        try {
            let total = 0;
            let c = 0;
            const course = await Cart.findOne({ user: req.params.id }).populate('cartItems.courseId').populate('cartItems.universityId');
            for (let item of course.cartItems){
                
                total = total + parseInt(item.courseId.C_price);
                c++
                if(c == course.cartItems.length){
                    break;
                }
            }
            res.json({details:course.cartItems,total});
            
        } catch (err) {
            res.send(err)
        }
    },
    getCourseInCart: async (req, res) => {
        try {
            const cart = await Cart.find();
            res.send(cart);
        } catch (err) {
            res.send(err)
        }
    }
}