import * as Joi from 'joi'
import { ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator } from 'express-joi-validation'


const validator = createValidator()

export const AuthSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required()
})