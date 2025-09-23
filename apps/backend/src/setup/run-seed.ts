import connectDB from "../config/mongodb.config";
import { seedPlans } from "./seedPlans";

const runSeed = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    await seedPlans();
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    process.exit();
  }
};

runSeed();
