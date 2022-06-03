import { connect } from "mongoose";
import "colors";

// import URI from .env
const URI: string | undefined = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    // await connect(URI, {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
    //   useUnifiedTopology: true,
    // });

    await connect(
      "mongodb+srv://horlakz:hisart@pheivezcluster.67osj.mongodb.net/?retryWrites=true&w=majority"
    );

    console.log(`Database connected successfully`.cyan.bold);
  } catch (err: any) {
    console.log(err.message.red);
    process.exit(1);
  }
};

export default connectDB;
