import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

interface DropDownListProps {
  options: string[];
  label: string;
}

export default function DropDownList({
  options,
  label,
}: DropDownListProps) {
  const [selectedValue, setSelectedValue] = React.useState("");
  const labelId = `${label.toLowerCase().replace(/\s+/g, "-")}-label`;
  const selectId = `${label.toLowerCase().replace(/\s+/g, "-")}-select`;

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          labelId={labelId}
          id={selectId}
          value={selectedValue}
          label={label}
          onChange={handleChange}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
