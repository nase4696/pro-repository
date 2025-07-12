Object.assign(process.env, {
  NEXT_PUBLIC_IS_SERVER: "true",
  NEXTAUTH_SECRET: "dummy-secret-for-testing",
  NEXTAUTH_URL: "http://localhost:3000",
});
