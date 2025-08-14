import { fn } from "@storybook/test";
import * as actual from "../actions/registerUser";

// 実際の関数をモック化
export const signInAction = fn(actual.signInAction).mockName("signInAction");
export const registerAction = fn(actual.registerAction).mockName(
  "registerAction"
);
export const signOutAction = fn(actual.signOutAction).mockName("signOutAction");
