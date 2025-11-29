import mongoose from "mongoose";
import { Category } from "../models/category.model.ts";
import dotenv from 'dotenv';

dotenv.config();

const sampleCategories = [
  // Men's Topwear
  { name: "shirt", parentCategory: "topwear", gender: "men" },
  { name: "t-shirt", parentCategory: "topwear", gender: "men" },
  { name: "hoodie", parentCategory: "topwear", gender: "men" },
  { name: "jacket", parentCategory: "topwear", gender: "men" },
  { name: "sweater", parentCategory: "topwear", gender: "men" },
  
  // Men's Bottomwear
  { name: "jeans", parentCategory: "bottomwear", gender: "men" },
  { name: "trousers", parentCategory: "bottomwear", gender: "men" },
  { name: "shorts", parentCategory: "bottomwear", gender: "men" },
  { name: "chinos", parentCategory: "bottomwear", gender: "men" },
  
  // Men's Footwear
  { name: "sneakers", parentCategory: "footwear", gender: "men" },
  { name: "formal shoes", parentCategory: "footwear", gender: "men" },
  { name: "sandals", parentCategory: "footwear", gender: "men" },
  { name: "boots", parentCategory: "footwear", gender: "men" },
  
  // Women's Topwear
  { name: "blouse", parentCategory: "topwear", gender: "women" },
  { name: "t-shirt", parentCategory: "topwear", gender: "women" },
  { name: "top", parentCategory: "topwear", gender: "women" },
  { name: "sweater", parentCategory: "topwear", gender: "women" },
  { name: "jacket", parentCategory: "topwear", gender: "women" },
  
  // Women's Bottomwear
  { name: "jeans", parentCategory: "bottomwear", gender: "women" },
  { name: "skirt", parentCategory: "bottomwear", gender: "women" },
  { name: "trousers", parentCategory: "bottomwear", gender: "women" },
  { name: "leggings", parentCategory: "bottomwear", gender: "women" },
  
  // Women's Footwear
  { name: "heels", parentCategory: "footwear", gender: "women" },
  { name: "flats", parentCategory: "footwear", gender: "women" },
  { name: "sneakers", parentCategory: "footwear", gender: "women" },
  { name: "sandals", parentCategory: "footwear", gender: "women" },
  { name: "boots", parentCategory: "footwear", gender: "women" },
  
  // Unisex Items
  { name: "cap", parentCategory: "topwear", gender: "unisex" },
  { name: "socks", parentCategory: "footwear", gender: "unisex" },
];

async function connectToDB() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MONGO_URI in environment variables");
    }
    
    const connectionInstance = await mongoose.connect(`${mongoUri}/e-comm`);
    console.log(`\n✓ Database connected for seed`);
    console.log(`  DB host: ${connectionInstance.connection.host}\n`);
  } catch (err) {
    console.error("✗ MongoDB connection failed:", err);
    process.exit(1);
  }
}

async function clearExistingData() {
  try {
    await Category.deleteMany({});
    console.log("✓ Cleared all categories");
    
    await Category.collection.dropIndexes();
    console.log("✓ Dropped all indexes\n");
  } catch (err) {
    console.error("✗ Error clearing data:", err);
    throw err;
  }
}

async function seedCategories() {
  try {
    const categories = await Category.insertMany(sampleCategories);
    
    console.log(`✓ Created ${categories.length} categories:\n`);
    
    // Group by parent category for better display
    const grouped = categories.reduce((acc, cat) => {
      const key = `${cat.parentCategory} - ${cat.gender}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(cat.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(grouped).forEach(([key, names]) => {
      console.log(`  ${key}:`);
      console.log(`    ${names.join(", ")}`);
    });
    
    return categories;
  } catch (err) {
    console.error("✗ Failed to seed categories:", err);
    throw err;
  }
}

async function seed() {
  try {
    await connectToDB();
    await clearExistingData();
    await seedCategories();
    
    console.log("\n✓ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n✗ Seeding failed:", err);
    process.exit(1);
  }
}

seed();