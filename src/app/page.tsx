"use client";
import LeaguesLogo from "@/assets/icons/leagues-logo.svg";
import LeaguesTitle from "@/assets/icons/leagues-title.svg";
import { Card } from "@/components/Card";
import { cards as defaultCards } from "@/utils/variables";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ArchiveZone } from "@/components/ArchiveZone";

export default function Home() {
  const [cards, setCards] = useState(defaultCards);
  const [archivedCards, setArchivedCards] = useState<typeof defaultCards>([]);

  const moveCard = (dragIndex: number, hoverIndex: number, isArchived: boolean) => {
    if (isArchived) {
      const dragCard = archivedCards[dragIndex];
      const newCards = [...archivedCards];
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, dragCard);
      setArchivedCards(newCards);
    } else {
      const dragCard = cards[dragIndex];
      const newCards = [...cards];
      newCards.splice(dragIndex, 1);
      newCards.splice(hoverIndex, 0, dragCard);
      setCards(newCards);
    }
  };

  const handleArchive = (cardId: number) => {
    const cardToArchive = cards.find((card) => card.id === cardId);
    if (cardToArchive) {
      setCards(cards.filter((card) => card.id !== cardId));
      setArchivedCards([...archivedCards, cardToArchive]);
    }
  };

  const handleUnarchive = (cardId: number) => {
    const cardToUnarchive = archivedCards.find((card) => card.id === cardId);
    if (cardToUnarchive) {
      setArchivedCards(archivedCards.filter((card) => card.id !== cardId));
      setCards([...cards, cardToUnarchive]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#2D2D2D] flex justify-center items-center">
        <div className="flex flex-col gap-[40px] pt-[50px] pb-[50px] w-[700px]">
          <div className="flex items-center justify-between">
            <div className="flex gap-[12px]">
              <LeaguesLogo />
              <LeaguesTitle />
            </div>
            <button className="p-[11px] bg-[rgba(0,0,0,0.1)] text-[rgba(229,229,221,1)] rounded-[10px]">
              + Connect League
            </button>
          </div>

          <div className="flex flex-col gap-[12px]">
            {cards.length === 0 && (
              <ArchiveZone onArchive={handleUnarchive} isArchiveZone={false} />
            )}
            {cards.map((card, index) => (
              <Card
                key={card.id}
                id={card.id}
                index={index}
                name={card.name}
                image={card.image}
                status={card.status}
                moveCard={(dragIndex, hoverIndex) => moveCard(dragIndex, hoverIndex, false)}
                onArchive={handleArchive}
                isArchived={false}
              />
            ))}
          </div>

          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-neutral-400"
              >
                <path
                  d="M15.8337 8.33333L10.0003 14.1667L4.16699 8.33333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2 className="text-neutral-400 font-medium">Archived</h2>
            </div>
            <ArchiveZone onArchive={handleArchive} isArchiveZone={true} />
            {archivedCards.map((card, index) => (
              <Card
                key={card.id}
                id={card.id}
                index={index}
                name={card.name}
                image={card.image}
                status={card.status}
                moveCard={(dragIndex, hoverIndex) => moveCard(dragIndex, hoverIndex, true)}
                onArchive={handleUnarchive}
                isArchived={true}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
