import { mixinFlex } from "@/styles/mixins";
import { FolderSpecialRounded } from "@mui/icons-material";
import { Stack, styled, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

const Header = () => {
  const router = useRouter();

  return (
    <Container>
      <Text>VISIONCAMP 숙소배정기</Text>
      <ManageIcon
        onClick={() => {
          router.push("/admin/manage");
        }}
      />
    </Container>
  );
};

export default Header;

const Container = styled(Stack)`
  position: relative;
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 40px;
  background-color: #ffc300;
  color: ${({ theme }) => theme.palette.text.black};
`;

const Text = styled(Typography)`
  font-size: 16px;
  font-weight: 700;
`;

const ManageIcon = styled(FolderSpecialRounded)`
  position: absolute;
  right: 8px;
  color: white;
  cursor: pointer;
`;
