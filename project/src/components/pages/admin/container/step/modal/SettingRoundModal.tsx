import { supabase } from "@/lib/supabaseClient";
import { useDormitoryStore } from "@/store/dormitory/dormitoryStore";
import { useEditDormitoryModalStore } from "@/store/ui/editDormitoryModalStore";
import { mixinMuiTextInputBorder } from "@/styles/mixins";
import { Button, Modal, Stack, styled, TextField } from "@mui/material";
import React, { useEffect } from "react";

const SettingRoundModal = () => {
  const { isSettingRoundModalOpen, setIsSettingRoundModalOpen } = useEditDormitoryModalStore.getState();
  const { round, setRound } = useDormitoryStore.getState();

  useEffect(() => {
    async function fetchLastRound() {
      const { data } = await supabase
        .from("camps")
        .select("round")
        .order("round", { ascending: false })
        .limit(1)
        .single();
      if (data?.round) {
        setRound(data?.round + 1);
      }
    }

    fetchLastRound();
  }, [setRound]);

  return (
    <Modal open={isSettingRoundModalOpen} onClose={() => setIsSettingRoundModalOpen(false)}>
      <ModalContainer>
        <StyleTextField type="number" label="차수" value={round} onChange={(e) => setRound(Number(e.target.value))} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setIsSettingRoundModalOpen(false);
          }}
        >
          저장
        </Button>
      </ModalContainer>
    </Modal>
  );
};

export default SettingRoundModal;

const ModalContainer = styled(Stack)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 100px;
  row-gap: 16px;
  background-color: white;
  border-radius: 10px;
`;

const StyleTextField = styled(TextField)`
  ${({ theme }) => mixinMuiTextInputBorder(theme)}
`;
