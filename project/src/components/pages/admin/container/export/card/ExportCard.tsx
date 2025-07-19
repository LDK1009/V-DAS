import { useCardFormat } from "@/hooks/export/card/useCardFormat";
import AssignCard from "./AssignCard";

const ExportCard = () => {
  const { getChurchCardData, getAllChurchCardData } = useCardFormat();

  const churchCardDatas = getAllChurchCardData();

  return (
    <div>
      {churchCardDatas.map((churchCardData, index) => (
        <AssignCard key={index} {...churchCardData} />
      ))}
      <h1>남자</h1>
      <pre>{JSON.stringify(getChurchCardData("중부명성교회").maleCardInfo, null, 2)}</pre>
      <h1>여자</h1>
      <pre>{JSON.stringify(getChurchCardData("중부명성교회").femaleCardInfo, null, 2)}</pre>
    </div>
  );
};

export default ExportCard;
