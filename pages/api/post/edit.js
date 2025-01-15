import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const changedData = {
      _id: new ObjectId(req.body.id),
      title: req.body.title,
      content: req.body.content,
    };

    const db = (await connectDB).db("forum");
    await db.collection("post").updateOne({ _id: new ObjectId(req.body.id) }, { $set: changedData });
    return res.redirect("/list");
  }
  return res.status(400).json("GET 요청은 처리할 수 없습니다.");
}
