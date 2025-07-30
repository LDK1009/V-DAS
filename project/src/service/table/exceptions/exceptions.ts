import { supabase } from "@/lib/supabaseClient";
import { ExceptionTableType } from "@/types/exceptions";

export const getException = async (round: number) => {
  try {
    const response = await supabase.from("exceptions").select("*").eq("round", round);
    return response;
  } catch {
    throw new Error("getException() 오류");
  }
};

export const postException = async ({ round, church_name, sex, new_assigned }: ExceptionTableType) => {
  try {
    if (!round || !church_name || !sex || !new_assigned) throw new Error("데이터가 존재하지 않습니다.");

    const existException = await getException(round);
    // 이미 예외가 존재하는 교회라면 업데이트
    if (existException.data && existException.data.length > 0) {
      await putException({ round, church_name, sex, new_assigned });
    }
    const response = await supabase.from("exceptions").insert({ round, church_name, sex, new_assigned });
    return response;
  } catch {
    throw new Error("postException() 오류");
  }
};

export const postExceptions = async (round: number, exceptions: ExceptionTableType[]) => {
  try {
    if (!round) return "회차를 선택해주세요.";

    for (const exception of exceptions) {
      if (!exception.church_name || !exception.sex || !exception.new_assigned)
        return `${exception.church_name}의 데이터를 모두 입력해주세요.`;
    }

    const postData = exceptions.map((exception) => ({
      ...exception,
      round,
    }));

    const response = await supabase.from("exceptions").insert(postData);
    return response;
  } catch {
    throw new Error("postExceptions() 오류");
  }
};

export const putException = async ({ round, church_name, sex, new_assigned }: ExceptionTableType) => {
  const response = await supabase.from("exceptions").update({ church_name, sex, new_assigned }).eq("round", round);
  return response;
};
