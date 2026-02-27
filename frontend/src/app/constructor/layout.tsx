import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Конструктор гриндеров | ГриндерМастер",
  description: "Соберите свой идеальный гриндер онлайн с помощью нашего 3D конструктора. Выберите компоненты, рассчитайте стоимость и оформите заказ.",
};

export default function ConstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
