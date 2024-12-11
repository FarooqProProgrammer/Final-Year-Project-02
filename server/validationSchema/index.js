import Joi from "joi";

export const projectValidation = () => {


    const schema = Joi.object({
        title: Joi.string().min(3).max(100).required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref('startDate')).required(), // Ensure endDate is not before startDate
        tags: Joi.array()
            .items(
                Joi.object({
                    value: Joi.string().required(),
                    label: Joi.string().required(),
                })
            )
            .optional(), // Tags can be optional
        assign: Joi.object({
            value: Joi.string().required(),
            label: Joi.string().required(),
        }).required(), // Assign is required
        userId: Joi.string().required(),
    });


    return schema
    

}