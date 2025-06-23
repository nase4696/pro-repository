import { Meta, StoryObj } from "@storybook/react";
import { within, expect } from "@storybook/test";
import { SignInForm } from "./signin-form";
import { mockUser } from "@/mocks/user-mock";

jest.mock("@/lib/user/user-data-fetcher", () => ({
  fetchUserData: jest.fn().mockResolvedValue(mockUser),
}));

const meta: Meta<typeof SignInForm> = {
  title: "features/auth/components/signin-form",
  component: SignInForm,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof SignInForm>;

export const Default: Story = {
  args: {
    userData: mockUser,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByLabelText("メールアドレス")).toBeVisible();
    await expect(canvas.getByLabelText("パスワード")).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "ログイン" })
    ).toBeVisible();
  },
};
