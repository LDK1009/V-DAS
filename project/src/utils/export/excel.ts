import { DormitoryType, FloorType } from "@/types/dormitory";
import { AssignSheetFloorType, AssignSheetRowType, AssignSheetType, ChurchObject } from "@/types/excel";
import * as XLSX from "xlsx";
import { WorkBook, WorkSheet } from "xlsx";
import { getRoomNumber } from "../room/room";

////////////////////////////////////////////////// SORT 데이터 //////////////////////////////////////////////////
////////// 데이터 정렬
export const sortByChurchName = (data: ChurchObject[]): ChurchObject[] => {
  return data.sort((a, b) => a.단체명.localeCompare(b.단체명));
};

////////////////////////////////////////////////// Format 데이터 //////////////////////////////////////////////////
// 층 별 데이터 포맷팅
export const formatFromFloorToRows = (floor: FloorType): AssignSheetFloorType => {
  const rows: AssignSheetRowType[] = [];
  let totalCount = 0;

  floor.lines.forEach((line, lineIndex) => {
    line.rooms.forEach((room, roomIndex) => {
      const roomNumber = getRoomNumber(floor.floorNumber, lineIndex, roomIndex);
      const roomRow: AssignSheetRowType = [roomNumber];

      room.assignedChurchArray.forEach((church) => {
        roomRow.push(church.churchName, church.people);
        totalCount += church.people;
      });

      rows.push(roomRow);
    });
  });

  const response = {
    floorNumber: floor.floorNumber,
    totalCount,
    rows,
  };

  return response;
};

