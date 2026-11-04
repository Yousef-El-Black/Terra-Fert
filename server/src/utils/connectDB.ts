import mongoose from "mongoose";

export const connectDB = async (
  uri: string | null,
): Promise<typeof mongoose> => {
  try {
    if (uri) {
      const connection = await mongoose.connect(uri);
      console.log("Connected to Database");
      return connection;
    } else {
      console.error("Failed to connect to Database: NO URI TO CONNECT DB");
      const error = new Error("We can not find the Database URI");
      throw error;
    }
  } catch (error) {
    console.error("Failed to connect to Database:", error);
    throw error;
  }
};
