import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method == "DELETE") {
    try {
      const cluster = await connectDB;
      const db = cluster.db("forum");
      await db.collection("post").deleteOne({ _id: new ObjectId(req.body) });
    } catch (error) {
      return res.status(500).json("서버 오류: " + error);
    }
    return res.status(200).json("삭제 완료");
  }
  return res.status(400).json("잘못된 요청입니다.");
}
