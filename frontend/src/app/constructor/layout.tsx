import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "3D Конструктор гриндеров | ГриндерМастер",
  description: "Соберите свой идеальный гриндер онлайн с помощью нашего 3D конструктора. Выберите компоненты, рассчитайте стоимость и оформите заказ.",
};

export default function ConstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Гарантируем что children всегда определен
  const safeChildren = children ?? null;
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      {safeChildren}
    </div>
  );
}
