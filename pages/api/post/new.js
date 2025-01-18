import { connectDB } from "@/util/database";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";


export default async function handler(req, res) {
  let session = await getServerSession(req,res,authOptions)
  if (req.method == "GET") {
    console.log('GET요청을 보낼 수 없습니다.');
    return res.status(400).json("GET 처리실패")
  } 
  if (!session) {
    return res.status(400).json("session is null")
  }
  req.body.author = session.user.email
  try {
    const cluster = await connectDB
    const db = cluster.db('forum');
    await db.collection('post').insertOne(req.body)
    
    if (req.body.title == '') {
      return res.status(400).json("제목을 입력하세요.")
    }
    return res.redirect('/list')
  } catch (error) {
    res.status(500).json(`Server Error: ${error.name}: ${error.message}`)
  }
}

/*
status code 
200은 처리 완료, 
400은 처리 실패(유저측 문제), 
500은 처리 실패(서버측 문제)
*/

