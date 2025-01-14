// client component의 파일명은 camelCase로 작성한다.
'use client'

import { useRouter } from "next/navigation"

export default function DetailLink() {
  let router = useRouter();
  return (
    <button onClick={()=>{ router.push('/') }}>홈으로</button>
  )
}

// back() 뒤로가기 forward() 앞으로가기 refresh() (수정된 html 요소만)새로고침 prefetch() 페이지 미리로드

// usePathname() 현재 URL출력
// useSearchParams() 현재 URL의 쿼리스트링부분 출력
// useParams() [dynamic route]에 입력한 내용 출력
