import { DormitoryType } from "@/types/dormitory";
import { AssignSheetRowType, ChurchObject } from "@/types/excel";
import * as XLSX from "xlsx";
import { WorkBook, WorkSheet } from "xlsx";
import { getRoomNumber } from "../room/room";

////////////////////////////////////////////////// SORT 데이터 //////////////////////////////////////////////////
////////// 데이터 정렬
export const sortByChurchName = (data: ChurchObject[]): ChurchObject[] => {
  return data.sort((a, b) => a.단체명.localeCompare(b.단체명));
};

////////////////////////////////////////////////// Format 데이터 //////////////////////////////////////////////////
export const formatFromDormitoryToRow = (dormitory: DormitoryType): AssignSheetRowType => {
  const { male: maleDormitory, female: femaleDormitory } = dormitory;
  const maleRoomRows : AssignSheetRowType[] = [];

  maleDormitory.floors.forEach((floor) => {
    floor.lines.forEach((line, lineIndex) => {
      line.rooms.forEach((room, roomIndex) => {
        const roomNumber = getRoomNumber(floor.floorNumber, lineIndex, roomIndex);
        const roomRow : AssignSheetRowType = [];

        roomRow.push(roomNumber);
        room.assignedChurchArray.forEach((church) => {
            roomRow.push(church.churchName, church.people);
        });

        maleRoomRows.push(roomRow);
      });
    });
  });

  return maleRoomRows;
};



////////////////////////////////////////////////// CREATE 엑셀 //////////////////////////////////////////////////
////////// 엑셀 초기화
export const initExcel = () => {
  const wb = XLSX.utils.book_new(); // 워크북만 생성
  return { wb }; // ws는 제거
};

////////// 시트 생성
export const createSheet = (wb: WorkBook, sheetName: string) => {
  const ws = XLSX.utils.json_to_sheet([]); // 새로운 워크시트 생성
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return ws;
};

////////// 시트 데이터 추가
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addSheetData = (ws: WorkSheet, data: any, originPoint: string, skipHeader: boolean = false) => {
  XLSX.utils.sheet_add_json(ws, data, { origin: originPoint, skipHeader });
};

////////// 엑셀 다운로드
export const downloadExcel = (wb: WorkBook, fileName: string) => {
  XLSX.writeFile(wb, fileName);
};

////////////////////////////////////////////////// READ 엑셀 //////////////////////////////////////////////////
////////// 엑셀 파일 읽기
export const excelToJson = (file: File): Promise<ChurchObject[]> => {
  if (!file) throw new Error("파일이 없습니다.");
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
        resolve(jsonData as ChurchObject[]);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("파일 읽기 실패"));
    reader.readAsArrayBuffer(file);
  });
};

////////// 특정 이름의 시트 가져오기
export const getSheet = (wb: WorkBook, sheetName: string): WorkSheet => {
  if (!wb.Sheets[sheetName]) {
    throw new Error(`시트 ${sheetName}가 없습니다.`);
  }

  return wb.Sheets[sheetName] as WorkSheet;
};

////////// 특정 이름의 시트 데이터 가져오기
export const getSheetData = (ws: WorkSheet) => {
  return XLSX.utils.sheet_to_json(ws);
};

////////// 마지막으로 데이터가 삽입된 위치 가져오기
export const getLastDataPosition = (ws: WorkSheet) => {
  if (!ws["!ref"]) {
    throw new Error("시트에 데이터가 없습니다.");
  }

  return XLSX.utils.decode_range(ws["!ref"]);
};
