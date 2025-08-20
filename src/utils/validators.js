const Joi = require('joi');

const nameSchema = Joi.string().min(20).max(60);
const addressSchema = Joi.string().max(400).allow('');
const emailSchema = Joi.string().email();
const passwordSchema = Joi.string()
    .min(8)
    .max(16)
    .pattern(/[A-Z]/, 'at least one uppercase letter')
    .pattern(/[^A-Za-z0-9]/, 'at least one special character');

const signupSchema = Joi.object({
    name: nameSchema.required(),
    email: emailSchema.required(),
    address: addressSchema.required(),
    password: passwordSchema.required()
});

const loginSchema = Joi.object({
    email: emailSchema.required(),
    password: Joi.string().required()
});

const createUserSchema = Joi.object({
    name: nameSchema.required(),
    email: emailSchema.required(),
    address: addressSchema.required(),
    password: passwordSchema.required(),
    role: Joi.string().valid('admin', 'user', 'owner').required()
});

const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: passwordSchema.required()
});

const createStoreSchema = Joi.object({
    name: Joi.string().required(),
    email: emailSchema.allow('', null),
    address: addressSchema.required(),
    ownerId: Joi.string().allow(null, '')
});

const ratingSchema = Joi.object({
    value: Joi.number().integer().min(1).max(5).required()
});

module.exports = {
    signupSchema,
    loginSchema,
    createUserSchema,
    changePasswordSchema,
    createStoreSchema,
    ratingSchema
};
