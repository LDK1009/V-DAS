import { useDistribute } from "@/hooks/distribute/useDistribute";
import { useDistributeStore } from "@/store/distribute/distributeStore";
import { mixinFlex, mixinMuiButtonNoShadow, mixinMuiTextInputBorder } from "@/styles/mixins";
import { Button, Stack, styled, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const InputSection = () => {
  const { getDistributeData } = useDistribute();
  const { distributeData } = useDistributeStore();
  const [inputChurchName, setInputChurchName] = useState("");
  const router = useRouter();

  function checkAssign() {
    const churches = distributeData?.churchCards;
    const church = churches?.find((church) => church.churchName === inputChurchName);
    if (!church) {
      enqueueSnackbar("맞춤법과 띄어쓰기를 확인해주세요.", {
        variant: "info",
      });
      enqueueSnackbar("존재하지 않는 교회명입니다.", {
        variant: "error",
      });
      return;
    }
    router.push(`/card/${inputChurchName}`);
  }

  useEffect(() => {
    getDistributeData();
  }, [getDistributeData]);

  return (
    <Container>
      <CaregoryWrapper>
        <CategoryText>차수</CategoryText>
        <RoundText>{`${distributeData?.round}차`}</RoundText>
      </CaregoryWrapper>
      <CaregoryWrapper>
        <CategoryText>교회명</CategoryText>
        <ChurchNameInput value={inputChurchName} onChange={(e) => setInputChurchName(e.target.value)} />
      </CaregoryWrapper>
      <CheckAssignButton
        variant="contained"
        onClick={() => {
          checkAssign();
        }}
      >
        배정 확인하기
      </CheckAssignButton>
    </Container>
  );
};

export default InputSection;

const Container = styled(Stack)`
  ${mixinFlex("column", "start", "center")}
  row-gap: 16px;
  width: 100%;
  height: 260px;
  border: 1px solid black;
  padding: 24px;
`;

const CaregoryWrapper = styled(Stack)`
  ${mixinFlex("column", "start", "center")}
  row-gap: 4px;
  width: 100%;
`;

const CategoryText = styled(Typography)`
  width: 100%;
  font-size: 20px;
  text-align: left;
`;

const RoundText = styled(Typography)`
  width: 100%;
  font-size: 20px;
  text-align: left;
`;

const ChurchNameInput = styled(TextField)`
  width: 100%;
  height: 32px;

  & .MuiInputBase-root {
    height: 32px;
  }

  ${({ theme }) => mixinMuiTextInputBorder(theme)};
`;

const CheckAssignButton = styled(Button)`
  width: 100%;
  ${mixinMuiButtonNoShadow}
`;
