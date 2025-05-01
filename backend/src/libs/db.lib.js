import { Prisma, PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcryptjs";
export const db = new PrismaClient();

const passowrdHashEXT = Prisma.defineExtension({
  name: "PasswordHash",
  model: {
    user: {
      async create({ args, query }) {
        // when using create() data object is sent , it comes under args so args.data.password
        if (args.data.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }

        return query(args); // query(args) here query is create() used above , this actually runs the create(args) with changes
      },
    },
  },
});

db.$extends(passowrdHashEXT);
