import type { ReactNode } from 'react';

export interface Column<T> {
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
}

/** Responsive table (each cell carries its column label for the stacked mobile layout). */
export function DataTable<T>({ columns, rows, rowKey, emptyText = 'Nothing here yet.' }: DataTableProps<T>) {
  if (rows.length === 0) return <p className="table-empty">{emptyText}</p>;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{columns.map((column) => <th key={column.label} className={column.className}>{column.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.label} className={column.className} data-label={column.label}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
