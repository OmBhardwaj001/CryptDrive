import { z } from "zod";

const emailSchema = z
  .object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email({ message: "email is not valid" })
      .trim(),
  })
  .strict();

const passwordSchema = z
  .object({
    password: z
      .string({
        required_error: "password is required",
      })
      .min(8, { message: "password must be of atleast 8 characters" })
      .regex(/[!@#$%^&*]/, {
        message: "Password must include a special character",
      })
      .regex(/[a-z]/, { message: "Password must include a small letter" })
      .regex(/[A-Z]/, { message: "Password must include a capital letter" })
      .regex(/\d/, { message: "Password must include a number" }), // [0-9]
  })
  .strict();

const userSchema = z
  .object({
    username: z
      .string({
        required_error: "username is required",
        invalid_type_error: "username should be string",
      })
      .min(3, { message: "Must be 3 or more characters long" })
      .max(30, { message: "Username cannot exceed 30 characters" })
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
      .regex(/[!@#$%^&*]/, {
        message: "Password must include a special character",
      })
      .regex(/[a-z]/, { message: "Password must include a small letter" })
      .regex(/[A-Z]/, { message: "Password must include a capital letter" })
      .regex(/\d/, { message: "Password must include a number" }), // [0-9] ,
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email({ message: "email is not valid" })
      .trim(),
    password: z.string({
      required_error: "password is required",
    }),
  })
  .strict();

const changecurrentpasswordSchema = z
  .object({
    currentPassword: z.string({
      required_error: "Current password is required",
    }),
    newPassword: z
      .string({
        required_error: "New password is required",
      })
      .min(8, { message: "password must be of atleast 8 characters" })
      .regex(/[!@#$%^&*]/, {
        message: "Password must include a special character",
      })
      .regex(/[a-z]/, { message: "Password must include a small letter" })
      .regex(/[A-Z]/, { message: "Password must include a capital letter" })
      .regex(/\d/, { message: "Password must include a number" }),
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .strict();

const lockedfolderSchema = z
  .object({
    nameByuser: z.string({
      required_error: "password is required",
    }),

    password: z
      .string({
        required_error: "password is required",
      })
      .min(8, { message: "password must be of atleast 8 characters" })
      .regex(/[!@#$%^&*]/, {
        message: "Password must include a special character",
      })
      .regex(/[a-z]/, { message: "Password must include a small letter" })
      .regex(/[A-Z]/, { message: "Password must include a capital letter" })
      .regex(/\d/, { message: "Password must include a number" }), // [0-9] ,
  })
  .strict();

export {
  userSchema,
  loginSchema,
  emailSchema,
  passwordSchema,
  changecurrentpasswordSchema,
  lockedfolderSchema,
};
