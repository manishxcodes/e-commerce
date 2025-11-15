import mongoose from "mongoose";
import { Category, type ICategory } from "models/category.model.ts";
import dotenv from 'dotenv';

dotenv.config();

const sampleParentCategory = [
    { name: "topwear"},
    { name: "bottomwear"},
    { name: "footwear" }
];

const sampleChildCategory = [
  { name: "shirt", parentCategory: "topwear", gender: "men" },
  { name: "t-shirt", parentCategory: "topwear", gender: "men" },
  { name: "jeans", parentCategory: "bottomwear", gender: "men" },
  { name: "shoes", parentCategory: "footwear", gender: "men" },
  { name: "heels", parentCategory: "footwear", gender: "women" },
  { name: "jeans", parentCategory: "bottomwear", gender: "women"}
];

async function connectToDB() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if(mongoUri) {
            const connectionInstance = await mongoose.connect(`${mongoUri}/e-comm`);  
            console.log(`\n Database connected for seed: \n DB host: ${connectionInstance.connection.host}`);
        } else {
            throw new Error("Missing mongoUri");
        }
    } catch(err) {
        console.log("Mongo DB connection failed", {details: err});
        process.exit(1);
    }
}

async function clearExisitngData() {
    try {
        await Category.deleteMany({});
        console.log("cleared Category");

        await Category.collection.dropIndexes();
        console.log("Dropped all indexes");
    } catch(err) {
        console.log("something went wrong: ", err);
    }
}

async function createParentCategory () {
    try {
        const parents = await Category.insertMany(sampleParentCategory);
        if(parents) {
            console.log("parents: ", parents);
            console.log("Parent category created: ", parents.map(p => p.name).join(","));
            return parents;
        }
    } catch(err) {
        console.log("Error: failed to create parent categories ", err);
    }
}

async function createChildCategory (parents: ICategory[]) {
    try {
        const childDoc = [];

        for(const child of sampleChildCategory) {
            const parent = parents.find(p => p.name === child.parentCategory);

            if(!parent) {
                console.log("No parent found for : ", child.name);
                continue;
            }

            const category = await Category.create({
                name: child.name,
                gender: child.gender || "",
                parentCategory: parent._id,
            });
            childDoc.push(category);
        }

        console.log("child categories created: ", childDoc.map(c => c.name).join(","));
    } catch (err) {
        console.error(" Failed to create child categories:", err);
    }
}

async function seed () {
    await connectToDB();
    await clearExisitngData();

    const parents = await createParentCategory();
    if(parents) await createChildCategory(parents);

    console.log("seeding completed");
    process.exit(0);
}

seed();


