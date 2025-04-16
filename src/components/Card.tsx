import GamePhoto from "@/assets/images/game-1.png";
import Image, { StaticImageData } from "next/image";
import EspnLogo from "@/assets/icons/espn.svg";
import Calendar from "@/assets/icons/calendar.svg";
import { useDrag, useDrop } from "react-dnd";
import { useRef, useState } from "react";
import DragDots from "@/assets/icons/drag-dots.svg";

interface CardProps {
  id: number;
  index: number;
  name: string;
  image: StaticImageData;
  status: string;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  onArchive: (cardId: number) => void;
  isArchived: boolean;
}

interface DragItem {
  id: number;
  index: number;
  isArchived: boolean;
  type: string;
}

export const Card = ({
  id,
  index,
  name,
  image,
  status,
  moveCard,
  onArchive,
  isArchived,
}: CardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isIndicatorHovered, setIsIndicatorHovered] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: () => ({ id, index, isArchived, type: "CARD" }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ archived?: boolean }>();
      if (dropResult?.archived !== undefined) {
        onArchive(id);
      }
    },
  });

  const [, drop] = useDrop<DragItem, { archived?: boolean }, {}>({
    accept: "CARD",
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (item.isArchived !== isArchived) {
        onArchive(item.id);
        return;
      }

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    drop(item: DragItem, monitor) {
      if (!monitor.didDrop()) {
        if (item.isArchived !== isArchived) {
          onArchive(item.id);
          return { archived: !item.isArchived };
        }

        if (item.index !== index) {
          moveCard(item.index, index);
        }
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="relative group cursor-pointer">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-black text-white rounded-xl p-4 flex items justify-between shadow-lg w-full mx-auto border border-neutral-800 ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="flex items-center gap-10">
          <div className="w-20 h-20 relative rounded-lg overflow-hidden">
            <Image src={image} alt="League Avatar" fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-10">
              <h2 className="text-xl font-medium">{name}</h2>
              <div>
                <span
                  className={`font-medium px-4 py-1 rounded-md border ${
                    status === "Pre-Draft"
                      ? "bg-yellow-600/20 text-yellow-500 border-yellow-600/30"
                      : status === "Draft-Live"
                      ? "bg-green-600/20 text-green-500 border-green-600/30"
                      : "bg-gray-600/20 text-gray-500 border-gray-600/30"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-neutral-400">
              <EspnLogo />
              <span>ESPN</span>
              <Calendar />
              <span>2023</span>
            </div>
          </div>
        </div>
      </div>
      <div
        onMouseEnter={() => setIsIndicatorHovered(true)}
        onMouseLeave={() => setIsIndicatorHovered(false)}
        className={`absolute w-5 rounded-[24px] right-0 top-0 bottom-0 bg-neutral-600 transition-opacity duration-200 flex items-center justify-center ${
          isHovered || isDragging || isIndicatorHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <DragDots />
        {isIndicatorHovered && (
          <div className="absolute left-7 top-1/2 -translate-y-1/2 bg-neutral-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Drag to re-order or move to Archive
          </div>
        )}
      </div>
    </div>
  );
};
