import * as XLSX from "xlsx";

// 브라우저용 (File 객체)
export const readExcelFile = (file: File): Promise<Record<string, unknown>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        // 첫 번째 시트 가져오기
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // JSON 데이터로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData as Record<string, unknown>[]);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsArrayBuffer(file);
  });
};
