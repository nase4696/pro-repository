import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type BbsAccordionProps = {
  board: {
    title: string;
    content: string;
    creator: { name: string | null; id: string };
    messages: Array<{
      id: string;
      createdAt: Date;
      content: string;
      author: { id: string; image: string | null; name: string | null };
    }>;
  };
};

export function BbsAccordion({ board }: BbsAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="relative">
        <AccordionTrigger className="font-semibold text-xs sm:text-sm">
          {board.title}
        </AccordionTrigger>
        <AccordionContent className="text-foreground text-xs sm:text-sm space-y-2 p-2 rounded-md bg-white absolute top-14 left-0 right-0 shadow-lg z-10">
          <p>投稿者：{board.creator.name}</p>
          <p>{board.content}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
