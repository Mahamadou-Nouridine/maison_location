const { default: Stripe } = require('stripe')
const { v4 } = require('uuid')
const stripe = new Stripe('sk_test_51Lme52JXfDLyXNrqaFBPmVl8rVfZVWHwuKLCmbUEEYyml7Jo5zRpRPoAjY0xYB30xY5JLLUmXgnPkhpsjR7tp6uz00v5v41njT')
const pay = async (req, res, next) => {
    const { amount, token } = req.body
    if (!amount || !token) {
        return res.status(401).json({ message: "need more info" })
    }
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: amount,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email
        }, { idempotencyKey: v4() })
    }).then(result => {
        console.log(result);
        res.status(200).json(result)
    }).catch(err => {
        console.log(err)
    })
}

module.exports = pay