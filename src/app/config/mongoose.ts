import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGOOSE_URL}`)
        console.log("Connect DB is Success")
    } catch (error) {
        console.log("Connect DB is Falied: ", error);
    }
}

export default connectDB;