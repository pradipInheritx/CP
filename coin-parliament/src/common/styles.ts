import styled from "styled-components";

export const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    table-layout: auto;
    border-collapse: collapse;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      width: auto;
      white-space: nowrap;

      :last-child {
        border-right: 0;
        width: 100%;
      }
    }
  }

  .favorite {
    .form-check-input:not(:checked)[type="checkbox"] {
      + label > i.bi-heart-fill {
        display: none;
      }
    }

    .form-check-input:checked[type="checkbox"] {
      + label > i.bi-heart {
        display: none;
      }
    }
  }
`;
