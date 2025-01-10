import { connectDB } from "@/util/database";
import { MongoClient } from "mongodb";

export default async function Home() {
  // const client = await connectDB;
  const db = (await connectDB).db('forum');
  let result = await db.collection('post').find().toArray();
  return (
    <div>ㅎㅇㅇ</div>
  );
}
