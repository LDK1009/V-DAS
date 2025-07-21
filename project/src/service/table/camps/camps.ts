import { supabase } from "@/lib/supabaseClient";

export const getPublicCamps = async () => {
  try {
    const { data } = await supabase.from("camps").select("*").eq("is_public", true).single();
    
    return data;
  } catch {
    throw new Error("캠프 정보 조회 실패");
  }
};
