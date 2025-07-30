import { supabase } from "@/lib/supabaseClient";
//////////////////////////////////////////////////////////////////////////////// CREATE ////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////// READ ////////////////////////////////////////////////////////////////////////////////
////////////////////////////// 모든 캠프 조회 //////////////////////////////
export const getAllCamps = async () => {
  try {
    const { data } = await supabase.from("camps").select("*").order("created_at", { ascending: false });
    return data;
  } catch {
    throw new Error("캠프 정보 조회 실패");
  }
};

export const getAllRounds = async () => {
  try {
    const { data } = await supabase.from("camps").select("round");
    return data;
  } catch {
    throw new Error("캠프 차수 조회 실패");
  }
};

////////////////////////////// 공개 캠프 조회 //////////////////////////////
export const getPublicCamps = async () => {
  try {
    const { data } = await supabase.from("camps").select("*").eq("is_public", true).single();

    return data;
  } catch {
    throw new Error("캠프 정보 조회 실패");
  }
};

////////////////////////////// 공개 캠프 카드 조회 //////////////////////////////
export const getPublicCampChurchCards = async () => {
  try {
    const { data } = await supabase.from("camps").select("church_cards").eq("is_public", true);

    if (!data) throw new Error("캠프 카드 정보 조회 실패");

    return data[0].church_cards;
  } catch {
    throw new Error("캠프 카드 정보 조회 실패");
  }
};

//////////////////////////////////////////////////////////////////////////////// UPDATE ////////////////////////////////////////////////////////////////////////////////
////////////////////////////// 캠프 공개 여부 수정 //////////////////////////////
export const changeCampPublic = async (targetCampId: number) => {
  try {
    // 현재 타겟 캠프의 공개 여부 조회
    const { data: currentUpdatePublicStatus } = await supabase
      .from("camps")
      .select("is_public")
      .eq("id", targetCampId)
      .single();

    // 현재 타겟 캠프의 공개 여부가 true라면 함수 종료
    if (currentUpdatePublicStatus?.is_public === true) {
      await supabase.from("camps").update({ is_public: false }).eq("id", targetCampId);
    }

    if (currentUpdatePublicStatus?.is_public === false) {
      await supabase.from("camps").update({ is_public: true }).eq("id", targetCampId);
    }

    return { data: "success", error: null };
  } catch {
    throw new Error("캠프 공개 여부 수정 실패");
  }
};

////////////////////////////// 모든 캠프 공개 여부 수정 //////////////////////////////
export const updateAllCampsNotPublic = async () => {
  try {
    await supabase.from("camps").update({ is_public: false });
  } catch {
    throw new Error("캠프 공개 여부 수정 실패");
  }
};

//////////////////////////////////////////////////////////////////////////////// DELETE ////////////////////////////////////////////////////////////////////////////////
////////////////////////////// 캠프 삭제 //////////////////////////////
export const deleteCamp = async (targetCampId: number) => {
  try {
    await supabase.from("camps").delete().eq("id", targetCampId);
  } catch {
    throw new Error("캠프 삭제 실패");
  }
};
