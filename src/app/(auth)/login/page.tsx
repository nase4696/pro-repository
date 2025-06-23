import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthSignIn } from "@/features/auth/components/oauth-signin";
import { SignInForm } from "@/features/auth/components/signin-form";
import Link from "next/link";

export default function Login() {
  return (
    <div className=" h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] flex items-center justify-center">
      <Card className="max-w-lg w-full text-center md:text-left">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">ログイン</CardTitle>
          <CardDescription>
            下記からログイン方法を選択してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthSignIn />
          <div className="text-center my-3">or</div>
          <SignInForm />
        </CardContent>
        <CardFooter>
          <Link
            href="register"
            className="hover:underline ml-auto text-sm underline-offset-4"
          >
            新規登録はこちら
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
