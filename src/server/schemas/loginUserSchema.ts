/* eslint-disable @typescript-eslint/naming-convention */
import { Joi } from "express-validation";

const loginUserSchema = {
  body: Joi.object({
    username: Joi.string().min(2).required().messages({
      "string.min": "Username must have 2 characters minimum",
      "string.empty": "Username is required",
    }),
    email: Joi.string().email(),
    password: Joi.string().min(5).required().messages({
      "string.min": "Password should have 5 characters minimum",
      "string.empty": "Password is required",
    }),
  }),
};

export default loginUserSchema;
