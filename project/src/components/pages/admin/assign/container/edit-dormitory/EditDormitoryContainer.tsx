import { Stack, styled } from "@mui/system";
import { mixinFlex } from "@/styles/mixins";
import LineColumn from "./LineColumn";
import LineColumn4 from "./LineColumn4";
import Footer from "../etc/Footer";
import ChangeFloorButtonGroup from "../etc/ChangeFloorButtonGroup";

const EditDormitory = () => {
  return (
    <Container>
      <LineColumnContainer>
        <LineColumn lineIndexs={[0, 1]} />
        <LineColumn lineIndexs={[2, 3]} />
        <LineColumn4 />
        <ChangeFloorButtonGroup />
      </LineColumnContainer>
      <Footer />
    </Container>
  );
};

export default EditDormitory;

const Container = styled(Stack)`
  width: 100%;
  height: 100%;
  ${mixinFlex("column", "center", "center")}
`;

const LineColumnContainer = styled(Stack)`
  ${mixinFlex("row", "center", "start")}
  position: relative;
  width: 100%;
  height: 100%;
  column-gap: 12px;
`;
