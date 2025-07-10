import FloorView from "./FloorView";
import { Stack, styled } from "@mui/system";
import { mixinFlex } from "@/styles/mixins";
import Line from "./Line";

const EditDormitory = () => {
  return (
    <Container>
      <Line lineIndex={0} />
      <FloorView />
    </Container>
  );
};

export default EditDormitory;

const Container = styled(Stack)`
  width: 100%;
  height: 100%;
  ${mixinFlex("column", "center", "center")}
  padding: 0px 12px 12px 12px;
`;
