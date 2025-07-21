import { supabase } from "@/lib/supabaseClient";
import { CampType } from "@/types/camp";

type SaveCampResponseType = CampType;

export async function saveCamp({
  round,
  dormitory_setting,
  church_list,
  dormitory,
  is_public,
  church_cards,
}: SaveCampResponseType) {
  const { data, error } = await supabase
    .from("camps")
    .upsert(
      {
        round,
        dormitory_setting,
        church_list,
        dormitory,
        is_public,
        church_cards,
      },
      {
        onConflict: "round",
      }
    )
    .select();

  if (error) throw error;

  return data;
}
