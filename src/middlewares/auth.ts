import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const client = new PrismaClient();
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(403).json({ message: "No token provided or incorrect format", success: false });
        }
        const token = authHeader.split(" ")[1]; 
        if (!token) {
            return res.status(403).json({ message: "Token missing" , success: false});
        }
        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; 
        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: "Invalid token" , success: false});
        }
        const id = decoded.id;
        try {
            const userDetails = await client.user.findUnique({ 
                where: { id },                  
            });
            if (userDetails) {
                req.user = userDetails;
                next();
            } else {
                return res.status(404).json({ message: "User not found", success: false });
            }
        } catch (error) {
            console.error("Error during fetching user details", error);
            return res.status(500).json({ message: "Internal Server Error" ,success: false});
        }
    } catch (err) {
        console.error("Error during token verification:", err);
        return res.status(403).json({ message: "Invalid token or token verification failed",success: false });
    }
}

export { authMiddleware };
