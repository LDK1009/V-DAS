export type ExceptionTableType = {
    id?: string;
    round?: number;
    church_name: string;
    sex: "male" | "female";
    new_assigned: RowType;
    created_at?: string;
  };

  type RowType = {
    totalAssignedCount: number;
    AorB: "A" | "B";
    assignedText: string
  };