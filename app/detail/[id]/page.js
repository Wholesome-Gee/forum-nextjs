import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb";

export default async function Detail(props){
  const cluster = await connectDB;
  const db = cluster.db('forum');
  const result = await db.collection('post').findOne({
    _id : new ObjectId((await props.params).id)
  })

  console.log(await props.params);

  return (
    <div>
      <h4>상세 페이지</h4>
      <h4>{result.title}</h4>
      <p>{result.content}</p>
    </div>
  )
}