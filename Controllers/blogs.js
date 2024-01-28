const { Blog } = require("../Schema/blogSchema")

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).exec()
        return res.status(200).json({ success: true, data: blogs })
    } catch (err) {
        return res.status(400).json({ success: true, error: err })
    }
}

const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.find({ slug: req.params.slug }).exec()
        return res.status(200).json({ success: true, data: blog })
    } catch (err) {
        return res.status(400).json({ success: true, error: err })
    }
}

const createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        return res.status(200).json({ success: true, data: blog })
    } catch (err) {
        return res.status(400).json({ success: true, error: err })
    }
}

const updateBlog = async (req, res) => {
    try{
        const blog = await Blog.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true }).exec()
        return res.status(200).json({ success: true, data: blog })
    } catch (err) {
        return res.status(400).json({ success: true, error: err })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ slug: req.params.slug }).exec()
        return res.status(200).json({ success: true, data: blog })
    } catch (err) {
        return res.status(400).json({ success: true, error: err })
    }
}

module.exports = { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog }