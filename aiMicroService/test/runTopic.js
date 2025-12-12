import dotenv from "dotenv";
import { aiModelCall } from "../ai/ai.controller.js";

dotenv.config({path: "./ai.env"});

async function main() {
  const topic = process.argv[2] || "machine learning";
  try {
    const { points, diagram, reasoning } = await aiModelCall(topic);
    console.log("POINTS:\n" + points);
    console.log("\nDIAGRAM:\n" + diagram);
    console.log("\n=== REASONING TEXT ===\n" + reasoning);
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exit(1);
  }
}

main();
