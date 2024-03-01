const mongoose =require("mongoose") ;
const {DB_NAME} = require("../constants")

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    // console.log(connectionInstance);
    console.log(
      `\nMongoDB connected !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDb connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
