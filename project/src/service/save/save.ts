import { supabase } from "@/lib/supabaseClient";
import { CampType } from "@/types/camp";

type SaveCampResponseType = CampType;

export async function saveCamp({ round, dormitory_setting, church_list, dormitory, is_public }: SaveCampResponseType) {
  try {
    const { data: sameRoundCampData } = await supabase.from("camps").select("*").eq("round", round).single();

    // 같은 라운드의 캠프가 있으면 업데이트
    if (sameRoundCampData) {
      const { data } = await supabase.from("camps").update({
        round,
        dormitory_setting,
        church_list,
        dormitory,
        is_public,
      });

      return data;
    }

    // 같은 라운드의 캠프가 없으면 생성
    else {
      const { data } = await supabase.from("camps").insert({
        round,
        dormitory_setting,
        church_list,
        dormitory,
        is_public,
      });

      return data;
    }
  } catch {
    throw new Error("saveCamp() : 캠프 저장 실패");
  }
}
