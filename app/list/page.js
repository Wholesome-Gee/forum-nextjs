import { connectDB } from "@/util/database"
import Link from "next/link";
import HomeLink from "./HomeLink";

export default async function List() {
  const cluster = await connectDB
  const db = cluster.db('forum');
  let result = await db.collection('post').find().toArray();

  // console.log(result);

  return (
    <div className="list-bg">
        {
          result.map((item,index)=>{
            return (
              <div className="list-item">
                <Link prefetch={true} href={`/detail/${item._id}`}>
                  <h4>{item.title}</h4>
                </Link>
                <p>{item.content}</p>
              </div>
            )
          })
        }
        <HomeLink/>
    </div>
  )
} 