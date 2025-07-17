import { useCardFormat } from "@/hooks/export/card/useCardFormat";
import AssignCard from "./AssignCard";

const ExportCard = () => {
  const { getChurchCardData } = useCardFormat();

  return (
    <div>
      <AssignCard {...getChurchCardData("중부명성교회")} />
      <h1>남자</h1>
      <pre>{JSON.stringify(getChurchCardData("중부명성교회").maleCardInfo, null, 2)}</pre>
      <h1>여자</h1>
      <pre>{JSON.stringify(getChurchCardData("중부명성교회").femaleCardInfo, null, 2)}</pre>
    </div>
  );
};

export default ExportCard;
