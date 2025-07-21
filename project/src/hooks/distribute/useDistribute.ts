import { getPublicCamps } from "@/service/table/camps/camps";
import { useDistributeStore } from "@/store/distribute/distributeStore";

export const useDistribute = () => {
  ////////////////////////////// 공통 스토어
  const { setDistributeData } = useDistributeStore();
  
  ////////////////////////////// 함수
  ////////// 공개 캠프 데이터 가져오기
  async function getDistributeData() {
    const data = await getPublicCamps();
    if (!data) return;

    setDistributeData({
      round: data.round,
      churchCards: data.church_cards,
    });
  }

  return { getDistributeData };
};
