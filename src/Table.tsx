import { tableFooterClasses } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Column, useBlockLayout, useExpanded, useSortBy, useTable } from "react-table";
import { FixedSizeList } from 'react-window'
import "./Table.css"

export type TableProps = {
  enableSorting?: boolean;
  hideHeaders?: boolean;
};

/**
 * If data in a column is numeric and no custom Cell render function
 * is provided then add a custom Cell render function to format the numbers
 */
export function processColumns(columns: Array<any>, data: Array<any>) {
  let columnIndex = 0;
  for (let td in data[0]) {
    if (typeof data[0][td] === "number" && !("Cell" in columns[columnIndex])) {
      columns[columnIndex]["Cell"] = (props: any) => (
        <>{props.value.toLocaleString("en-IN")}</>
      );
    }
    columnIndex++;
  }
  return columns;
}

const scrollbarWidth = () => {
  // thanks too https://davidwalsh.name/detect-scrollbar-width
  const scrollDiv = document.createElement('div')
  scrollDiv.setAttribute('style', 'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;')
  document.body.appendChild(scrollDiv)
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
  document.body.removeChild(scrollDiv)
  return scrollbarWidth
}

export function Table(props: TableProps) {
  /* It's important that we're using React.useMemo here to ensure
   * that our data isn't recreated on every render. If we didn't use
   * React.useMemo, the table would think it was receiving new data on
   * every render and attempt to recalulate a lot of logic every single
   * time. Not cool!
   */

  const defaultColumn = useMemo(
    () => ({
      width: 150,
    }),
    []
  )

  const data = useMemo(() => Array(100).fill(null).map((item, i) => ({
    col0: `Label ${i}`,
    col1: 0.1,
    col2: Math.floor(1 + Math.random() * 25),
    col3: 2.0,
    col4: 3.1,
    col5: 4.2,
  })), [])
  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "col0", // accessor is the "key" in the data
        width: 250,
      },
      {
        Header: "Header 1",
        accessor: "col1",
        width: 100,
      },
      {
        Header: "Header 2",
        accessor: "col2",
      },
      {
        Header: "Header 3",
        accessor: "col3",
      },
      {
        Header: "Header 4",
        accessor: "col4",
      },
      {
        Header: "Header 5",
        accessor: "col5",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, totalColumnsWidth } =
    useTable(
      // @ts-ignore
      { columns, data, defaultColumn, disableSortBy: !props.enableSorting },
      useSortBy,
      useExpanded,
      useBlockLayout
    );

    const scrollBarSize = useMemo(() => scrollbarWidth(), [])

    const RenderRow = useCallback(
      ({ index, style }) => {
        const row = rows[index]
        prepareRow(row)
        return (
          <div
            {...row.getRowProps({
              style,
            })}
            className="tr"
          >
            {row.cells.map(cell => {
              return (
                <div {...cell.getCellProps()} className="td">
                  {cell.render('Cell')}
                </div>
              )
            })}
          </div>
        )
      },
      [prepareRow, rows]
    )


  return (
    // apply the table props
    <table {...getTableProps()}>
      {!props.hideHeaders && (
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup: any) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()} className="th">
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column: any) => (
                    // Apply the header cell props
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {
                        // Render the header
                        column.render("Header")
                      }
                      {/* Add a sort direction indicator */}
                      <span>
                        {props.enableSorting ? (
                          column.isSorted ? (
                            column.isSortedDesc ? (
                              "ds"
                            ) : (
                              "as"
                            )
                          ) : (
                            ""
                          )
                        ) : null}
                      </span>
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
      )}

      {/* Apply the table body props */}
      <tbody {...getTableBodyProps()}>
      <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={50}
          width={totalColumnsWidth+scrollBarSize}
        >
          {RenderRow}
        </FixedSizeList>
      </tbody>
    </table>
  );
}

Table.defaultProps = { enableSorting: true, hideHeaders: false };