const { Blog } = require("../Schema/blogSchema")

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).exec()
        return res.status(200).json({ success: true, data: blogs })
    } catch (e) {
        return res.status(400).json({ success: true, message: e.message })
    }
}

export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.find({ slug: req.params.slug }).exec()
        return res.status(200).json({ success: true, data: blog })
    } catch (e) {
        return res.status(400).json({ success: true, message: e.message })
    }
}

export const createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        return res.status(200).json({ success: true, data: blog })
    } catch (e) {
        return res.status(400).json({ success: true, message: e.message })
    }
}

export const updateBlog = async (req, res) => {
    try{
        const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true }).exec()
        return res.status(200).json({ success: true, data: blog })
    } catch (e) {
        return res.status(400).json({ success: true, message: e.message })
    }
}

export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ slug: req.params.slug }).exec()
        return res.status(200).json({ success: true, data: blog })
    } catch (e) {
        return res.status(400).json({ success: true, message: e.message })
    }
}