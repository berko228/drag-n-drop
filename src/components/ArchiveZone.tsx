import { useDrop } from "react-dnd";
import type { DropTargetMonitor } from 'react-dnd';

interface DragItem {
  id: number;
  index: number;
  isArchived: boolean;
  type: string;
}

interface ArchiveZoneProps {
  onArchive: (cardId: number) => void;
  isArchiveZone: boolean;
}

export const ArchiveZone = ({ onArchive, isArchiveZone }: ArchiveZoneProps) => {
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    { archived: boolean } | undefined,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "CARD",
    canDrop: (item: DragItem) => item.isArchived !== isArchiveZone,
    drop: (item: DragItem, monitor) => {
      if (monitor.didDrop()) return undefined;
      onArchive(item.id);
      return { archived: isArchiveZone };
    },
    collect: (monitor: DropTargetMonitor<DragItem>) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop as any}
      className={`mt-4 border-2 border-dashed rounded-xl h-36 flex items-center justify-center transition-colors ${
        isActive
          ? "border-neutral-500 bg-neutral-800/50"
          : canDrop
          ? "border-neutral-700 bg-transparent"
          : "border-neutral-800 bg-transparent"
      }`}
    >
      {isActive ? (
        <p className="text-neutral-400">
          {isArchiveZone ? "Drop to archive" : "Drop to unarchive"}
        </p>
      ) : canDrop ? (
        <p className="text-neutral-600">
          {isArchiveZone ? "Drag here to archive" : "Drag here to unarchive"}
        </p>
      ) : null}
    </div>
  );
}; 