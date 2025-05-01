import { z } from "zod";


const emailSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({ message: "email is not valid" })
    .trim(),
});

const passwordSchema = z.object({
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, { message: "password must be of atleast 8 characters" })
    .trim()
    .regex(/[!@#$%^&*]/, {
      message: "Password must include a special character",
    })
    .regex(/[a-z]/, { message: "Password must include a small letter" })
    .regex(/[A-Z]/, { message: "Password must include a capital letter" })
    .regex(/\d/, { message: "Password must include a number" }), // [0-9]
});

const userSchema = z.object({
  username: z
    .string({
      required_error: "username is required",
      invalid_type_error: "username should be string",
    })
    .min(3, { message: "Must be 3 or more characters long" })
    .trim()
    .transform((username) => username.toLocaleLowerCase()),

  email: z
    .string({
      required_error: "email is required",
    })
    .email({ message: "email is not valid" })
    .trim(),

  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, { message: "password must be of atleast 8 characters" })
    .trim()
    .regex(/[!@#$%^&*]/, {
      message: "Password must include a special character",
    })
    .regex(/[a-z]/, { message: "Password must include a small letter" })
    .regex(/[A-Z]/, { message: "Password must include a capital letter" })
    .regex(/\d/, { message: "Password must include a number" }), // [0-9] ,

}).strict();

const loginSchema = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({ message: "email is not valid" })
    .trim(),
  password: z
    .string({
      required_error: "password is required",
    })
    .min(8, { message: "password must be of atleast 8 characters" })
    .trim()
    .regex(/[!@#$%^&*]/, {
      message: "Password must include a special character",
    })
    .regex(/[a-z]/, { message: "Password must include a small letter" })
    .regex(/[A-Z]/, { message: "Password must include a capital letter" })
    .regex(/\d/, { message: "Password must include a number" }), // [0-9] ,
}).strict();

const passwordResetSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
}).strict();

const changecurrentpasswordSchema = z.object({
  currentpassword: passwordSchema,
  newpassword: passwordSchema,
  confirmpassword: passwordSchema,
}).strict();


export {
  userSchema,
  loginSchema,
  emailSchema,
  passwordResetSchema,
  changecurrentpasswordSchema,
};
