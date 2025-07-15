import { useCurrentChurchStore } from "@/store/church/churchStore";
import { styled, TextField } from "@mui/material";
import { Autocomplete } from "@mui/material";
import React from "react";

const SearchBar = () => {
  const { currentChurchSex, churchMaleArray, churchFemaleArray, searchChurch, setSearchChurch } =
    useCurrentChurchStore();

  const churchNames =
    currentChurchSex === "male"
      ? [...(churchMaleArray?.map((church) => church.churchName) || [])].sort((a, b) => a.localeCompare(b))
      : [...(churchFemaleArray?.map((church) => church.churchName) || [])].sort((a, b) => a.localeCompare(b));

  return (
    <>
      <StyledAutocomplete
        disablePortal
        options={churchNames || []}
        value={searchChurch || null}
        onChange={(event, newValue) => {
          setSearchChurch(newValue as string);
        }}
        inputValue={searchChurch || ""}
        onInputChange={(event, newInputValue) => {
          setSearchChurch(newInputValue);
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
        renderInput={(params) => <TextField {...params} label="교회 검색" />}
      />
    </>
  );
};

export default SearchBar;

const StyledAutocomplete = styled(Autocomplete)`
  width: 100%;
  color: ${({ theme }) => theme.palette.primary.main};

  & .MuiFormLabel-root {
    color: ${({ theme }) => theme.palette.text.primary};
  }

  & .MuiSvgIcon-root {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  & .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }

  & .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }
`;
