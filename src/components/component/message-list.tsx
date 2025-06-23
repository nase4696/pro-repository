import { Icons } from "../icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { DeleteDialog } from "@/features/bbs/components/delete-dialog";
import { getServerSession } from "@/lib/session";

type MessageListProps = {
  message: {
    id: string;
    createdAt: Date;
    content: string;
    author: {
      id: string;
      image: string | null;
      name: string | null;
    };
  };
};

export async function MessageList({ message }: MessageListProps) {
  const session = await getServerSession();

  const isOwner = session?.user?.id === message.author.id;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="cursor-context-menu">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              {message.author.image ? (
                <div className="h-5 w-5">{message.author.image}</div>
              ) : (
                <Icons.defaultUserIcon className="h-5 w-5" />
              )}
              <p>{message.author.name}</p>
            </div>
            <div>
              <p>{message.createdAt.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm">{message.content}</p>
        </div>
      </ContextMenuTrigger>
      {isOwner && (
        <ContextMenuContent>
          <ContextMenuItem>
            <DeleteDialog type="message" targetId={message.id} />
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
}
