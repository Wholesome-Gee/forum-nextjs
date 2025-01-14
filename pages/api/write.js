export default function handler(req, res) {
  if (req.method == "GET") {
    console.log('GET요청을 보낼 수 없습니다.');
    return res.status(400).json('GET 처리실패')
  } 
  console.log('POST요청을 보냈습니다.');
  return res.status(200).json("POST 처리성공")
}

// status code = 200은 처리 완료, 400은 처리 실패(유저측 문제), 500은 처리 실패(서버측 문제)