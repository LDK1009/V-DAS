import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { Modal, Stack, styled } from "@mui/material";
import React, { useState } from "react";

const ChangeFloorButtonGroup = () => {
  const { dormitoryData, currentFloor, setCurrentFloor, maxFloor } = useDormitoryStore();

  const floors = dormitoryData?.floors;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container>
      <div>
        {floors?.slice(0, maxFloor).map((el) => {
          return (
            <button key={el.floorNumber} onClick={() => setCurrentFloor(el.floorNumber)}>
              {el.floorNumber + 1}
            </button>
          );
        })}
      </div>
      <div>현재 층 : {currentFloor + 1}</div>
      <button onClick={() => setIsModalOpen(true)}>층 수정</button>
      <ChangeFloorModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </Container>
  );
};

export default ChangeFloorButtonGroup;
////////////////////////////////////////////////// 스타일 컴포넌트 //////////////////////////////////////////////////
const Container = styled(Stack)`
  ${mixinFlex("row", "center", "center")}
  width: 100%;
  height: 100%;
  column-gap: 16px;
`;

////////////////////////////////////////////////// 모달 컴포넌트 //////////////////////////////////////////////////

type ChangeFloorModalPropsType = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
};

const ChangeFloorModal = ({ isModalOpen, setIsModalOpen }: ChangeFloorModalPropsType) => {
  return (
    <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <ModalContainer>
        <h1>층 수정</h1>
      </ModalContainer>
    </Modal>
  );
};

const ModalContainer = styled(Stack)`
  width: 500px;
  height: 500px;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
