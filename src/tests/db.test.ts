import { connect, ConnectOptions } from "mongoose";
import { it } from "vitest";
import "dotenv/config";

it("it should connect to database", async () => {
  const URI: string | undefined = process.env.MONGO_URI;

  await connect(`${URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  console.log("Database connected successfully");
});
