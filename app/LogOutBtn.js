'use client';

import { signOut } from "next-auth/react";

export default function LogOutBtn() {
  return <button onClick={() => { signOut() }}>로그아웃</button>
  // signIn(), signOut() 으로 간단하게 로그인,로그아웃 구현 가능
} 