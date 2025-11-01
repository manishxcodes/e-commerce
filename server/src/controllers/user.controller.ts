import type { Request, Response } from "express";
import userService from "services/user.service.ts";
import otpService from "services/otp.service.ts";

class UserController {
    signup = async(req: Request, res: Response): Promise<any> => {
        // get body 
        const {firstName, lastName, email, password, phoneNumber, userType} = req.body;

        // check if existing user 
        const existingUser = await userService.getUserByEmail(email);
        if(existingUser) {
            return res.status(403).json({message: "user already exists"});
        }

        // createUser
        

    }

    getUserById = async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = req.params.id;
            
            console.log("conrtoler", userId)
            if(userId) {
                const userData = await userService.getUserById(userId);
                return res.status(200).json({ data: userData });
            }
        } catch(err) {
            return res.status(500).json( {message: "somehign went wrong",details: err});
        }
}
}

export default new UserController();

// export const getUserById = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const userId = req.params.id;
        
//         console.log("conrtoler", userId)
//         if(userId) {
//             const userData = await User.findById(userId);
//             const address = await Address.findById("68d834109985e22b03d0f089");
//             return res.status(200).json({ data: userData, address });
//         }
//     } catch(err) {
//         return res.status(500).json( {message: "somehign went wrong",details: err});
//     }
// } 