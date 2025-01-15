import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import Link from "next/link";

export default async function Edit(props) {
  try {
    let id = (await props.params).id;
    const db = (await connectDB).db("forum");
    const result = await db.collection("post").findOne({ _id: new ObjectId(id) });

    if (!result) {
      return (
        <div>
          <h4>잘못된 접근입니다.</h4>
          <Link href="/list">목록으로 돌아가기</Link>
        </div>
      );
    }

    return (
      <div>
        <h4>수정페이지</h4>
        <form action="/api/post/edit" method="POST">
          <input style={{ display: "none" }} name="id" defaultValue={id}></input>
          <input type="text" name="title" defaultValue={result.title}></input>
          <input type="text" name="content" defaultValue={result.content}></input>
          <input type="submit" value="수정하기"></input>
        </form>
      </div>
    );
  } catch (e) {
    return (
      <div>
        <h4>잘못된 접근입니다.</h4>
        <Link href="/list">목록으로 돌아가기</Link>
      </div>
    );
  }
}
