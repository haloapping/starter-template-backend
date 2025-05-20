import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { createSlug } from "../src/libs/slug";
import { hashPassword } from "../src/libs/password";

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 10; i++) {
    const title = faker.word.words(3);

    await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await hashPassword(faker.word.words()),
        posts: {
          create: {
            title: title,
            slug: createSlug(title),
            comments: {
              create: {
                text: faker.word.words(10),
              },
            },
          },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
