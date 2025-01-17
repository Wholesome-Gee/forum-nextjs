"use client";

import Link from "next/link";

export default function ListItem(props) {
  let result = props.result;
  return (
    <div>
      {result.map((item, index) => (
        <div className="list-item" key={item._id}>
          <Link href={"/detail/" + item._id}>
            <h4>{item.title}</h4>
          </Link>
          <p>{item.content}</p>
          <Link href={"/edit/" + item._id}> ✏️ </Link>
          <span
            onClick={() => {
              fetch("/api/post/delete", { method: "DELETE", body: item._id })
                .then((response) => {
                  if (response.status == 200) {
                    return response.json();
                  } else {
                    // 서버가 에러코드 전송 시 실행할 코드
                  }
                })
                .then((response) => {
                  console.log(response);
                  // fetch 요청 성공 시 실행할 코드
                })
                .catch((error) => {
                  //인터넷 문제 등으로 실패 시 실행할 코드
                  console.log(error);
                });
            }}
          >
            🗑️
          </span>
        </div>
      ))}
    </div>
  );
}
