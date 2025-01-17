import { connectDB } from "@/util/database";
import HomeLink from "./HomeLink";
import ListItem from "./ListItem";

export default async function List() {
  const cluster = await connectDB;
  const db = cluster.db("forum");
  let result = await db.collection("post").find().toArray();

  result = result.map((item) => {
    item._id = item._id.toString();
    return item;
  });

  return (
    <div className="list-bg">
      <ListItem result={result} />
      <HomeLink />
    </div>
  );
}
