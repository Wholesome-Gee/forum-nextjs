import { connectDB } from "@/util/database.js";

export default async function Home() {
  let db = (await connectDB).db("forum");
  let result = await db.collection("post").find().toArray();

  // console.log(result);

  return <div>메인 페이지</div>;
}
