import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "middlewares/async-handler.ts";
import { Address } from "models/address.model.ts";
import { User } from "models/user.model.ts";
import mongoose from "mongoose";
import { AppError } from "utils/AppError.ts";
import { AppResponse } from "utils/AppResponse.ts";

export const addAddress = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        if(!userId) return next(new AppError("Unathorized", 401));

        const session = await mongoose.startSession();
        session.startTransaction();

        try { 
            const { 
                houseNumber,
                lane,
                city,
                district,
                state, 
                pincode,
                country
            } = req.body;

            const createAddress = await Address.create([{
                houseNumber, lane, city, district, state, pincode, country
            }], { session });

            const newAddress = createAddress[0];

            if(!newAddress) {
                await session.abortTransaction();
                session.endSession();
                return next(new AppError("Failed to add address", 500)); 
            }

            await User.findByIdAndUpdate(
                userId, 
                { address: newAddress._id },
                { new: true, session }
            );

            // commit transaction 
            await session.commitTransaction();
            session.endSession();

            return AppResponse.success(
                res,
                "Address added successfully",
                newAddress
            );
        } catch(err) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError("Failed to add address", 500));            
        }
        
    }
);

export const getAddress = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;

        const user = await User.findById(userId).populate("address");
        if(!user) return next(new AppError("User not found", 404));

        return AppResponse.success(res, "Address fetched successful", user.address);
    }
);

export const updateAddress = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        // chekc if user exists
        const user = await User.findById(userId);
        if(!user || user.address) return next(new AppError("No address found for this user", 404));

        // check if user can delete address
        if(String(user.address) !== id) return next(new AppError("Unauthorized to update this address", 403));

        const updatedAddress = await Address.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true}
        );

        if (!updatedAddress) {
            return next(new AppError("Failed to update address", 500));
        }

        return AppResponse.success(res, "Address updated successfully", updatedAddress);
    }
);

export const deleteAddress = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.userId;
        const { id } = req.params;

        // chekc if user exists
        const user = await User.findById(userId);
        if(!user || user.address) return next(new AppError("No address found for this user", 404));

        // check if user can delete address
        if(String(user.address) !== id) return next(new AppError("Unauthorized to update this address", 403));

        // delete address 
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            await Address.findByIdAndDelete(id, { session });
            await User.findByIdAndUpdate(
                userId, 
                { address: null},
                { session }
            );

            
            await session.commitTransaction();
            session.endSession();

            return AppResponse.success(res, "Address deleted succesfully");

        } catch(err) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError("Failed to delete address", 500,))
        }
    }
);




