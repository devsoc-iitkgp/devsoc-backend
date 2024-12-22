import zod from "zod";

const signupBody = zod.object({
    name: zod
        .string()
        .min(1, "Name is required")
        .max(50, "Name must be 50 characters or fewer"),
    username: zod
        .string()
        .min(3, "Username must be at least 3 characters long")
        .max(30, "Username must be 30 characters or fewer"),
    mobile: zod
        .string()
        .regex(/^\d{10}$/, "Mobile must be a 10-digit number"), // Assuming mobile number is 10 digits
    email: zod
        .string()
        .email("Invalid email address")
        .max(100, "Email must be 100 characters or fewer"),
    password: zod
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password must be 50 characters or fewer"),
    institute: zod.enum(["IIT Kharagpur"], {
        errorMap: () => ({ message: "Institute must be IIT Kharagpur" }),
    }),
    yearOfStudy: zod
        .number()
        .min(1, "Year of study must be at least 1")
        .max(10, "Year of study must be 10 or fewer"), // Assuming a cap of 10 years
    interests: zod
        .array(zod.string().min(1, "Interest cannot be empty"))
        .max(20, "You can have a maximum of 20 interests"),
    isAdmin: zod.boolean(),
});

const signinBody = zod.object({
    email: zod
        .string()
        .email("Invalid email address")
        .max(100, "Email must be 100 characters or fewer"),
    password: zod
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password must be 50 characters or fewer"),
});

const updateUserBody = zod.object({
    mobile: zod
        .string()
        .regex(/^\d{10}$/, "Mobile must be a 10-digit number")
        .optional(),
    password: zod
        .string()
        .min(6, "Password must be at least 6 characters long")
        .max(50, "Password must be 50 characters or fewer")
        .optional(),
    interests: zod
        .array(zod.string().min(1, "Interest cannot be empty"))
        .max(20, "You can have a maximum of 20 interests")
        .optional(),
});

const projectSchema = zod.object({
    projectName: zod
        .string()
        .min(1, "Project name is required")
        .max(50, "Project name must be 50 characters or fewer"),
    slug: zod
        .string(),
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

const blogBaseSchema = zod.object({
    blogName: zod
        .string()
        .min(1, "Blog name is required")
        .max(50, "Blog name must be 50 characters or fewer"),
    slug: zod
        .string(),
    content: zod
        .string()
        .min(1, "Content is required")
        .max(5000, "Content must be 5000 characters or fewer"), // Optional limit for long content
    tagline: zod
        .string()
        .min(1, "Tagline is required")
        .max(150, "Tagline must be 150 characters or fewer"),
    author: zod
        .string()
        .min(1, "Author name is required")
        .max(50, "Author name must be 50 characters or fewer"),
    thumbnail: zod
        .string()
        .url("Thumbnail must be a valid URL"),
});

const createBlogSchema = blogBaseSchema;
const updateBlogSchema = blogBaseSchema;

export {
    signupBody,
    signinBody,
    updateUserBody,
    projectSchema,
    createBlogSchema,
    updateBlogSchema,
};
