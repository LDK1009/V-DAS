import { CardInfoType } from "@/types/card";

// 데이터를 14개씩 나누는 함수
export const chunkArray = (array: CardInfoType[], size: number) => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size)
  );
};
