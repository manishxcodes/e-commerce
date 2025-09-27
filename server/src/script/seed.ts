import mongoose from "mongoose";
import { constants } from "../constants/index.ts"
import { User } from "../models/user.model.ts";
import { Address, type IAddress } from "models/address.model.ts";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// sample address 
const sampleAddresses = [
    {
        houseNumber: '123',
        lane: 'Main Street',
        city: 'Mumbai',
        district: 'Mumbai City',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
    },
    {
        houseNumber: '456',
        lane: 'Park Avenue',
        city: 'Delhi',
        district: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        country: 'India'
    },
    {
        houseNumber: '789',
        lane: 'MG Road',
        city: 'Bangalore',
        district: 'Bangalore Urban',
        state: 'Karnataka',
        pincode: '560001',
        country: 'India'
    },
    {
        houseNumber: '321',
        lane: 'Anna Salai',
        city: 'Chennai',
        district: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
        country: 'India'
    }
];

// Sample users data
const sampleUsers = [
    {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'admin123',
        phoneNumber: '+1234567890',
        userType: constants.USER_TYPES.ADMIN,
        addressIndex: 0
    },
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'user123',
        phoneNumber: '+1234567891',
        userType: constants.USER_TYPES.USER,
        addressIndex: 1
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        password: 'user123',
        phoneNumber: '+1234567892',
        userType: constants.USER_TYPES.USER,
        addressIndex: 2
    },
    {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'superadmin@example.com',
        password: 'superadmin123',
        phoneNumber: '+1234567893',
        userType: constants.USER_TYPES.ADMIN,
        addressIndex: 3
    }
];

// connect to db
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
        await User.deleteMany({});
        await Address.deleteMany({});
        console.log("Cleared existing db");
    } catch(err) {
        console.error("error clearing data: ", err);
        throw err;
    }
}

async function createAddresses() {
    try {
        const createAddresses = await Address.insertMany(sampleAddresses);
        console.log(`Created ${createAddresses.length} addresses`);
        return createAddresses;
    } catch(err) {
        console.log("Error while creating address: ", err);
    }
}

async function createUsers(addresses: IAddress[]) {
    try {
        const hashedUserData = await Promise.all(
            sampleUsers.map(async (userData) => {
                const hashedPassword = await bcrypt.hash(userData.password, 10);
                return {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    password: hashedPassword,
                    phoneNumber: userData.phoneNumber,
                    userType: userData.userType,
                    address: addresses[userData.addressIndex]._id
                }
            })
        );

        const createdUsers = await User.insertMany(hashedUserData);
        console.log(`Created ${createdUsers.length} users`);
    } catch(err) {
        console.error("Error while creating user: ", err);
    }
}

async function seedUsers() {
    try {
        console.log('\nstarting user seeding \n');

        await connectToDB();
        await clearExisitngData();

        const addresses = await createAddresses();
        if(addresses) {
        const users = await createUsers(addresses);
        }
    } catch(err) {
        console.error("seeding failed: ", err);
    } finally {
        await mongoose.connection.close();
        console.log("db conn close");
    }
}

seedUsers();

export { seedUsers };