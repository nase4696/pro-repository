import { signInAction } from "#actions";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

export function useSigninLogic() {
  const [state, formAction, pending] = useActionState(signInAction, undefined);
  const searchParams = useSearchParams();
  const from = searchParams?.get("redirect_to") || "/home";

  return {
    from,
    pending,
    state,
    formAction,
  };
}
