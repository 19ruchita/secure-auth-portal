import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "test@example.com" }
    });
    console.log("Success:", user);
  } catch (e) {
    console.error("Prisma Error Full Stack:", e);
  } finally {
    process.exit(0);
  }
}
main();
