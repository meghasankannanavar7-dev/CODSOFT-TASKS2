require("dotenv").config();
const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI);

async function test() {
  try {
    await client.connect();
    console.log("✅ MONGODB CONNECTED SUCCESSFULLY");
    await client.db().command({ ping: 1 });
    console.log("✅ PING SUCCESSFUL");
  } catch (error) {
    console.log("❌ CONNECTION FAILED");
    console.log(error);
  } finally {
    await client.close();
  }
}

test();