import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoadingButton } from "./loading-button";

const meta: Meta<typeof LoadingButton> = {
  title: "components/ui/button/loading-button",
  component: LoadingButton,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof LoadingButton>;

export const Default: Story = {
  args: {
    // isLoading: true,
    children: "保存",
  },
};

export const GrayLoading: Story = {
  args: {
    isLoading: true,
    spinnerVariant: "gray",
  },
};
