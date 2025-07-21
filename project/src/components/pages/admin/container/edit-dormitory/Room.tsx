import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { mixinFlex } from "@/styles/mixins";
import { RoomType } from "@/types/dormitory";
import { Button, Stack, styled } from "@mui/material";
import React, { RefObject, useState } from "react";
import ChurchItem from "../church-list/ChurchItem";
import { shouldForwardProp } from "@/utils/mui";
import { useDrop } from "react-dnd";
import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useAssign } from "@/hooks/assign/useAssign";
import { ChurchType } from "@/types/currentChurchType";
import { enqueueSnackbar } from "notistack";
import { getCurrentFloorIndex, getCurrentFloorSex, getRoomInfo, getUseFloors } from "@/hooks/assign/useAssignable";
import { getRoomNumber } from "@/utils/room/room";
import { checkFloorIndex } from "@/utils/dormitory/check";
import { LockOpenRounded, LockOutlined } from "@mui/icons-material";

const Room = ({
  lineIndex,
  room,
  roomIndex,
  customRoomNumber,
}: {
  lineIndex: number;
  room: RoomType;
  roomIndex: number;
  customRoomNumber?: number;
}) => {
  const { currentFloor, maxRoomPeople } = useDormitoryStore();
  const { currentChurchSex } = useCurrentChurchStore();
  const { assignRoom } = useAssign();
  const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);

  ////////// 방 번호 가져오기
  let startRoomNumber = 1; // 기본값 설정
  // 라인별 방 번호 시작 번호
  if (lineIndex === 0) {
    startRoomNumber = 1;
  } else if (lineIndex === 1) {
    startRoomNumber = 7;
  } else if (lineIndex === 2) {
    startRoomNumber = 11;
  } else if (lineIndex === 3) {
    startRoomNumber = 16;
  } else if (lineIndex === 4) {
    startRoomNumber = 22;
  }

  const roomNumber = startRoomNumber + roomIndex;

  ////////// 방 상태 가져오기
  function getRoomStatus(current: number) {
    if (current > maxRoomPeople) return "exceed";
    if (current === maxRoomPeople) return "full";
    if (current < maxRoomPeople) {
      if (current === 0) return "empty";
      return "insufficient";
    }
    return "insufficient";
  }

  ////////// 드래그 앤 드롭
  type DropItemType = {
    church: ChurchType;
    dragFrom: "room" | "sidebar";
    lineIndex?: number;
    roomIndex?: number;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ITEM", // 받아들일 수 있는 드래그 아이템의 타입
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    drop: (item: DropItemType, monitor) => {
      ////////// 드래그가 방에서 방으로 드래그 되었을 경우
      if (item.dragFrom === "room") {
        const currentFloorSex = getCurrentFloorSex();
        if (!currentFloorSex) {
          enqueueSnackbar("층 정보를 가져오는데 실패했습니다.", { variant: "error" });
          return;
        }

        const currentFloorIndex = getCurrentFloorIndex(currentFloorSex);
        if (currentFloorIndex && !(currentFloorIndex >= 0)) {
          enqueueSnackbar("층 정보를 가져오는데 실패했습니다.", { variant: "error" });
          return;
        }

        const dragRoomInfo = { church: item.church, room: { lineIndex: item.lineIndex, roomIndex: item.roomIndex } };
        const dropRoomInfo = { lineIndex, roomIndex };

        // 기존 방에서 교회 삭제
        assignRoom({
          sex: currentFloorSex,
          church: dragRoomInfo.church,
          count: -dragRoomInfo.church.people,
          floorIndex: currentFloorIndex as number,
          lineIndex: dragRoomInfo.room.lineIndex as number,
          roomIndex: dragRoomInfo.room.roomIndex as number,
        });

        // 새로운 방으로 교회 이동
        assignRoom({
          sex: currentFloorSex,
          church: item.church,
          count: dragRoomInfo.church.people,
          floorIndex: currentFloorIndex as number,
          lineIndex: dropRoomInfo.lineIndex as number,
          roomIndex: dropRoomInfo.roomIndex as number,
        });

        return;
      }

      ////////// 드래그가 사이드바에서 방으로 드래그 되었을 경우
      // 사용 가능한 층 배열
      const useableFloors = getUseFloors(currentChurchSex);
      // 현재 층의 층 인덱스
      const currentFloorIndex = getCurrentFloorIndex(currentChurchSex);

      // 현재 층 인덱스 예외 처리
      if (currentFloorIndex !== 0 && !currentFloorIndex) {
        enqueueSnackbar("층 정보를 가져오는데 실패했습니다.", { variant: "error" });
        return;
      }

      // 현재 사이드바의 성별
      const currentSidebarSex = useCurrentChurchStore.getState().currentChurchSex;
      // 현재 기숙사 층의 성별
      const currentFloorSex = getCurrentFloorSex();

      // 현재 사이드바의 성별과 현재 기숙사 층의 성별이 다를 경우
      if (currentSidebarSex !== currentFloorSex) {
        enqueueSnackbar("다른 성별 층에는 배정할 수 없습니다.", { variant: "error" });
        return;
      }

      // 성별 예외 처리
      if (useableFloors && !useableFloors.includes(currentFloor)) {
        enqueueSnackbar("다른 성별 층에는 배정할 수 없습니다.", { variant: "error" });
        return;
      }

      // 특정 방의 정보 가져오기
      const roomInfo = getRoomInfo(currentChurchSex, currentFloorIndex, lineIndex, roomIndex);

      if (item.church.people <= 0) {
        enqueueSnackbar("교회 인원이 0명 이하입니다.", { variant: "error" });
        return;
      }

      // 방이 꽉 차있을 경우
      if (roomInfo.remain <= 0) {
        const inputNumber = prompt("배정 인원을 입력해주세요.");

        // 양의 정수 패턴
        const integerPattern = /^[1-9]\d*$/;

        // 입력값이 없을 경우
        if (!inputNumber) {
          return;
        }

        // 양의 정수 패턴 예외 처리
        if (!integerPattern.test(inputNumber)) {
          enqueueSnackbar("배정 인원을 입력해주세요.", { variant: "error" });
          return;
        }

        // 방 배정
        assignRoom({
          sex: currentChurchSex,
          church: item.church,
          count: Number(inputNumber),
          floorIndex: currentFloorIndex,
          lineIndex,
          roomIndex,
        });

        return;
      }

      // 방이 꽉 차지 않았을 경우
      if (roomInfo.remain > 0) {
        // 교회 인원이 방 인원보다 많거나 같을 경우
        if (item.church.people >= roomInfo.remain) {
          assignRoom({
            sex: currentChurchSex,
            church: item.church,
            count: roomInfo.remain,
            floorIndex: currentFloorIndex,
            lineIndex,
            roomIndex,
          });

          return;
        }
        // 교회 인원이 방 인원보다 적을 경우
        if (item.church.people < roomInfo.remain) {
          assignRoom({
            sex: currentChurchSex,
            church: item.church,
            count: item.church.people,
            floorIndex: currentFloorIndex,
            lineIndex,
            roomIndex,
          });
          return;
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  ////////// 우클릭
  const handleRightClick = (event: React.MouseEvent) => {
    // 기본 컨텍스트 메뉴가 나타나는 것을 방지
    event.preventDefault();

    setIsOptionMenuOpen((prev) => !prev);
  };

  ////////// 방 폐쇄
  const handleCloseRoom = () => {
    const { closeRoom } = useDormitoryStore.getState();
    const currentFloorSex = getCurrentFloorSex();

    if (!currentFloorSex) {
      return;
    }
    const floorIndex = getCurrentFloorIndex(currentFloorSex);

    if (typeof floorIndex !== "number" || !checkFloorIndex(floorIndex)) {
      return;
    }

    closeRoom({ sex: currentFloorSex, floorIndex: floorIndex, lineIndex, roomIndex });

    enqueueSnackbar(`${getRoomNumber(currentFloor, lineIndex, roomIndex)}호 폐쇄`, { variant: "error" });
    setIsOptionMenuOpen(false);
  };

  ////////// 방 개방
  const handleOpenRoom = () => {
    const { openRoom } = useDormitoryStore.getState();
    const currentFloorSex = getCurrentFloorSex();

    if (!currentFloorSex) {
      return;
    }
    const floorIndex = getCurrentFloorIndex(currentFloorSex);

    if (typeof floorIndex !== "number" || !checkFloorIndex(floorIndex)) {
      return;
    }

    openRoom({ sex: currentFloorSex, floorIndex: floorIndex, lineIndex, roomIndex });

    enqueueSnackbar(`${getRoomNumber(currentFloor, lineIndex, roomIndex)}호 개방`, { variant: "info" });
    setIsOptionMenuOpen(false);
  };

  ////////// 방 폐쇄 체크
  function checkClose(room: RoomType) {
    if (room.max === 0 && room.current === 0 && room.remain === 0 && room.assignedChurchArray.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <>
      {isOptionMenuOpen ? (
        <OptionMenuContainer
          onContextMenu={handleRightClick}
          onClick={checkClose(room) ? handleOpenRoom : handleCloseRoom}
        >
          <CloseButton
            startIcon={checkClose(room) ? <LockOpenRounded /> : <LockOutlined />}
            color={checkClose(room) ? "success" : "error"}
          >
            {checkClose(room) ? "방 개방" : "방 폐쇄"}
          </CloseButton>
        </OptionMenuContainer>
      ) : (
        <Container
          ref={drop as unknown as RefObject<HTMLDivElement>}
          onContextMenu={handleRightClick}
          $isClose={checkClose(room)}
        >
          <RoomNumberContainer>{`${currentFloor}${String(customRoomNumber || roomNumber).padStart(
            2,
            "0"
          )}`}</RoomNumberContainer>

          <ChurchContainer>
            {checkClose(room)
              ? "X"
              : room.assignedChurchArray.map((church, churchIndex) => {
                  return (
                    <ChurchItem
                      lineIndex={lineIndex}
                      roomIndex={roomIndex}
                      church={church}
                      key={`${currentFloor}-${lineIndex}-${roomNumber}-${churchIndex}`}
                      dragFrom="room"
                      type="room"
                    />
                  );
                })}
          </ChurchContainer>
          <RoomCurrentContainer $status={getRoomStatus(room.current)}>{room.current}</RoomCurrentContainer>
        </Container>
      )}
    </>
  );
};

export default Room;

type ContainerPropsType = {
  $isClose: boolean;
};

const Container = styled(Stack, { shouldForwardProp })<ContainerPropsType>`
  ${mixinFlex("row", "start", "stretch")}
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${({ $isClose }) => ($isClose ? "#DCDCDC" : "transparent")};
`;

const RoomNumberContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 40px;
  min-width: 40px;
  height: 100%;
  min-height: 55px;
  font-size: 14px;
`;

const ChurchContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 172px;
  min-width: 172px;
  height: 100%;
  min-height: 55px;
  border: 1px solid black;
  border-top: none;
  border-bottom: none;
  padding: 6px 4px;
  row-gap: 4px;
`;

type RoomCurrentContainerPropsType = {
  $status: "exceed" | "full" | "insufficient" | "empty";
};
const RoomCurrentContainer = styled(Stack, { shouldForwardProp })<RoomCurrentContainerPropsType>`
  ${mixinFlex("column", "center", "center")}
  width: 40px;
  min-width: 40px;
  font-size: 16px;
  background-color: ${({ $status }) => {
    if ($status === "exceed") return "red";
    if ($status === "full") return "transparent";
    if ($status === "insufficient") return "yellow";
    if ($status === "empty") return "transparent";
  }};
  color: ${({ $status }) => {
    if ($status === "exceed") return "white";
    if ($status === "full") return "black";
    if ($status === "insufficient") return "black";
    if ($status === "empty") return "black";
  }};
`;

const OptionMenuContainer = styled(Stack)`
  ${mixinFlex("column", "center", "center")}
  width: 100%;
  height: 55px;
  min-height: 55px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
`;

const CloseButton = styled(Button)``;
