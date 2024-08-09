import Post from "@/app/config/models/Post";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const { title, description } = await req.json();
        const exited = await Post.findOne({ title });

        if (!exited) {
            const newPost = await Post.create({ title, description });
            return NextResponse.json({
                EC: 0,
                EM: "Post Create succes",
                data: newPost
            }, { status: 201, statusText: "Created" });
        }

        if (exited) {
            return NextResponse.json({
                EC: 1,
                EM: "Post already exists",
                data: null
            }, { status: 200, statusText: "Conflict" });
        }
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({
            EC: -1,
            EM: "Failed to create post",
            data: null
        }, { status: 500, statusText: "Internal Server Error" });
    }
}

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const limit = req.nextUrl.searchParams.get("limit") ?? 2;
        const page = req.nextUrl.searchParams.get("page") ?? 1;
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / +limit);
        const skip = (+page - 1) * +limit;

        const result = await Post.find().skip(skip).limit(+limit);
        return NextResponse.json({
            EC: 0,
            data: result,
            pagination: {
                currentPage: +page,
                totalPage: totalPages,
                totalPosts: totalPosts
            }
        }, { status: 200 });
    } catch (error) {
        // log ra lỗi
        console.error("Error Get:", error);

        // Return a failure response
        return NextResponse.json({
            EC: -1,
            data: null
        }, { status: 400, statusText: "Falied" });
    }
}