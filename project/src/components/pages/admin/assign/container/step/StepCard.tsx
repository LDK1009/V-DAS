import { mixinFlex } from "@/styles/mixins";
import { CheckCircleOutlineRounded } from "@mui/icons-material";
import { Box, Button, Stack, styled, Typography } from "@mui/material";
import React, { useState } from "react";

type StepCardPropsType = {
  stepNumber: number;
  cardText: string;
  label: string;
  buttonIcon: React.ReactNode;
  onClick: () => void;
};

const StepCard = ({ stepNumber, cardText, label, onClick, buttonIcon }: StepCardPropsType) => {
  const [isClicked, setIsClicked] = useState(false);

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        {isClicked ? (
          <CheckCircle />
        ) : (
          <StepNumberCircle>
            <StepNumberText>{stepNumber}</StepNumberText>
          </StepNumberCircle>
        )}
        <CardText>{cardText}</CardText>
      </Header>
      {/* 버튼 */}
      <StyledButton
        onClick={() => {
          onClick();
          setIsClicked(true);
        }}
        startIcon={buttonIcon}
      >
        {label}
      </StyledButton>
    </Container>
  );
};

export default StepCard;

const Container = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  row-gap: 8px;
  width: 200px;
  height: 100px;
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  padding: 16px;
`;

const Header = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  column-gap: 4px;
`;

const StepNumberCircle = styled(Box)`
  ${mixinFlex("row", "center", "center")}
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.text.white};
`;

const StepNumberText = styled(Typography)`
  width: 24px;
  height: 24px;
  text-align: center;
`;

const CardText = styled(Typography)`
  font-size: 14px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.text.white};
  border-radius: 8px;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.dark};
  }
`;

const CheckCircle = styled(CheckCircleOutlineRounded)`
  color: ${({ theme }) => theme.palette.primary.main};
`;
