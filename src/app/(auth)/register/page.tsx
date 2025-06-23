import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OAuthSignIn } from "@/features/auth/components/oauth-signin";
import { RegisterForm } from "@/features/auth/components/register-form";
import Link from "next/link";

export default function Register() {
  return (
    <div className=" h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] flex items-center justify-center">
      <Card className="max-w-lg w-full text-center md:text-left">
        <CardHeader>
          <CardTitle className="text-2xl mb-2">新規登録</CardTitle>
          <CardDescription>下記から登録方法を選択してください</CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthSignIn />
          <div className="text-center my-3">or</div>
          <RegisterForm />
        </CardContent>
        <CardFooter>
          <Link
            href="login"
            className="hover:underline ml-auto text-sm underline-offset-4"
          >
            登録済みの方はこちら
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
