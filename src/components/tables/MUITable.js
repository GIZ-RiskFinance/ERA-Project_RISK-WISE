import React from "react";
import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Custom styled components for the header and rows
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#73B588", // Green header background
  color: theme.palette.common.white, // White text in the header
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover, // Alternating row color
  },
}));

const MUITable = ({ tableData }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Object.keys(tableData[0]).map((key) => (
              <StyledTableCell key={key} align="center">
                {t(key)}
              </StyledTableCell> // Center align headers
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, index) => (
            <StyledTableRow key={index}>
              {Object.values(row).map((val, index) => (
                <TableCell key={index} align="center">
                  {val}
                </TableCell> // Center align cells
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

MUITable.propTypes = {
  tableData: PropTypes.any.isRequired,
};

export default MUITable;
