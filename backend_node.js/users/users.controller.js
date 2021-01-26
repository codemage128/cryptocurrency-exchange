const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const userService = require('./user.service');
const tfaservice = require('./tfaservice');

router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/name/:id', authorize(), userService.getAllNames);
router.get('/get-pincode/:pincode', userService.getAdminPinCode);
router.get('/pin-check/:pincode', authorize(), userService.pinCodeCheck);
router.get('/current', authorize(), getCurrent);
router.get('/get-admin', authorize(), userService.getAdminInfo);
router.get('/get-reinvest', authorize(), userService.getReinvestInfo);
router.get('/users-bylevel', authorize(), userService.usersByLevel);
router.get('/downline-status/:value', authorize(), userService.getDownlineStatus);
// router.post('/change-referrer', authorize(), userService.changeReferrer);
router.post('/payment-processing', authorize(), userService.setPaymentProcessing);
router.post('/set-adminpin', authorize(), userService.setAdminPinCode);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);
router.post('/auth/forgot-password/:username', userService.forgot_password);
router.post('/auth/reset-password/:id/:token', userService.reset_password);
router.post('/tfa/setup/:uname', tfaservice.setup);
router.get('/tfa/setup/:uname', tfaservice.get_tfa);
router.delete('/tfa/setup', tfaservice._delete);
router.post('/tfa/verify', tfaservice.verify);
router.post('/setPincode', authorize(), userService.pinSave);
router.post('update_tfa', userService.update_tfa);
router.post('/update_alltfa_false', userService.update_alltfa_false);
router.post('/update_alltfa_true', userService.update_alltfa_true);
router.post('/update_alletfa_false', userService.update_alletfa_false);
router.post('/update_alletfa_true', userService.update_alletfa_true);
router.post('/send-code/:username', userService.sendCode);
router.post('/verify-code', userService.verifyCode);
router.post('/update-paymentsetting', authorize(), userService.updatePaymentSetting);
router.post('/reinvest-setting', authorize(), userService.reinvestSetting);
router.post('/set-referrer', userService.setReferrer);
router.get('/getbyref/:referrer_id', userService.getByReferrerId);


module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(next);
}

function getCurrent(req, res, next) {
    res.json(req.user);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstName: Joi.string().empty(''),
        lastName: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty(''),
        tfa_allow: Joi.boolean(),
        etfa_allow: Joi.boolean(),
        pinCode: Joi.number(),
        referral_id: Joi.string().empty(''),
        btc_wallet_address: Joi.string().empty(''),
        ltc_wallet_address: Joi.string().empty(''),
        doge_wallet_address: Joi.string().empty(''),
    });
    validateRequest(req, next, schema);
}
function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}