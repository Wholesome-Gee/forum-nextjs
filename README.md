# 코딩애플_Next.JS_Part2.게시판
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
      🔹 왼쪽 `Database Access` 탭에서 DB접속용 계정 생성 (Built-in Role은 Atlas admin 선택)  const User = mongoose.model('User', userSchema);
      🔹 왼쪽 `Network Access` 탭에서 0.0.0.0/0 (Allow access from anywhere) 생성  

## 02. Next.js에서 MongoDB 사용하기
- DB에 데이터 저장하기
  - http://mongodb.com ➡️ **Browse collections** 데이터 조회 가능
  - Cluters(책방) > DB(책꽂이) > Collections(책) > Documents(종이)
- Next.js에서 MongoDB의 database 불러오기
  - `npm i mongodb`
  - /util/database.js 생성 ➡️ mongodb와 connection이 1회만 이루어짐 (서버 open 시)
    ```js
    import { MongoClient } from 'mongodb'
    const password = encodeURIComponent('wlfyd15643#') 
    // encodeURIComponent는 특수문자를 UTF-8로 인코딩 해준다.
    const url = `mongodb+srv://jiyong0419:${password}@wholesome-gee.ccwio.mongodb.net/?retryWrites=true&w=majority&appName=Wholesome-Gee`
    // MongoDB > Cluster > Connect > Drivers
    const options = { useNewUrlParser: true }
    // urlParser는 url의 구조를 분석해준다.
    // 프로토콜 ( https, http, ftp 등)
    // 호스트 ( www.naver.com )
    // 포트번호 ( 5500 )
    // 경로 (route)
    // 쿼리스트링 ( ?, & )
    // 프래그먼트 ( # )
    let connectDB

    if (process.env.NODE_ENV === 'development') {
      // node환경이 개발모드이면 다음과 같이 실행하라.
      if (!global._mongo) {
        global._mongo = new MongoClient(url, options).connect()
      }
      // global._mongo가 비어있으면 global._mongo를 나의 mongoDB cluster와 연결
      connectDB = global._mongo
    } else {
      connectDB = new MongoClient(url, options).connect()
    } // node환경이 개발모드가 아니면(상품모드면) connectDB에 나의 mongoDB cluster를 연결
    export { connectDB }
    ```
- page.js 수정
  ```js
  import { connectDB } from "@/util/database.js"
  // @는 프로젝트의 경로를 가리킴.
  // NextJS에서 .js 파일을 import할때 확장자명은 생략 가능 ( png, jpg, css, json은 불가능 )

  export default async function Home() {
    //  let client = await connectDB;
    //  const db = client.db('forum');
    let db = (await connectDB).db('forum');
    // db에 접근할 경우 await을 사용하여 해당 지점에서 로드를 끝마치고 다음 명령어를 실행한다고 알림.
    // await을 사용할 경우 해당 함수명 앞엔 비동기 함수임을 알리는 async를 표기해야함
    let result = await db.collection('post').find().toArray();
    // db.collection.find()는 collection내의 조건을 만족하는 document들을 커서로 가리킴.
    // db 데이터 관련 코드는 server Component에서만 사용할 것.
    
    console.log(result);

    return (
      <div></div>
    )
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
  import { connectDB } from "@/util/database"
  import { ObjectId } from "mongodb";

  export default async function Detail(props){
    const cluster = await connectDB;
    const db = cluster.db('forum');
    const result = await db.collection('post').findOne({
      _id : new ObjectId((await props.params).id)
    })
    
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
    )
  }
  ```

<br/>

## 05. 상세페이지 만들기 2 (useRouter)
- 게시글 목록 페이지(/list)에서 게시글 상세페이지(/detail/[id])로 이동하는 페이지 생성
- 게시글 목록 페이지(/list)에서 홈 화면으로 돌아가는 버튼 생성
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
                <div className="list-item">
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
  'use client'
  
  import { useRouter } from "next/navigation"
  /*  1. React의 use~~~함수를 사용할 것이기에 client Component로 생성
      2. next/navigation에서 useRouter를 import함.  */

  export default function DetailLink() {
    let router = useRouter();
    /*  1. usePathname() = 현재 URL출력
        2. useSearchParams() = 현재 URL의 쿼리스트링 출력 
        3. useParams() = [dynamic route]에 입력한 내용 출력력*/
        
    return (
      <button onClick={()=>{ router.push('/') }}>홈으로</button>
      /*  1. router.push('경로') = 경로로 이동시킴
          2. router.back() = 이전 페이지로 이동시킴
          3. router.forward() = 앞 페이지로 이동시킴
          4. router.refresh() = 수정된 html 요소만 새로고침
          5. router.prefetch('경로') = 경로 페이지 미리 로드 (Link태그의 prefetch속성이 ture인것과 같음.) */
    )
  }

  ```

<br/>

## 06. 글 작성기능 만들기 1 (서버기능 개발은)

<br/>

## 07. 글 작성기능 만들기 2

<br/>

## 08. 수정기능 만들기 1

<br/>

## 09. 수정기능 만들기 2

<br/>

## 10. 삭제기능 만들기 1 (Ajax)

<br/>

## 11. 삭제기능 만들기 2 (Ajax 추가내용과 에러처리)

<br/>

## 12. 삭제기능 만들기 3 (query string / URL parameter)

<br/>

## 13. static rendering, dynamic rendering, cache

<br/>

## 14. JWT, session, OAuth 설명시간

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
