import Post from "@/app/config/models/Post";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        const { title, description } = await req.json();
        const exited = await Post.findOne({ title });
        if (!exited) {
            const newPost = await Post.create({ title, description })

            return NextResponse.json({
                EC: 0,
                data: newPost
            }, { status: 202, statusText: "Created" });

        } else {
            return NextResponse.json({
                EC: 1,
                message: "Post already exists"
            }, { status: 409, statusText: "Conflict" });
        }


    } catch (error) {
        // log ra lỗi
        console.error("Error creating post:", error);

        // Return a failure response
        return NextResponse.json({
            EC: -1,
            data: null
        }, { status: 400, statusText: "Falied" });
    }
}

export async function GET(req: NextRequest) {
    // await connectDB();
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
        }, { status: 200});
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