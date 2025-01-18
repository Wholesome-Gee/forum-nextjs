import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: 'Ov23li3Wa1OoSS7Gk5qq',
      clientSecret: '9b9869d5e441a6e67f513668278076ee3ca9e56a',
    }),
  ],
  secret : process.env.SECRET_CODE
};
export default NextAuth(authOptions); 