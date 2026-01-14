export const convertBlockDataFromAPIToWidget = (data) => {
  if (!data.width) {
    data.width = data.outline[2] - data.outline[0];
  }
  if (!data.height) {
    data.height = data.outline[3] - data.outline[1];
  }

  const colGroup = [];
  let columnRemainPercent = 1;

  let rowRemainPercent = 1;
  let items = [];
  const rowGroup = [];

  const outline = [...data.outline];
  let columns = [];
  let rows = [];

  if (data.grid) {
    for (let i = 0; i < data.grid.columns.length; i++) {
      let item = data.grid.columns[i];

      if (i > 0) {
        item = item - data.grid.columns[i - 1];
      }

      const slice = item / data.width;
      colGroup.push(slice);
      columnRemainPercent = columnRemainPercent - slice;
    }

    colGroup.push(columnRemainPercent);

    for (let i = 0; i < data.grid.rows.length; i++) {
      let item = data.grid.rows[i];

      if (i > 0) {
        item = item - data.grid.rows[i - 1];
      }

      const slice = item / data.height;
      rowGroup.push(slice);
      rowRemainPercent = rowRemainPercent - slice;
    }

    rowGroup.push(rowRemainPercent);

    items = new Array(rowGroup.length);

    for (let x = 0; x < rowGroup.length; x++) {
      items[x] = new Array(colGroup.length);

      for (let y = 0; y < colGroup.length; y++) {
        items[x][y] = `${x}_${y}`;
      }
    }

    if (data.merged) {
      data.merged.forEach((mergedItem) => {
        // item: [[0,0], [0,1]]
        const base = mergedItem[0];

        for (let m = 1; m < mergedItem.length; m++) {
          items[mergedItem[m][0]][mergedItem[m][1]] = items[base[0]][base[1]];
        }
      });
    }

    columns = [...data.grid.columns];
    rows = [...data.grid.rows];
  }

  if (data.type) {
    const tableBorderType = data.type.split('_')[1];
    if (tableBorderType === 'borderless') {
      outline[0] = outline[0] - 2;
      outline[1] = outline[1] - 2;
      outline[2] = outline[2] + 2;
      outline[3] = outline[3] + 2;
    }
  }

  return {
    colGroup,
    rowGroup,
    items,
    outline,
    columns,
    rows,
    spanCellData: data.merged,
  };
};
