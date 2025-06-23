import { BbsAccordion } from "@/features/bbs/components/bbs-accordion";
import { MessageList } from "./message-list";
import { fetchSelectBbs } from "@/lib/bbs/bbs-data-fetcher";
import { MessagePostForm } from "@/features/bbs/components/message-post-form";

type BbsMainContentProps = {
  bbsId: string;
};

export async function BbsMainContent({ bbsId }: BbsMainContentProps) {
  const board = await fetchSelectBbs(bbsId);

  if (!board) {
    return (
      <div className="mt-4 text-lg sm:text-2xl font-semibold text-center">
        掲示板が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 gap-2 justify-center items-center">
      <div className="text-center sm:text-left bg-white rounded-md px-2 w-full shadow-md">
        <BbsAccordion board={board} />
      </div>
      <div className="flex-1 bg-white mb-[55px] max-h-[calc(100vh-202px)] sm:max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-225px)] w-full overflow-y-auto shadow-md rounded-md p-2">
        {board.messages && board.messages.length > 0 ? (
          <div className="flex flex-col gap-2 sm:gap-4">
            {board.messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-2 border-spacing-2 rounded-md shadow-md p-2 text-xs sm:text-sm ${
                  message.author.id === board.creator.id
                    ? "bg-yellow-50"
                    : "bg-accent"
                }`}
              >
                <MessageList message={message} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs sm:text-sm">
            この投稿に対するコメントがまだありません
          </p>
        )}
      </div>
      <div className="w-full fixed bottom-0 left-1/2 -translate-x-1/2 z-10 mb-2">
        <div className="sm:max-w-[38rem] md:max-w-[42rem] lg:max-w-[56rem] mx-auto px-2">
          <MessagePostForm boardId={bbsId} />
        </div>
      </div>
    </div>
  );
}
