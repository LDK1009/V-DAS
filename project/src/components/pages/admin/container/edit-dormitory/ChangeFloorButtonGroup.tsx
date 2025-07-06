import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { Modal, Stack, styled } from "@mui/material";
import React, { useState } from "react";

const ChangeFloorButtonGroup = () => {
  const { dormitoryData, currentFloor, setCurrentFloor } = useDormitoryStore();

  const floors = dormitoryData?.floors;

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {floors?.map((el) => {
        return (
          <button key={el.floorNumber} onClick={() => setCurrentFloor(el.floorNumber)}>
            {el.floorNumber + 1}
          </button>
        );
      })}
      <div>현재 층 : {currentFloor + 1}</div>
      <button onClick={() => setIsModalOpen(true)}>층 수정</button>
      <ChangeFloorModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default ChangeFloorButtonGroup;

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
