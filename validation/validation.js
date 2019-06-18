//validation
const Joi = require("@hapi/joi")

const registrationValidation = data =>{
    const Schema = {
        name:Joi.string()
        .min(4)
        .required(),
        email:Joi.string()
        .min(6)
        .required(),
        password:Joi.string()
        .min(6)
        .required()
    };

    return Joi.validate(data,Schema)
};

const loginValidation = data =>{
    const Schema = {
        name:Joi.string()
        .min(4),
        email:Joi.string()
        .min(6),
        password:Joi.string()
        .min(6)
        .required()
    };

    return Joi.validate(data,Schema)
};
module.exports.registrationValidation = registrationValidation;
module.exports.loginValidation = loginValidation;
