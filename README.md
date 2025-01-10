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
      🔹 <a href="http://mongodb.com">mongodb.com</a>  
      🔹 Github ID로 로그인   
      🔹 왼쪽 `Database Access` 탭에서 DB접속용 계정 생성 (Built-in Role은 Atlas admin 선택)  
      🔹 왼쪽 `Network Access` 탭에서 0.0.0.0/0 (Allow access from anywhere) 생성  

## 02. Next.js에서 MongoDB 사용하기


npm i mongodb

## 03. 글목록 조회기능 만들기 (DB 데이터 출력)
## 04. 상세페이지 만들기 1 (Dynamic route)
## 05. 상세페이지 만들기 2 (useRouter)
## 06. 글 작성기능 만들기 1 (서버기능 개발은)
## 07. 글 작성기능 만들기 2
## 08. 수정기능 만들기 1
## 09. 수정기능 만들기 2
## 10. 삭제기능 만들기 1 (Ajax)
## 11. 삭제기능 만들기 2 (Ajax 추가내용과 에러처리)
## 12. 삭제기능 만들기 3 (query string / URL parameter)
## 13. static rendering, dynamic rendering, cache
## 14. JWT, session, OAuth 설명시간
## 15. 회원기능 만들기 : Auth.js 사용한 소셜로그인
## 16. 회원기능 만들기 : OAuth + session방식 사용하기
## 17. 회원기능 만들기 : 아이디/비번 + JWT 사용하기
## 18. 회원기능 만들기 : JWT 사용시 refresh token 사용하려면
## 19. 댓글기능 만들기 1 (input 데이터 다루기)
## 20. 댓글기능 만들기 2 (useEffect)
## 21. 댓글기능 만들기 3
## 22. loading.js, error.js, not-found.js
## 23. AWS Elastic Beanstalk에 Next.js서버 배포
## 24. 이미지 업로드 기능 1 (AWS S3 셋팅)
## 25. 이미지 업로드 기능 2 (Presigned URL)
## 26. Dark mode 기능 1 (cookies / localStorage)
## 27. Dark mode 기능 2
## 28. 서버기능 중간에 간섭하려면 Middleware
## 29. Next.js의 Server actions 기능