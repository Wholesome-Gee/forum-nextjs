# 코딩애플\_Next.JS_Part2.게시판

## 01. 새로운 프로젝트 생성 / MongoDB 셋팅

- 프로젝트 생성하기
  - `npx create-next-app@latest 폴더명`
- MongoDB
  - MongoDB는 비관계형 데이터베이스
    - 관계형 DB는 데이터를 엑셀처럼 표에 저장하며,  
      SQL언어 사용, 스키마 정의, 정규화 등 사용이 복잡하여  
      주로 안정적인 데이터저장과 운영이 필요한 곳에서 사용
    - 비관계형 DB는 형식이 자유롭고  
      SQL언어 사용, 스키마 정의, 정규화 등이 필요없다.  
      분산처리를 기본적으로 잘해서 SNS서비스 처럼 많은 데이터 입출력이 필요할 때 강점을 보임
    - MongoDB는 비관계형 DB이며,  
      collection(비유=폴더)을 만들고 내부에 document(비유=파일)을 만들어서 데이터를 기록하고 저장함
      - ` { 데이터이름1: 값1, 데이터이름2: 값2 ...}
    - 설치방법  
      🔹 http://mongodb.com  
      🔹 Github ID로 로그인  
      🔹 왼쪽 `Database Access` 탭에서 DB접속용 계정 생성 (Built-in Role은 Atlas admin 선택) const User = mongoose.model('User', userSchema);
      🔹 왼쪽 `Network Access` 탭에서 0.0.0.0/0 (Allow access from anywhere) 생성

## 02. Next.js에서 MongoDB 사용하기

- DB에 데이터 저장하기
  - http://mongodb.com ➡️ **Browse collections** 데이터 조회 가능
  - Cluters(책방) > DB(책꽂이) > Collections(책) > Documents(종이)
- Next.js에서 MongoDB의 database 불러오기

  - `npm i mongodb`
  - /util/database.js 생성 ➡️ mongodb와 connection이 1회만 이루어짐 (서버 open 시)

    ```js
    import { MongoClient } from "mongodb";
    const password = encodeURIComponent("wlfyd15643#");
    // encodeURIComponent는 특수문자를 UTF-8로 인코딩 해준다.
    const url = `mongodb+srv://jiyong0419:${password}@wholesome-gee.ccwio.mongodb.net/?retryWrites=true&w=majority&appName=Wholesome-Gee`;
    // MongoDB > Cluster > Connect > Drivers
    const options = { useNewUrlParser: true };
    // urlParser는 url의 구조를 분석해준다.
    // 프로토콜 ( https, http, ftp 등)
    // 호스트 ( www.naver.com )
    // 포트번호 ( 5500 )
    // 경로 (route)
    // 쿼리스트링 ( ?, & )
    // 프래그먼트 ( # )
    let connectDB;

    if (process.env.NODE_ENV === "development") {
      // node환경이 개발모드이면 다음과 같이 실행하라.
      if (!global._mongo) {
        global._mongo = new MongoClient(url, options).connect();
      }
      // global._mongo가 비어있으면 global._mongo를 나의 mongoDB cluster와 연결
      connectDB = global._mongo;
    } else {
      connectDB = new MongoClient(url, options).connect();
    } // node환경이 개발모드가 아니면(상품모드면) connectDB에 나의 mongoDB cluster를 연결
    export { connectDB };
    ```

- page.js 수정

  ```js
  import { connectDB } from "@/util/database.js";
  // @는 프로젝트의 경로를 가리킴.
  // NextJS에서 .js 파일을 import할때 확장자명은 생략 가능 ( png, jpg, css, json은 불가능 )

  export default async function Home() {
    //  let client = await connectDB;
    //  const db = client.db('forum');
    let db = (await connectDB).db("forum");
    // db에 접근할 경우 await을 사용하여 해당 지점에서 로드를 끝마치고 다음 명령어를 실행한다고 알림.
    // await을 사용할 경우 해당 함수명 앞엔 비동기 함수임을 알리는 async를 표기해야함
    let result = await db.collection("post").find().toArray();
    // db.collection.find()는 collection내의 조건을 만족하는 document들을 커서로 가리킴.
    // db 데이터 관련 코드는 server Component에서만 사용할 것.

    console.log(result);

    return <div></div>;
  }
  ```

  <br/>

## 03. 게시글 목록 조회기능 만들기 (DB 데이터 출력)

- (시작전) 프로그램 만드는 순서
  - 프로그램에 필요한 기능을 전부 정리
  - 쉬운 기능부터 하나씩 개발
    - 기능의 로직을 한글로 설명하고 그것을 코드로 번역하는 연습
- 목록 페이지 생성 ( /list/page.js )

  ```javascript
  import { connectDB } from "@/util/database"

  export default async function List() {
    const cluster = await connectDB
    const db = cluster.db('forum');
    let result = await db.collection('post').find().toArray();

    console.log(result);

    return (
    <div className="list-bg">
      {
        result.map((item,index)=>{
          return (
            <div className="list-item">
                <h4>{item.title}</h4>
                <p>{item.content}</p>
            </div>
        <!-- db에서 받아온 result 배열을 순회하는 반복문 실행 -->
          )
        })
       }
      </div>
    )
  }
  ```

<br/>

## 04. 상세페이지 만들기 1 (Dynamic route)

- 게시글의 상세페이지로 이동하는 페이지 생성
- 상세 페이지 생성 ( /detail/[id]/page.js )

  - [id]는 nextJS의 dynamic route 사용
  - http://localhost:3000/detail/tomato ➡️ tomato 부분이 id가 됨됨

  ```javascript
  import { connectDB } from "@/util/database";
  import { ObjectId } from "mongodb";

  export default async function Detail(props) {
    const cluster = await connectDB;
    const db = cluster.db("forum");
    const result = await db.collection("post").findOne({
      _id: new ObjectId((await props.params).id),
    });

    /*  1. props는 부모 component로부터 받은 data가 담겨있다.
      2. (await props.porams).id로 유저가 요청한 parameter의 id부분을 가져올 수 있다. 
      3. props > params > id를 꺼내 쓰려면 props.params가 먼저 비동기 처리가 되어야 한다.
      3. findOne({조건})은 조건에 부합한 data를 찾아서 object로 반환
      4. new ObjectId는 mongodb에서 ObjectId를 import해야 사용가능  */

    console.log(await props.params);

    return (
      <div>
        <h4>상세 페이지</h4>
        <h4>{result.title}</h4>
        <p>{result.content}</p>
      </div>
    );
  }
  ```

<br/>

## 05. 상세페이지 만들기 2 (useRouter)

- 게시글 목록 페이지( /list )에서 게시글 상세페이지(/detail/[id])로 이동하는 페이지 생성
- 게시글 목록 페이지( /list )에서 홈 화면으로 돌아가는 버튼 생성
- /list/page.js 수정

  ```javascript
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
                <div className="list-item" key={index}>
                  <Link href={`/detail/${item._id}`}>
                    <h4>{item.title}</h4>
                  </Link>
                  <p>{item.content}</p>
                </div>
              )
            })
          }
          <HomeLink />
           <!-- HomeLink Component 생성 후 호출 -->
      </div>
    )
  }
  ```

- /list/HomeLink.js 파일 생성

  - 홈 화면으로 이동시켜주는 component
    - client Component의 파일명은 camelCase로 작성

  ```javascript
  "use client";

  import { useRouter } from "next/navigation";
  /*  1. React의 use~~~함수를 사용할 것이기에 client Component로 생성
      2. next/navigation에서 useRouter를 import함.  */

  export default function DetailLink() {
    let router = useRouter();
    /*  1. usePathname() = 현재 URL출력
        2. useSearchParams() = 현재 URL의 쿼리스트링 출력 
        3. useParams() = [dynamic route]에 입력한 내용 출력력*/

    return (
      <button
        onClick={() => {
          router.push("/");
        }}
      >
        홈으로
      </button>
      /*  1. router.push('경로') = 경로로 이동시킴
          2. router.back() = 이전 페이지로 이동시킴
          3. router.forward() = 앞 페이지로 이동시킴
          4. router.refresh() = 수정된 html 요소만 새로고침
          5. router.prefetch('경로') = 경로 페이지 미리 로드 (Link태그의 prefetch속성이 ture인것과 같음.) */
    );
  }
  ```

<br/>

## 06. 글 작성기능 만들기 1 (서버기능 개발은)

- Next JS에서 Server 만들기 ( pages/api/post/new.js)
  - Server는 `pages/api/Server이름`으로 만든다.
  - Server에 만들어놓는 기능들을 API라고 한다.
  ```javascript
  export default function handler(req, res) {
    // server는 req 와 res를 parameter로 받는다.
    if (req.method == "GET") {
      console.log("GET요청을 보낼 수 없습니다.");
      return res.status(400);
    }
    console.log("POST요청을 보냈습니다.");
    return res.status(200).json("POST 처리성공");
  }
  /* status code 
    1. 200 = 처리 성공
    2. 400 = 처리 실패 (유저측 원인)
    3. 500 = 처리 실패 (서버측 원인)  */
  ```
- 글 작성 페이지 만들기 ( /write/page.js )
  ```javascript
  export default function Write() {
    return (
      <div>
        <h4>글 작성</h4>
        <form action='/api/post/new' method="POST">
        <!-- action = 요청을 보낼 경로 , method = GET / POST 요청방식 -->
        <!-- form 태그로 GET,POST는 가능하지만 PUT(수정),DELETE(삭제)는 불가능하다.  -->
          <button type="submit">버튼</button>
        </form>
      </div>
    )
  }
  ```
  <br/>

## 07. 글 작성기능 만들기 2

- server와 db를 연결하고 유저가 server에게 전송한 게시글 정보를 받아서 db에 등록하기
- 게시글 작성 페이지 만들기 ( /write/page.js )
  ```javascript
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
  ```
- 게시글 작성 페이지 css 추가 ( /globals.css )

  ```css
  .p-20 {
    padding: 20px;
  }
  input {
    box-sizing: border-box;
    padding: 10px;
    display: block;
    margin-bottom: 10px;
  }
  button {
    padding: 10px 15px;
    background: lightgray;
    border: none;
    border-radius: 5px;
  }
  ```

  - write server 만들기 ( pages/api/post/new.js )

  ```javascript
  import { connectDB } from "@/util/database";

  export default async function handler(req, res) {
    // server는 req 와 res를 parameter로 받는다.
    if (req.method == "GET") {
      // GET 요청 예외처리
      console.log("GET요청을 보낼 수 없습니다.");
      return res.status(400).json("GET 처리실패");
    }

    try {
      const cluster = await connectDB;
      const db = cluster.db("forum");
      await db.collection("post").insertOne(req.body);
      // db.collection().insertOne(obj)는 db에 obj를 데이터로 추가한다.
      // req.body는 요청받은 정보의 객체

      if (req.body.title == "") {
        // 제목을 입력하지 않았을 경우 예외처리
        return res.status(400).json("제목을 입력하세요.");
      }
      return res.redirect("/list");
      // res.redirect('경로')는 유저를 경로로 보낸다.
    } catch (error) {
      res.status(500).json(`Server Error: ${error.name}: ${error.message}`);
    }
    // try catch 문을 활용하여 예상치 못한 error상황에 대비.
  }

  /*
  status code 
  200은 처리 완료, 
  400은 처리 실패(유저측 문제), 
  500은 처리 실패(서버측 문제)
  */
  ```

  <br/>

## 08~09. 수정기능 만들기

- 글 목록 페이지에서 게시글 수정 버튼 만들어주기 ( /list/page.js )

  ```javascript
  import { connectDB } from "@/util/database";
  import Link from "next/link";
  import HomeLink from "./HomeLink";

  export default async function List() {
    const cluster = await connectDB;
    const db = cluster.db("forum");
    let result = await db.collection("post").find().toArray();

    console.log(result);

    return (
      <div className="list-bg">
        {result.map((item, index) => {
          return (
            <div className="list-item" key={index}>
              <Link prefetch={true} href={`/detail/${item._id}`}>
                <h4>{item.title}</h4>
              </Link>
              <p>{item.content}</p>
              <Link href={`/edit/${item._id}`}>✏️</Link>
               <!-- ⬆️ Link 태그 추가 -->
            </div>
          );
        })}
        <HomeLink />
      </div>
    );
  }
  ```

- 글 수정페이지 dynamic route로 만들기 ( /edit/[id]/page.js )

  ```javascript
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
  ```

- 글 수정 요청을 받아줄 server 만들기 ( pages/api/post/edit.js )

  ```javascript
  import { connectDB } from "@/util/database";
  import { ObjectId } from "mongodb";

  export default async function handler(req, res) {
    if (req.method == "POST") {
      const changedData = {
        _id: new ObjectId(req.body.id),
        title: req.body.title,
        content: req.body.content,
      };
      // db안에 있는 data의 schema 만들어주기

      const db = (await connectDB).db("forum");
      await db.collection("post").updateOne({ _id: new ObjectId(req.body.id) }, { $set: changedData });
      // db.collection().updateOne({ filter }, { $set: update data}) = db내에서 조건과 일치하는 data를 수정해준다
      // $set 은 덮어쓰기 옵션, $inc 는 +1 증가시키는 옵션이다.
      return res.redirect("/list");
    }
    return res.status(400).json("GET 요청은 처리할 수 없습니다.");
  }
  ```

<br/>

## 10~12. 삭제기능 만들기 1,2,3

- 글 목록 페이지(/list)에서 🗑️를 클릭하면 게시글이 애니메이션으로 사라지는 기능
- CSS로 애니메이션 동작 전 스타일링 하기 (/globals.css)

  ```css
  .list-item {
    opacity: 1;
    transition: all 1s;
  }
  ```

- 애니메이션을 쓰기위해 client component 생성 (/list/ListItem.js)

  ```javascript
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
            onClick={(event) => {
              <!-- onCleck함수의 parameter인 event는 event가 발생한 지점에 대한 정보를 담고있다. -->
              fetch("/api/post/delete", { method: "DELETE", body: item._id })
              <!-- fetch('url', { method: "GET,POST,DELETE,PUSH", body:"props"}) -->
              <!-- fetch('url', { method: "GET,POST,DELETE,PUSH", body:JSON.stringify(obj/arr)}) -->
                .then((response) => {
                  if (response.status == 200) {
                    return response.json();
                    <!-- response는 Response객체이며 .json()을 통해 json형식으로 변환한다. -->
                  } else {
                  <!-- 서버가 에러코드 전송 시 실행할 코드 -->
                  }
                })
                .then((response) => {
                  console.log(response);
                  <!-- fetch 요청 성공 시 실행할 코드 -->
                  event.target.parentElement.style.opacity = 0
                  setTimeout(()=>{
                    event.target.parentElement.style.display = "none"
                  },1000)
                })
                .catch((error) => {
                  <!-- 인터넷 문제 등으로 실패 시 실행할 코드 -->
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
  ```

- 글 목록 페이지 수정 (/list/page.js)

  ```javascript
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
    // db에서 받아온 result의 ._id의 값은 문자열처럼 보이지만 ("16진수24자리")
    // new ObjectId를 통한 BSON (BinaryJSON) 객체이기 때문에
    // .toString()을 통하여 문자열로 변환해주어야 props로 전달 가능

    return (
      <div className="list-bg">
        <ListItem result={result} />
        <HomeLink />
      </div>
    );
  }
  ```

- 글 삭제 요청을 받아줄 server 만들기 ( pages/api/post/delete.js )

  ```javascript
  import { connectDB } from "@/util/database";
  import { ObjectId } from "mongodb";

  export default async function handler(req, res) {
    if (req.method == "DELETE") {
      // method에 대한 예외처리
      try {
        // try catch로 db삭제 중 발생할 서버측 에러에 대한 예외처리
        const cluster = await connectDB;
        const db = cluster.db("forum");
        await db.collection("post").deleteOne({ _id: new ObjectId(req.body) });
        // db.collection.deleteOne({filter})는 조건에 맞는 document를 collection에서 삭제해준다
      } catch (error) {
        return res.status(500).json("서버 오류: " + error);
      }
      return res.status(200).json("삭제 완료");
    }
    return res.status(400).json("잘못된 요청입니다.");
  }
  ```

- useEffect()를 활용하여 db를 받아올 수도 있지만, 검색엔진 노출 측면에서 단점이 있다.

  - useEffect() 활용 코드 예시

  ```javascript
  'use client'
  export default function ListItem(){
    useEffect(()=>{
      let result = (서버에 요청해서 DB데이터 가져오는 코드)
    },[])

    return (
      <div>{result}</div>
    )
  }
  ```

  - useEffect()는 페이지 로드 순서가 html보다 후순위 이다.  
     즉, html이 다 로드되고나서야 useEffect()가 읽히기때문에  
     검색엔진 봇들이 정보수집을 못하여 검색노출에 불리하다.
    <br/>

- GET요청으로 server에 data 전송하기 (GET으로는 body옵션 사용 불가)
  - Query String 방식
    - `fetch('http://localhost:3000?name:"지용"&age:20')`
    - server에서는 req.query를 통해 data 수신 가능 ( { name:"지용", age:20})
  - URL parameter 사용하기 ( pages/api/[name]/page.js)
  - `fetch(api/post/wholesome-gee)`
    ```javascript
    export default function handler(req,res){
      console.log(req.query)
      // { name:"wholesome-gee"}
      return res.status.
    }
    ```

## 13. static rendering, dynamic rendering, cache

- 기능구현 이후 성능향상을 위한 작업 ( 렌더링, 캐싱 )
- static / dynamic rendering
  - `npm run build`를 하면 터미널에서 프로젝트 파일명(Route) 앞에 '○' 와'f' 기호가 있다.
    - React문법으로 이루어진 project를 브라우저가 이해할 수 있도록 html,css,js 문법으로 바꾸어 html 페이지로 변환하는 과정
  - '○'기호는 static rendering
    - 유저가 페이지 요청을 하면 `npm run build`때 만들어 놓은 html 페이지를 그대로 보여줌
    - 전송 속도가 빠르다는 장점이 있음.
  - 'f'기호는 dynamic rendering
    - 유저가 페이지 요청을 하면 `npm run build`떄 만들어 놓은 html 페이지를 새로 만들어서 보내줌
    - data 동기화가 가능하다는 장점이 있음. ( 유저가 많으면 server / db에 과부하가 올수 있음. )
    - `fetch('url',{cache:'no-store'})`, `useSearchParams()`, `cookies()`,  
      `headers()`, `[dynamic route]` 사용 시 자동으로 dynamic rendering이 된다.
  - static / dynamic rendering 강제로 전환하기 - dynamic 예약어를 사용
    - 파일 상단에 `export const dynamic = 'force-dynamic' ( or force-static )`
- Cache (캐싱)
  - dynamic rendering의 단점인 server/db 과부하를 방지하기 위한 방법
  - html 완성본 or GET요청 결과물을 저장소에 저장해두고 요청이 들어올 시 저장해 둔 완성본을 재사용
  - 캐싱은 서버자원을 절약할 수 있고, 캐싱된 데이터는 하드용량을 차지하지만,  
    하드는 저렴하고 크니까 크게 중요하진 않다.
  - `await fetch('/url', {cache: 'force-cache'})` (기본 설정값)
  - `await fetch('/url', {cache: 'no-store'})` (캐싱 안함 = 실시간 데이터가 중요할때 사용)
  - `await fetch('/url', {next: {revalidate: 60 }})` (60초 마다 캐싱 요청)
  - 페이지 전체를 캐싱하기 - revalidate 예약어를 사용
  - 파일 상단에 `export const revalidate = 60`
    - 페이지 전체가 60초마다 html을 새로 그리고 저장소에 html을 저장함

<br/>

## 14. JWT, session, OAuth 설명시간

- JWT(Javascript Web Token), Session
- 유저가 사이트에 로그인 시 Server로부터 요청권을 받게 되는데 요청권 형식에 따라 JWT 혹은 Session이라고 한다.
- 요청권은 브라우저 Cookie저장소에 문자열로 저장되고, 유저가 Server측에 무언가 요청할 시  
  자동으로 Cookie 저장소도 같이 전달이 됨.
- Session
  - Session은 요청권에 _Session ID_ 만 적혀있다.
  - 유저가 Server에 무언가 요청 시 Server는 유저로부터 유저정보와 Session ID를 받고,  
    전달받은 유저정보, Session ID를 DB에 재전달한다.  
    DB는 전달받은 유저정보와 Session ID 서로 일치하는지 확인 후 응답을 해준다.
  - Session방식은 보안에 강점이 있지만, DB에 부담이 크다는 단점이 있음.
- JWT (Javascript Web Token)
  - JWT는 요청권에 유저에 대한 정보가 hashing되어 있고 (조작방지),
    유저가 Server에 무언가 요청 시 Server는 요청권의 정보를 확인 후 응답해줌.
  - JWT방식은 DB에 부담이 적지만, 보안이 취약함.
- OAuth
  - 다른 사이트에 등록된 유저의 정보를 가져올 수 있는 권한
  ```js
  Gihub에서 Google로그인 시
  - Github은 유저에게 Google로그인을 요청
  - 유저는 Google에 로그인하고 Github에게 정보 공유를 허용
  - Google은 Github에게 유저정보를 공유
  ```
  <br/>

## 15. 회원기능 만들기 : Auth.js 사용한 소셜로그인

<br/>

## 16. 회원기능 만들기 : OAuth + session방식 사용하기

<br/>

## 17. 회원기능 만들기 : 아이디/비번 + JWT 사용하기

<br/>

## 18. 회원기능 만들기 : JWT 사용시 refresh token 사용하려면

<br/>

## 19. 댓글기능 만들기 1 (input 데이터 다루기)

<br/>

## 20. 댓글기능 만들기 2 (useEffect)

<br/>

## 21. 댓글기능 만들기 3

<br/>

## 22. loading.js, error.js, not-found.js

<br/>

## 23. AWS Elastic Beanstalk에 Next.js서버 배포

<br/>

## 24. 이미지 업로드 기능 1 (AWS S3 셋팅)

<br/>

## 25. 이미지 업로드 기능 2 (Presigned URL)

<br/>

## 26. Dark mode 기능 1 (cookies / localStorage)

<br/>

## 27. Dark mode 기능 2

<br/>

## 28. 서버기능 중간에 간섭하려면 Middleware

<br/>

## 29. Next.js의 Server actions 기능

<br/>
