export default function Write() {
  return (
    <div className="p-20">
      <h4>글 작성</h4>
      <form action="/api/post/new" method="POST">
        <input type="text" name="title" placeholder="제목을 입력하세요."></input>
        <input type="text" name="content" placeholder="내용을 입력하세요."></input>
        <button type="submit">작성완료</button>
      </form>
    </div>
  );
}
