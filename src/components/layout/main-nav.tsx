"use client";

import { NavItem } from "@/types/config";
import Link from "next/link";
import { usePathname } from "next/navigation.js";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";

type MainNavProps = {
  items: NavItem[];
  children?: React.ReactNode;
};

export default function MainNav({ items, children }: MainNavProps) {
  const path = usePathname();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between sm:items-center mx-auto mb-2 sm:mb-4">
      <div className="sm:hidden flex">
        <Menubar className="bg-gray-50 hover:cursor-pointer">
          <MenubarMenu>
            <MenubarTrigger className="text-xs p-2 rounded-md">
              メニュー
            </MenubarTrigger>
            <MenubarContent>
              {items.map((item, index) => (
                <Link key={index} href={item.href}>
                  <MenubarItem>{item.title}</MenubarItem>
                </Link>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <div className="underline text-xl text-center sm:text-left">
        {children}
      </div>
      <nav className="sm:flex hidden gap-2 font-semibold">
        {items?.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`hover:bg-gray-50 px-2 py-2 rounded-md ${
              path === item.href ? "bg-gray-50" : "bg-transparent"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}
