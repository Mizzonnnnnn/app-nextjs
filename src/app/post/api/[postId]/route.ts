import Post from "@/app/config/models/Post";
import connectDB from "@/app/config/mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { params: { postId: string } }) {
    await connectDB();
    try {
        const id = params.params.postId;
        const result = await Post.findById(id)

        if (!result) {
            return NextResponse.json({
                EC: -1,
                EM: "The post does not exist",
                data: null,
            }, { status: 404, statusText: "Not Found" });
        }

        return NextResponse.json({
            EC: 0,
            EM: "The post is fetched successfully",
            data: result
        }, { status: 200 });

    } catch (error) {
        // log ra lỗi
        console.log("Error Get:", error);

        // Return a failure response
        return NextResponse.json({
            EC: -1,
            EM: "Failed to fetch the post",
            data: null
        }, { status: 400, statusText: "Falied" });
    }
}

export async function PUT(req: NextRequest, params: { params: { postId: string } }) {
    await connectDB();
    try {
        const { title, description } = await req.json();
        const id = params.params.postId;
        const result = await Post.findById(id)

        if (!result) {
            return NextResponse.json({
                EC: 1,
                EM: "The put does not exist",
                data: null,
            }, { status: 404, statusText: "Not Found" });
        }

        const existedTitle = await Post.findOne({ title, _id: { $ne: id } })

        if (!existedTitle) {
            const update = await Post.findByIdAndUpdate(id, { title, description }, { new: true });
            return NextResponse.json({
                EC: 0,
                EM: "Post updated successfully",
                data: update
            }, { status: 201 });

        } else {
            return NextResponse.json({
                EC: 1,
                EM: "A post with this title already exists",
                data: null
            }, { status: 201, statusText: "Conflict" });
        }

    } catch (error) {
        // log ra lỗi
        console.log("Error Put:", error);

        // Return a failure response
        return NextResponse.json({
            EC: -1,
            EM: "Failed to update the post",
            data: null
        }, { status: 500, statusText: "Internal Server Error" });
    }
}

export async function DELETE(req: NextRequest, params: { params: { postId: string } }) {
    await connectDB();

    try {
        const id = params.params.postId;
        const result = await Post.findById(id)

        if (!result) {
            return NextResponse.json({
                EC: -1,
                EM: "The delete does not exist",
                data: null,
            }, { status: 404, statusText: "Not Found" });
        }

        const deletePost = await Post.findByIdAndDelete(id);

        return NextResponse.json({
            EC: 1,
            EM: "Post delete successfully",
            data: deletePost
        }, { status: 200 });

    } catch (error) {
        // log ra lỗi
        console.log("Error DELETE:", error);

        // Return a failure response
        return NextResponse.json({
            EC: -1,
            EM: "Failed to delete the post",
            data: null
        }, { status: 500, statusText: "Internal Server Error" });
    }
}