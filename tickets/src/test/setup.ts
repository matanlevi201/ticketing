import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

jest.mock("../queue-wrapper");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "asds";
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // MOCK: session cookie
  // build a JWT payload. { id, email }
  const id = new mongoose.Types.ObjectId().toHexString();
  const payload = { id, email: "test@test.com" };
  // create a JWT.
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  // build a session object. {jwt: <my_jwt>}
  const session = { jwt: token };
  // turn into a JSON.
  const sessionJson = JSON.stringify(session);
  // take json and encode it as base64.
  const base64 = Buffer.from(sessionJson).toString("base64");
  // return a string thats the cookie with encoded data.
  return [`session=${base64}`];
};
