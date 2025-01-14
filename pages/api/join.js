import { connectDB } from "@/util/database"

export default async function handler (req,res) {
  // console.log(req.body);
  if(req.method ==  'POST') {
    if(req.body.email == ''){
      return res.status(400).json('email을 입력하세요.')
    } else if (req.body.password == ''){
      return res.status(400).json('password를 입력하세요.')
    }
    const db = (await connectDB).db('forum')
    let duplicateEmail = await db.collection('user').findOne({ email: req.body.email})
    if(!duplicateEmail) {
      await db.collection('user').insertOne(req.body)
      return res.status(200).json('회원가입이 완료되었습니다.')
    }
    return res.status(400).json('중복된 이메일 입니다.')
  }
  return res.status(400).json('GET 요청 실패')
}


