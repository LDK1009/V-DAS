import { useCurrentChurchStore } from "@/store/church/churchStore";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { ChurchType } from "@/types/currentChurchType";

export const useAssign = () => {
  const { assignRoom } = useDormitoryStore();
  const { subtractChurchMale, subtractChurchFemale } =
    useCurrentChurchStore();

  type AssignRoomParamsType = {
    church: ChurchType;
    count: number;
    floorIndex: number;
    lineIndex: number;
    roomIndex: number;
  };

  function assign({ church, count, floorIndex, lineIndex, roomIndex }: AssignRoomParamsType) {
    assignRoom({ church, count, floorIndex, lineIndex, roomIndex });
  }

  return { assign };
};
