import connectDB from "@/app/config/mongoose"

(async () => {
    await connectDB();
})