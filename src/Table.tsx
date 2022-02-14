import { tableFooterClasses } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import { Column, useBlockLayout, useExpanded, useSortBy, useTable } from "react-table";
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FixedSizeList } from 'react-window'
import update from 'immutability-helper'
import "./Table.css"

export type TableProps = {
  enableSorting?: boolean;
  hideHeaders?: boolean;
};


const DND_ITEM_TYPE = 'row'

const Row = (props: any) => {
  const { row, index, moveRow, style } = props

  const dropRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<{ index: number }, string, boolean>({
    accept: DND_ITEM_TYPE,
    hover(item, monitor) {
      if (!dropRef.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = dropRef.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) {
        return
      }
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag<any, any, { isDragging: boolean }>({
    item: { type: DND_ITEM_TYPE, index },
    type: DND_ITEM_TYPE,
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1

  preview(drop(dropRef))
  drag(dragRef)

  return (
    <div
      ref={dropRef as React.RefObject<HTMLDivElement>} style={{ opacity }}
      {...row.getRowProps({
        style,
      })}
      className="tr"
    >
      {row.cells.map((cell: any, i: number) => {
        return (
          <div ref={i === 0 ? dragRef as React.RefObject<HTMLDivElement> : null} {...cell.getCellProps()} className="td">
            {cell.render('Cell')}
          </div>
        )
      })}
    </div>
  )

}

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
  const [records, setRecords] = useState(() => Array(100).fill(null).map((item, i) => ({
    col0: `Label ${i}`,
    col1: 0.1,
    col2: Math.floor(1 + Math.random() * 25),
    col3: 2.0,
    col4: 3.1,
    col5: 4.2,
  })))
  const defaultColumn = useMemo(
    () => ({
      width: 150,
    }),
    []
  )

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
      { columns, data: records, defaultColumn, disableSortBy: !props.enableSorting },
      useSortBy,
      useExpanded,
      useBlockLayout
    );

  const scrollBarSize = useMemo(() => scrollbarWidth(), [])

  const RenderRow = useCallback(
    (data: any) => {
      console.log("cicca")
        const moveRow = (dragIndex: number, hoverIndex: number) => {
          const dragRecord = records[dragIndex]
          setRecords(
            update(records, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRecord],
              ],
            })
          )
        }
      const { index, style } = data
      const row = rows[index]
      prepareRow(row)
      return <Row
        index={index}
        row={row}
        style={style}
        moveRow={moveRow}
      />
    }
    ,
    [prepareRow, rows]
  )

  return (
    // apply the table props
    <DndProvider backend={HTML5Backend}>
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
            itemData={{ "asd": "cica" }}
            height={400}
            itemCount={rows.length}
            itemSize={50}
            width={totalColumnsWidth + scrollBarSize}
          >
            {RenderRow}
          </FixedSizeList>
        </tbody>
      </table>
    </DndProvider>
  );
}

Table.defaultProps = { enableSorting: true, hideHeaders: false };