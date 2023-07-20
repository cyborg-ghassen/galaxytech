/* eslint-disable react/prop-types */
import React from 'react';
import Flex from '../Flex';
import { Pagination } from '@mantine/core';

export const AdvanceTablePagination = ({
  query,
  fetch,
  count,
  length,
  itemsPerPage
}) => {
  const canPreviousPage = query.get('page') > 1;
  const canNextPage = length === itemsPerPage && length !== 0;
  const handlePreviousPage = () => {
    if (canPreviousPage) {
      const pageIndex = (query.get('page') || 1) - 1;
      handlePaginationChange(pageIndex);
    }
  };

  const handlePaginationChange = pageIndex => {
    query.set('page', pageIndex + 1);
    fetch(query).catch(() => {});
  };

  const handleNextPage = () => {
    if (canNextPage) {
      const pageIndex = (query.get('page') || 0) + 1;
      handlePaginationChange(pageIndex);
    }
  };

  const gotoPage = pageIndex => {
    query.set('page', pageIndex);
    fetch(query).catch(() => {});
  };
  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      className={'d-print-none'}
    >
      <Pagination
        total={Math.ceil(count / itemsPerPage)}
        siblings={1}
        activePage={(query.get('page') || 1) - 1}
        onChange={gotoPage}
      >
        <Pagination.Previous
          disabled={!canPreviousPage}
          onClick={handlePreviousPage}
        />
        <Pagination.Items />
        <Pagination.Next disabled={!canNextPage} onClick={handleNextPage} />
      </Pagination>
    </Flex>
  );
};

export default AdvanceTablePagination;
