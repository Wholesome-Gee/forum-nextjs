'use client';

import { signIn } from "next-auth/react";

export default function LogInBtn() {
  return <button onClick={() => { signIn() }}>로그인</button>
  // signIn(), signOut() 으로 간단하게 로그인,로그아웃 구현 가능
} 