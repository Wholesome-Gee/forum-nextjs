export default function Join() {
  return (
    <div>
      <h4>회원가입</h4>
      <form action='/api/join' method="POST">
        <input type="email" name="email" placeholder="이메일을 입력하세요." required></input>
        <input type="password" name="password" placeholder="비밀번호를 입력하세요." required></input>
        <button type="submit">회원가입</button>
      </form>
    </div>
  )
}