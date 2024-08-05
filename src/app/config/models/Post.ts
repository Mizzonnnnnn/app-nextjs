import mongoose from 'mongoose';
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: String,
    description: String,
}, { timestamps: true })

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;