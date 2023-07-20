import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const AdvanceTable = ({
  headers,
  page,
  prepareRow,
  headerClassName,
  bodyClassName,
  rowClassName,
  footer,
  handleSort,
  tableProps,
  extra
}) => {
  return (
    <div className="table-responsive scrollbar">
      <Table {...tableProps} id="print-table">
        <thead className={headerClassName}>
          <tr>
            {headers.map((column, index) => (
              <th
                key={index}
                {...column.headerProps}
                style={{ cursor: column.canSort && 'pointer' }}
                onClick={() => {
                  column.canSort && handleSort(column);
                  console.log(column);
                }}
              >
                {column.render('Header')}
                {column.canSort ? (
                  <span
                    className={`sort ${column.sortingDirection}`}
                    onClick={() => {
                      handleSort(column);
                    }}
                  />
                ) : (
                  ''
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {page.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr key={i} className={rowClassName} {...row.getRowProps()}>
                  {row.cells.map((cell, index) => {
                    return (
                      <td
                        key={index}
                        {...cell.getCellProps(cell.column.cellProps)}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr className="">
              <td colSpan={headers.length + 2} className={'text-center'}>
                No results found.
              </td>
            </tr>
          )}
          {extra}
        </tbody>
        {footer}
      </Table>
    </div>
  );
};
AdvanceTable.propTypes = {
  headers: PropTypes.array,
  page: PropTypes.array,
  prepareRow: PropTypes.func,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  tableProps: PropTypes.object,
  footer: PropTypes.object,
  handleSort: PropTypes.object,
  extra: PropTypes.object
};

export default AdvanceTable;
