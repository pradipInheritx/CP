import React from "react";

export type PaginationProps = {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageCount: number;
  gotoPage: (size: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  state: { pageSize: number; pageIndex?: number };
  numRows?: number;
};

const Pagination: ({
  canPreviousPage,
  canNextPage,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  state: { pageSize },
  numRows,
}: PaginationProps & {
  numRows?: number;
}) => JSX.Element = ({
  canPreviousPage,
  canNextPage,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  state: { pageSize },
  numRows = 5,
}) => (
  <tr>
    <td className="pagination">
      <button
        onClick={(e) => {
          e.preventDefault();
          gotoPage(0);
        }}
        disabled={!canPreviousPage}
      >
        {"<<"}
      </button>{" "}
      <button
        onClick={(e) => {
          e.preventDefault();
          previousPage();
        }}
        disabled={!canPreviousPage}
      >
        {"<"}
      </button>{" "}
      <button
        onClick={(e) => {
          e.preventDefault();
          nextPage();
        }}
        disabled={!canNextPage}
      >
        {">"}
      </button>{" "}
      <button
        onClick={(e) => {
          e.preventDefault();
          gotoPage(pageCount - 1);
        }}
        disabled={!canNextPage}
      >
        {">>"}
      </button>
    </td>
    <td>
      <select
        value={pageSize}
        onChange={(e) => {
          setPageSize(Number(e.target.value));
        }}
      >
        {Array.from(Array(5).keys())
          .map((p) => p * numRows * 2 + numRows * 2)
          .map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
      </select>
    </td>
  </tr>
);

export default Pagination;