// 전체 데이터 포맷팅
export const formatFromDormitoryToRow = (dormitory: DormitoryType): AssignSheetType => {
  const { male: maleDormitory, female: femaleDormitory } = dormitory;
  const maleFloors: AssignSheetFloorType[] = [];
  const femaleFloors: AssignSheetFloorType[] = [];

  maleDormitory.floors.forEach((floor) => {
    const rows = formatFromFloorToRows(floor);
    maleFloors.push(rows);
  });

  femaleDormitory.floors.forEach((floor) => {
    const rows = formatFromFloorToRows(floor);
    femaleFloors.push(rows);
  });

  const response = {
    male: {
      totalCount: maleFloors.reduce((acc, floor) => acc + floor.totalCount, 0),
      floors: maleFloors,
    },
    female: {
      totalCount: femaleFloors.reduce((acc, floor) => acc + floor.totalCount, 0),
      floors: femaleFloors,
    },
  };

  return response;
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
export const addSheetData = (
  ws: WorkSheet,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  originPoint: string | { r: number; c: number },
  skipHeader: boolean = false
) => {
  XLSX.utils.sheet_add_json(ws, data, { origin: originPoint, skipHeader });
};

////////// 엑셀 다운로드
export const downloadExcel = (wb: WorkBook, fileName: string) => {
  XLSX.writeFile(wb, fileName);
};

////////// 시트에 층 별 데이터 쓰기
type WriteSheetFloorParamsType = {
  sex: "male" | "female";
  ws: WorkSheet;
  floorData: AssignSheetFloorType;
  originPoint?: string | { r: number; c: number };
  skipHeader?: boolean;
};

export const writeSheetFloor = ({
  sex,
  ws,
  floorData,
  originPoint = "A1",
  skipHeader = false,
}: WriteSheetFloorParamsType) => {
  try {
    const { rows } = floorData;

    const insertData = [[sex === "male" ? "형제" : "자매"], ...rows];

    XLSX.utils.sheet_add_json(ws, insertData, { origin: originPoint, skipHeader });
    const lastDataPosition = getLastDataPosition(ws);

    return { data: lastDataPosition, error: null };
  } catch {
    throw new Error("시트에 데이터 쓰기 실패");
  }
};

////////// 시트에 전체 데이터 쓰기
type WriteSheetDormitoryParamsType = {
  ws: WorkSheet;
  dormitoryData: AssignSheetType;
};

export const writeSheetDormitory = ({ ws, dormitoryData }: WriteSheetDormitoryParamsType) => {
  try {
    // 구조 분해 할당
    const { male, female } = dormitoryData;
    const columnGap = 1;

    // 남자 데이터 쓰기
    male.floors.forEach((floor) => {
      const lastDataPosition = getLastDataPosition(ws);
      const lastDataColumn = lastDataPosition.e.c;

      const nextWritePoint = {
        r: 0,
        c: lastDataColumn === 0 ? 0 : lastDataColumn + 1 + columnGap,
      };

      writeSheetFloor({ sex: "male", ws, floorData: floor, originPoint: nextWritePoint, skipHeader: true });
    });

    // 여자 데이터 쓰기
    female.floors.forEach((floor) => {
      const lastDataPosition = getLastDataPosition(ws);
      const lastDataColumn = lastDataPosition.e.c;

      const nextWritePoint = {
        r: 0,
        c: lastDataColumn === 0 ? 0 : lastDataColumn + 1 + columnGap,
      };

      writeSheetFloor({ sex: "female", ws, floorData: floor, originPoint: nextWritePoint, skipHeader: true });
    });

    // 총계 표 추가
    const lastDataPosition = getLastDataPosition(ws);
    const rowGap = 2;
    const tableWriteRow = lastDataPosition.e.r + rowGap;

    const maleTable = [
      ["층", "인원"],
      ...male.floors.map((floor) => {
        return [`${floor.floorNumber} 층`, floor.totalCount];
      }),
      ["계", male.totalCount],
    ];

    const femaleTable = [
      ["층", "인원"],
      ...female.floors.map((floor) => {
        return [`${floor.floorNumber} 층`, floor.totalCount];
      }),
      ["계", female.totalCount],
    ];

    // 형제 셀 병합 후 데이터 추가
    mergeCellsAndInsertData(ws, { r: tableWriteRow, c: 0 }, { r: tableWriteRow, c: 1 }, "형제");
    addSheetData(ws, maleTable, { r: tableWriteRow + 1, c: 0 }, true);

    // 자매 셀 병합 후 데이터 추가
    mergeCellsAndInsertData(ws, { r: tableWriteRow, c: 2 }, { r: tableWriteRow, c: 3 }, "자매");
    addSheetData(ws, femaleTable, { r: tableWriteRow + 1, c: 2 }, true);

    // 전체 셀 병합 후 데이터 추가
    const lastDataPositionAfterWriteTable = getLastDataPosition(ws);
    const writeTotalRow = lastDataPositionAfterWriteTable.e.r + 1;
    const totalCount = male.totalCount + female.totalCount;

    mergeCellsAndInsertData(ws, { r: writeTotalRow, c: 0 }, { r: writeTotalRow, c: 1 }, "총계");
    mergeCellsAndInsertData(ws, { r: writeTotalRow, c: 2 }, { r: writeTotalRow, c: 3 }, totalCount);

    return { data: "success", error: null };
  } catch {
    throw new Error("시트에 데이터 쓰기 실패");
  }
};

////////// 셀 병합 후 데이터 추가
type CellPosition = { c: number; r: number };

export const mergeCellsAndInsertData = (
  ws: WorkSheet,
  start: string | CellPosition,
  end: string | CellPosition,
  data: string | number
) => {
  const startAddress = typeof start === "string" ? start : XLSX.utils.encode_cell(start);

  const endAddress = typeof end === "string" ? end : XLSX.utils.encode_cell(end);

  // 병합 처리
  if (!ws["!merges"]) ws["!merges"] = [];
  const mergeRange = XLSX.utils.decode_range(`${startAddress}:${endAddress}`);
  ws["!merges"].push(mergeRange);

  // 데이터 삽입
  const cell = {
    v: data,
    t: typeof data === "number" ? "n" : "s",
    s: {
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    },
  };

  // 스타일 설정
  if (!ws["!styles"]) ws["!styles"] = {};
  ws["!styles"][startAddress] = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  ws[startAddress] = cell;

  // 워크시트 범위 업데이트
  const oldRange = ws["!ref"] ? XLSX.utils.decode_range(ws["!ref"]) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  const newRange = {
    s: {
      r: Math.min(oldRange.s.r, mergeRange.s.r),
      c: Math.min(oldRange.s.c, mergeRange.s.c),
    },
    e: {
      r: Math.max(oldRange.e.r, mergeRange.e.r),
      c: Math.max(oldRange.e.c, mergeRange.e.c),
    },
  };
  ws["!ref"] = XLSX.utils.encode_range(newRange);
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
    return { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  }

  return XLSX.utils.decode_range(ws["!ref"]);
};
