import { fetchBoards } from "@/lib/bbs/bbs-data-fetcher";
import { getServerSession } from "@/lib/session";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { Icons } from "../icons";
import Link from "next/link";
import { DeleteDialog } from "@/features/bbs/components/delete-dialog";

export async function EditorBbsList() {
  const session = await getServerSession();

  const userId = session?.user?.id;

  const { data: posts } = await fetchBoards({ userId });

  return (
    <div className="space-y-2 mb-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex gap-1 sm:gap-2 flex-col sm:flex-row items-center bg-yellow-50 p-1 sm:p-2 rounded-md shadow-md"
        >
          <div className="flex-1 flex justify-between items-center w-full bg-white rounded-md px-1 py-2 sm:p-2 font-semibold border-2 text-xs sm:text-base">
            <p className="flex-1">{post.title}</p>
            <div className="sm:hidden">
              <Menubar className="hover:cursor-pointer">
                <MenubarMenu>
                  <MenubarTrigger className="text-xs">
                    <Icons.mobileMenu className="h-4 w-4" />
                  </MenubarTrigger>
                  <MenubarContent className="flex sm:hidden w-full flex-col items-center justify-center">
                    <MenubarItem className="hover:bg-accent w-full h-10">
                      <Link
                        href={`/bbs/editor/${post.id}`}
                        className="w-full flex items-center justify-center"
                      >
                        編集
                      </Link>
                    </MenubarItem>
                    <MenubarItem className="w-full h-10 p-0">
                      <DeleteDialog type="bbs" targetId={post.id} />
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Link
              href={`/bbs/editor/${post.id}`}
              className="flex w-full items-center text-sm sm:text-base justify-center border-2 bg-white rounded-md p-2 hover:bg-accent"
            >
              <Icons.edit className="sm:h-5 sm:w-5 pr-1" />
              編集
            </Link>
            <DeleteDialog type="bbs" targetId={post.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
