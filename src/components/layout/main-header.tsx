import { getServerSession } from "@/lib/session";
import React from "react";
import { Icons } from "../icons";
import { SignOutButton } from "../ui/sign-out-button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { mobileNavConfig } from "@/config/navigation";
import Link from "next/link";
import { VisuallyHidden } from "radix-ui";

export async function MainHeader() {
  const session = await getServerSession();

  return (
    <header>
      <div className=" bg-gray-300 w-full p-2 flex justify-between">
        <div className="text-2xl md:text-4xl text-gray-800">Next BBS</div>
        <div className="hidden sm:flex gap-3 items-center">
          {session?.user?.image ? (
            <div>{session?.user?.image}</div>
          ) : (
            <div>
              {<Icons.defaultUserIcon className="h-6 w-6 md:h-8 md:w-8" />}
            </div>
          )}
          <p className="text-xl">{session?.user?.name}さん</p>
          <div>
            <SignOutButton />
          </div>
        </div>
        <div className="flex sm:hidden">
          <Drawer>
            <DrawerTrigger>
              <Icons.menuIcon className="h-8 w-8" />
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>
                <VisuallyHidden.Root>モバイルメニュー</VisuallyHidden.Root>
              </DrawerTitle>
              <DrawerDescription className="sr-only">
                メニュー項目リスト
              </DrawerDescription>
              {mobileNavConfig.mobileNav.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="p-2 hover:bg-accent"
                >
                  {item.title}
                </Link>
              ))}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
