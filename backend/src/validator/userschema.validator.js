import { z } from "zod";

const roleEnum = z.enum(["admin", "user", "guest"]);

const userSchema = z.object({
  username: z
    .string({
      required_error: "username is required",
      invalid_type_error: "username should be string",
    })
    .min(3, { message: "Must be 5 or more characters long" })
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
    .regex(/\d/, { message: "Password must include a number" }), // [0-9]

  role: z.nativeEnum(roleEnum),
});

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
    .regex(/\d/, { message: "Password must include a number" }), // [0-9]
});

const emailScehma = z.object({
  email: z
    .string({
      required_error: "email is required",
    })
    .email({ message: "email is not valid" })
    .trim(),
});

const passwordResetSchema = z.object({
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
    .regex(/\d/, { message: "Password must include a number" }), // [0-9]
});

export { userSchema, loginSchema, emailScehma, passwordResetSchema };
