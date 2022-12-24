import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import jwt from "jsonwebtoken";
import { env } from "../config/config";

declare global {
  function signin(): string[];
}

let mongo: any;
beforeAll(async () => {
  env.JWT_KEY = "asdf";
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  // Build a jwt paylod. {id, email}
  const paylod = {
    id: "63a740e04bc7dcc01741",
    email: "gu3456@gmail.com",
  };

  // Create the jwt!
  const token = jwt.sign(paylod, env.JWT_KEY!);

  // Build session object
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JOSN and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string  thats the cookie with the encoded data
  return [`session=${token}`];
};
