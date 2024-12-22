import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";
import { signupBody,signinBody, updateUserBody } from "../Validation/ZodValidation";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const client = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecretkey"; 
const signup = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseResult = signupBody.safeParse(body);
        if (!parseResult.success) {
            return res.status(400).json({ message: "Invalid Inputs", success:false});
        }
        const { name, username, mobile, email, password, institute, yearOfStudy, interests, isAdmin } = parseResult.data;
        if (!email.endsWith("@iitkgp.ac.in")) {
            return res.status(400).json({
                message: "Please enter Institute Email Address",
                success: false,
            });
        }
        const existingUser = await client.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" ,success:false});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await client.user.create({
            data: {
                name,
                username,
                mobile,
                email,
                password: hashedPassword,
                institute,
                yearOfStudy,
                interests,
                isAdmin,
            },
        });
        const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1h" }); 
        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, email: newUser.email },
            token,
            success:true
        });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Internal Server Error",success:false });
    }
};

 const signin = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const parseResult = signinBody.safeParse(body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Invalid Inputs",
                success:false
            });
        }
        const { email, password } = parseResult.data;
        if (!email.endsWith("@iitkgp.ac.in")) {
            return res.status(400).json({
                message: "Email must end with @iitkgp.ac.in",
                success: false,
            });
        }
        const user = await client.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials",success:false});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials",success:false });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        return res.status(200).json({
            message: "Signin successful",
            user: { id: user.id, email: user.email },
            token,
            success:true
        });
    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({ message: "Internal Server Error" ,success:false});
    }
};

const fetchUserDetails = async (req: Request, res: Response) => {
    const user = req.user; 
    if (!user) {
        return res.status(400).json({ message: "User data is not available", success: false });
    }
    try {
        return res.status(200).json({
             user ,
             success : true 
        });
    } catch (error) {
        console.error("Error during fetching user details", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};


const userUpdate = async (req: Request, res: Response) => {
    const userId=req.user.id;
    try {
        const body = req.body;
        const parseResult = updateUserBody.safeParse(body);
        if (!parseResult.success) {
            return res.status(400).json({
                message: "Invalid inputs",
                success:false
            });
        }
        if (parseResult.data.password) {
            // Hash the password using bcrypt
            const saltRounds = 10;
            parseResult.data.password = await bcrypt.hash(parseResult.data.password, saltRounds);
        }
        const updatedUser = await client.user.update({
            where: { id: userId },
            data: parseResult.data, 
        });
        return res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser,
            success : true
        });
    } catch (error) {
        console.error("Error during updating the user details:", error);
        return res.status(500).json({ message: "Internal Server Error",success:false });
    }
};

const getBookmarks = async (req: Request, res: Response) => {
    const userId = req.user.id; // Assuming the user ID is set in the request by a middleware
    try {
        const user = await client.user.findUnique({
            where: { id: userId },
            include: { bookmarks: true }, // Include the bookmarks in the response
        });
        return res.status(200).json({ success: true, data: user!.bookmarks });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const addBookmark = async (req: Request, res: Response) => {
    const userId = req.user.id; // Assuming the user ID is set in the request by a middleware
    const projectId = req.body.projectId;
    if (!projectId) {
        return res.status(400).json({ success: false, message: "Project ID is required" });
    }
    try {
        const updatedUser = await client.user.update({
            where: { id: userId },
            data: {
                bookmarks: {
                    connect: { id: projectId }, // Connect the project to the user's bookmarks
                },
            },
            include: { bookmarks: true }, // Include the updated bookmarks in the response
        });

        return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error adding bookmark:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const removeBookmark = async (req: Request, res: Response) => {
    const userId = req.user.id; // Assuming the user ID is set in the request by a middleware
    const projectId = req.body.projectId;
    if (!projectId) {
        return res.status(400).json({ success: false, message: "Project ID is required" });
    }
    try {
        const updatedUser = await client.user.update({
            where: { id: userId },
            data: {
                bookmarks: {
                    disconnect: { id: projectId }, // Connect the project to the user's bookmarks
                },
            },
            include: { bookmarks: true }, // Include the updated bookmarks in the response
        });

        return res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error adding bookmark:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const sendRequest = async(req:Request,res:Response)=>{
    try{
        const userId= req.user.id;
        const projectId = req.body.projectId;
        if(!projectId){
            return res.status(400).json({
                success : false,
                message:"Project not found"
            })
        }
        const projectRequested = await client.user.update({
            where : {id:userId},
            data: {
                requests: {
                    connect : {id : projectId},
                }
            },
            include : {requests:true}
        });
        return res.status(200).json({
            success : true,
            data:projectRequested
        })
    }catch(error){
        console.error("Error sending request:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}



export {signup,signin,fetchUserDetails,userUpdate,getBookmarks,addBookmark,removeBookmark,sendRequest};


