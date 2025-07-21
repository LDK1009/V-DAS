import { supabase } from "@/lib/supabaseClient";

export const getPublicCamps = async () => {
  try {
    const { data } = await supabase.from("camps").select("*").eq("is_public", true).single();

    return data;
  } catch {
    throw new Error("캠프 정보 조회 실패");
  }
};

export const getPublicCampChurchCards = async () => {
  try {
    const { data } = await supabase.from("camps").select("church_cards").eq("is_public", true);

    if (!data) throw new Error("캠프 카드 정보 조회 실패");

    return data[0].church_cards;
  } catch {
    throw new Error("캠프 카드 정보 조회 실패");
  }
};
