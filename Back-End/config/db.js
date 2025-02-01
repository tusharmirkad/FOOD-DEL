import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://tusharmirkad:9322872204@cluster0.o59d3.mongodb.net/food-del').then(() => console.log("DB Connected")).catch((err) => console.log(err)) ;
}