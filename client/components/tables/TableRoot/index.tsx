import React, { FC } from 'react';
import {
  Box,
  Card,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import TokenImage from '@/components/TokenImage';

interface ITableData {
  columns: string[];
  objects?: object[];
}

export interface TableRootProps {
  data: ITableData;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    owerflow: 'hidden',
    '& .MuiTableCell-root': { whiteSpace: 'nowrap', maxWidth: '1px', overflow: 'hidden', textOverflow: 'ellipsis' },
  },
}));

const TableRoot: FC<TableRootProps> = ({ data }) => {
  const classes = useStyles();

  const renderTableCellContent = (row, key: string) => {
    const cellValue = row[key];

    if (typeof cellValue === 'object') {
      if (cellValue?.loading) {
        return <Skeleton />;
      }

      if (cellValue.hasOwnProperty('image')) {
        return (
          <Box display='flex' alignItems='center'>
            <TokenImage loading={cellValue?.imageLoading} image={cellValue?.image} style={{ marginRight: '5px' }} />
            {cellValue?.value}
          </Box>
        );
      }

      return cellValue?.value;
    }

    return cellValue;
  };

  return (
    <TableContainer component={Card} className={classes.root} style={{ overflow: data?.objects ? 'auto' : 'hidden' }}>
      <Table>
        <TableHead>
          <TableRow>
            {data.columns.map((column) => (
              <TableCell key={column} style={{ width: '25%' }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.objects
            ? data.objects.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.keys(row).map((key, cellIndex) => (
                    <TableCell key={`${rowIndex} ${cellIndex} ${key}`} style={{ width: '25%' }}>
                      {renderTableCellContent(row, key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : [...new Array(30)].fill(1).map((row, index) => (
                <TableRow key={index}>
                  {data.columns.map((column) => (
                    <TableCell key={column}>
                      <Skeleton />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableRoot;
