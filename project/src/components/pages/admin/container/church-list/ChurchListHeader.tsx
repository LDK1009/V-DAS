import { mixinFlex } from "@/styles/mixins";
import { Stack, styled } from "@mui/material";
import SearchBar from "./SearchBar";

const ChurchListHeader = () => {
  return (
    <Container>
      <SearchBar />
    </Container>
  );
};

export default ChurchListHeader;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 85px;
  padding: 8px 16px;
  border-bottom: 1px solid black;
`;
