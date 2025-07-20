import { useCardFormat } from "@/hooks/export/card/useCardFormat";
import AssignCard from "./AssignCard";
import { Stack, styled } from "@mui/material";

const ExportCard = () => {
  const { getAllChurchCardData } = useCardFormat();
  const churchCardDatas = getAllChurchCardData();

  return (
    <Container>
      {churchCardDatas.map((churchCardData, index) => (
        <AssignCard key={index} {...churchCardData} />
      ))}
    </Container>
  );
};

export default ExportCard;

const Container = styled(Stack)`
  position: absolute;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  position: fixed;
  /* top: 0px; */
  /* right: -100%; */
  top:0px;
  right: 0px;
`;
