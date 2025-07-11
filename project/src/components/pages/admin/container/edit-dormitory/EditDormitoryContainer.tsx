import { Stack, styled } from "@mui/system";
import { mixinFlex } from "@/styles/mixins";
import LineColumn from "./LineColumn";
import LineColumn4 from "./LineColumn4";
import Footer from "../etc/Footer";

const EditDormitory = () => {
  return (
    <Container>
      <LineColumnContainer>
        <LineColumn lineIndexs={[0, 1]} />
        <LineColumn lineIndexs={[2, 3]} />
        <LineColumn4 />
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
  height: 100%;
`;

const LineColumnContainer = styled(Stack)`
  ${mixinFlex("row", "center", "start")}
  width: 100%;
  height: 100%;
  column-gap: 12px;
`;
