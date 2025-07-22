"use client";

import React, { useState } from "react";
import Header from "./_container/Header";
import { Button, Stack, styled, TextField, Typography } from "@mui/material";
import { mixinFlex, mixinMuiTextInputBorder } from "@/styles/mixins";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";

const AdminContainer = () => {
  const router = useRouter();

  const LoginInfo = {
    id: "admin",
    pw: "1234",
  };

  const [isLogin, setIsLogin] = useState(false);
  const [inputId, setInputId] = useState("");
  const [inputPw, setInputPw] = useState("");

  const handleLogin = () => {
    if (inputId === "" || inputPw === "") {
      enqueueSnackbar("아이디와 패스워드를 입력해주세요.", { variant: "error" });
      return;
    }

    if (inputId === LoginInfo.id && inputPw === LoginInfo.pw) {
      enqueueSnackbar("로그인 성공", { variant: "success" });
      setIsLogin(true);
    } else {
      enqueueSnackbar("아이디 또는 패스워드가 일치하지 않습니다.", { variant: "error" });
    }
  };

  return (
    <Container>
      <Header />
      {isLogin ? (
        <BodyArea>
          <StyledButton variant="contained" color="primary" onClick={() => router.push("/admin/manage")}>
            배정 관리하기
          </StyledButton>
          <StyledButton variant="contained" color="primary" onClick={() => router.push("/admin/assign")}>
            배정하기
          </StyledButton>
        </BodyArea>
      ) : (
        <LoginContainer>
          <LoginBox>
            <CategoryWrapper>
              <CategoryText>아이디</CategoryText>
              <StyledInput label="" value={inputId} onChange={(e) => setInputId(e.target.value)} />
            </CategoryWrapper>
            <CategoryWrapper>
              <CategoryText>패스워드</CategoryText>
              <StyledInput type="password" label="" value={inputPw} onChange={(e) => setInputPw(e.target.value)} />
            </CategoryWrapper>
            <Button variant="contained" color="primary" onClick={handleLogin}>
              로그인
            </Button>
          </LoginBox>
        </LoginContainer>
      )}
    </Container>
  );
};

export default AdminContainer;

const Container = styled(Stack)`
  width: 100vw;
  height: 100vh;
`;

const BodyArea = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  column-gap: 100px;
  width: 100%;
  height: 100%;
`;

const StyledButton = styled(Button)`
  width: 350px;
  height: 200px;
  font-size: 40px;
  border-radius: 10px;
`;

const LoginContainer = styled(BodyArea)`
  column-gap: 0px;
`;

const LoginBox = styled(Stack)`
  ${mixinFlex("column", "space-between", "center")}
  width: 500px;
  height: 370px;
  padding: 40px 120px;
  border: 1px solid black;
`;

const CategoryWrapper = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  row-gap: 8px;
  width: 100%;
`;

const CategoryText = styled(Typography)`
  width: 100%;
  font-size: 20px;
  text-align: left;
`;

const StyledInput = styled(TextField)`
  width: 100%;
  ${({ theme }) => mixinMuiTextInputBorder(theme)}
`;
