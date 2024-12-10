import zod from "zod";

const signupBody = zod.object({
    name: zod.string(),
    mobile: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
    institute: zod.string(),
    yearOfStudy: zod.number(),
    interests: zod.array(zod.string()), 
    isAdmin: zod.boolean(),
});

const signinBody = zod.object({
    email:zod.string(),
    password:zod.string()
})

const updateUserBody = zod.object({
    mobile: zod.string().optional(),
    password: zod.string().min(6).optional(),
    interests: zod.array(zod.string()).optional()
});

const projectBaseSchema = zod.object({
    projectName: zod
        .string()
        .min(1, "Project name is required")
        .max(50, "Project name must be 50 characters or fewer"),
    description: zod
        .string()
        .min(1, "Description is required")
        .max(700, "Description must be 700 characters or fewer"),
    tags: zod
        .array(zod.string())
        .optional(),
    capacity: zod
        .number()
        .int("Capacity must be an integer")
        .positive("Capacity must be greater than 0"),
    thumbnail: zod
        .string()
        .url("Thumbnail must be a valid URL"),
});

const createProjectSchema = projectBaseSchema;
const updateProjectSchema = projectBaseSchema.extend({
    slug: zod.string().optional(), 
});



export { signupBody,signinBody,updateUserBody,createProjectSchema,updateProjectSchema };
