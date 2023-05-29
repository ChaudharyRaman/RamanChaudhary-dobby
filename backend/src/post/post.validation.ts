import Joi from 'joi';

const createPost = Joi.object({
    name: Joi.string().required().max(30),
    url:Joi.string().required()
});

export default { createPost  };