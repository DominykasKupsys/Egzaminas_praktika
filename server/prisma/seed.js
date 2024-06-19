const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

async function seed() {
  try {
    const users = [
      {
        name: "admin",
        email: "admin@gmail.com",
        password: "admin",
        role: 1,
        isBlocked: 0,
      },
      {
        name: "user",
        email: "user@gmail.com",
        password: "user",
        role: 0,
        isBlocked: 0,
      },
    ];

    for (const user of users) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Create the user in the database
      const createdUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          isBlocked: user.isBlocked,
        },
      });

      // Generate the token
      const token = jwt.sign(
        { user_id: createdUser.id, email: createdUser.email },
        "secret",
        {
          expiresIn: "2h",
        }
      );

      // Update the user with the token
      await prisma.user.update({
        where: { id: createdUser.id },
        data: { token: token },
      });
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
