import { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { SignInForm } from "./signin-form";
import { signInAction } from "@/mocks/registerUser.mock";

const meta: Meta<typeof SignInForm> = {
  title: "features/auth/components/signin-form",
  component: SignInForm,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

const playSubmit: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "ログイン" }));
};

const playFillEmail: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.type(
    canvas.getByLabelText("メールアドレス"),
    "test@example.com"
  );
};

const playFillPassword: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByLabelText("パスワード"), "password123");
};

const playFillAll: Story["play"] = async (args) => {
  await playFillEmail(args);
  await playFillPassword(args);
};

const playInvalidEmail: Story["play"] = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.type(canvas.getByLabelText("メールアドレス"), "invalidEmail");
};

export const Default: Story = {};

// export const Success: Story = {
//   beforeEach: () => {
//     // ダミーの動作を設定
//     signInAction.mockImplementation(async () => ({
//       status: "success",
//     }));
//   },
//   play: async (args) => {
//     await playFillAll(args);
//     await playSubmit(args);
//     await waitFor(() => {
//       expect(signInAction).toHaveBeenCalled();
//     });
//     await expect(within(args.canvasElement).queryByText("Error:")).toBeNull();
//   },
// };

export const EmptyValidation: Story = {
  play: async (args) => {
    await playSubmit(args);
    await waitFor(() => {
      expect(
        within(args.canvasElement).getByText("メールアドレスを入力して下さい")
      );
      expect(
        within(args.canvasElement).getByText("パスワードを入力して下さい")
      );
    });
  },
};

export const InvalidEmailValidation: Story = {
  play: async (args) => {
    await playInvalidEmail(args);
    await playSubmit(args);
    await waitFor(() => {
      expect(
        within(args.canvasElement).getByText("メールアドレスの形式が不正です")
      );
    });
  },
};
