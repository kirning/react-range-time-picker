import React, { useState } from 'react';
import './App.css';
import moment, { Moment } from 'moment'

interface IRangeTime {
  startTime: Moment;
  endTime: Moment;
}

interface IProps {
  /** 日期范围 */
  dateRange: IRangeTime;
  /** 格子高度 */
  itemHeight?: number;
  contentWidth?: number;
  /** 当选择的值发生变化时 */
  onChange?: (time: IRangeTime) => void;
  /** 定义不可选范围 */
  disabledRangeList?: IRangeTime[];
  selectedRangeList?: IRangeTime[];
  /** 当前选择的值 */
  value?: IRangeTime;
  /** 当发生错误时回调，暂时没有想到怎么用 */
  onSlectedError?: (msg: string) => void;
  /** 点击方格时回调 */
  onItemClick?: (itemData: Moment) => void;
}

interface IItem {
  isChecked: boolean;
  isSelected: boolean;
  disabled: boolean;
}
interface IRow {
  time: Moment;
  columns: IItem[];
}

const App: React.FC<IProps> = (props) => {
  let { dateRange, itemHeight = 30, onItemClick, onChange, disabledRangeList, value = { startTime: moment(), endTime: moment() }, onSlectedError, contentWidth = 800, selectedRangeList = [] } = props;
  const days = dateRange.endTime.diff(dateRange.startTime, 'day');
  const titleList: number[] = [];

  const max = 24 * 2;
  // 初始化title
  for (let i = 0; i < 25; i++) {
    titleList.push(i)
  }

  // 当前模式，是取消选择，还是选择
  const [model, setModel] = useState(true);
  const [rangeData] = useState(() => {
    // 初始化二维数组
    const rows: IRow[] = [];
    for (let i = 0; i < days; i++) {
      const rowTime = dateRange.startTime.clone().add(i, 'days').hour(0).minute(0);
      const columns = [];
      for (let x = 0; x < max; x++) {
        const column: IItem = { isChecked: false, disabled: false, isSelected: false }
        columns.push(column)
      }
      rows.push({ time: rowTime, columns });
    }
    return rows;
  })
  const [clickState, setClickState] = useState(false);

  // 判断有不可选范围的时候
  if (disabledRangeList) {
    for (let disabledRange of disabledRangeList) {
      let selectStartIndex = -1;
      let selectEndIndex = -1;
      const { startTime, endTime } = disabledRange;
      // 有初始值的时候
      let valueStartTimeStr = startTime.format('YYYY-MM-DD');
      const zeroTime = startTime.clone().hour(0).minute(0);
      for (let i = 0; i < rangeData.length; i++) {
        const timeStr = rangeData[i].time.format('YYYY-MM-DD');
        const columns = rangeData[i].columns;
        // 判断当前的时间是否初始化值的时间，如果是，则再该行初始化
        if (timeStr === valueStartTimeStr) {
          // 计算其实方块，用当前的时
          selectStartIndex = startTime.diff(zeroTime, "minute") / 30;
          selectEndIndex = endTime.diff(zeroTime, 'minute') / 30;
          for (let x = 0; x < columns.length; x++) {
            if (selectStartIndex <= x && x <= selectEndIndex) {
              rangeData[i].columns[x].disabled = true;
            }
          }
        }
      }
    }
  }
  // 已被选择的列表
  selectedRangeList.forEach(selectedRange => {
    let selectStartIndex = -1;
    let selectEndIndex = -1;
    const { startTime, endTime } = selectedRange;
    // 有初始值的时候
    let valueStartTimeStr = startTime.format('YYYY-MM-DD');
    const zeroTime = startTime.clone().hour(0).minute(0);
    for (let i = 0; i < rangeData.length; i++) {
      const timeStr = rangeData[i].time.format('YYYY-MM-DD');
      const columns = rangeData[i].columns;
      // 判断当前的时间是否初始化值的时间，如果是，则再该行初始化
      if (timeStr === valueStartTimeStr) {
        // 计算其实方块，用当前的时
        selectStartIndex = startTime.diff(zeroTime, "minute") / 30;
        selectEndIndex = endTime.diff(zeroTime, 'minute') / 30;
        for (let x = 0; x < columns.length; x++) {
          if (selectStartIndex <= x && x <= selectEndIndex) {
            rangeData[i].columns[x].isSelected = true;
          }
        }
      }
    }

  })
  // 判断有初始值的时候
  if (value) {
    let selectStartIndex = -1;
    let selectEndIndex = -1;
    const { startTime: start, endTime: end } = value;
    // 有初始值的时候
    let valueStartTimeStr = value.startTime.format('YYYY-MM-DD');
    const zeroTime = start.clone().hour(0).minute(0);
    for (let i = 0; i < rangeData.length; i++) {
      const timeStr = rangeData[i].time.format('YYYY-MM-DD');
      const columns = rangeData[i].columns;
      // 判断当前的时间是否初始化值的时间，如果是，则再该行初始化
      if (timeStr === valueStartTimeStr) {
        // 计算其实方块，用当前的时
        selectStartIndex = start.diff(zeroTime, 'minute') / 30;
        selectEndIndex = end.diff(zeroTime, 'minute') / 30;
        for (let x = 0; x < columns.length; x++) {
          if (selectStartIndex <= x && x < selectEndIndex) {
            rangeData[i].columns[x].isChecked = true;
          } else {
            rangeData[i].columns[x].isChecked = false;
          }
        }
      }
    }
  }

  /** 当选择了时间范围的时候 */
  function handleChange(rowIndex: number) {
    if (onChange) {
      let isAlSelected = false;
      let startIndex = 0;
      let endIndex = 0;
      const { time, columns } = rangeData[rowIndex];
      for (let i = 0; i < columns.length; i++) {
        const item = columns[i];
        if (!isAlSelected && item.isChecked) {
          isAlSelected = true;
          startIndex = i;
        }
        if (isAlSelected && !item.isChecked) {
          endIndex = i;
          break;
        } else if (isAlSelected && i === max - 1) {
          endIndex = i + 1;
        }
      }
      const startMinute = startIndex * 30
      const resultStartTime = time.clone().minute(startMinute);
      const endMinute = endIndex * 30
      const resultEndTime = time.clone().minute(endMinute);
      onChange({ startTime: resultStartTime, endTime: resultEndTime });
    }
  }


  return (
    <div className="range-content" style={{ width: contentWidth + "px" }}>
      <div className="range-title">
        {
          // 输出标题
          titleList.map((item, index) => {
            if (index === 0) {
              return <div key={"title" + index} className="range-title-item-time"></div>
            }
            return (
              <div key={"title" + index} className="range-title-item">{item - 1}</div>
            )
          })
        }
      </div>

      <div className="range-body">
        {
          rangeData.map((row, rowIndex) => {
            const columns = row.columns;
            return (
              <div className="range-row" key={"row" + rowIndex}>
                <div className="range-row-time">{row.time.format("YYYY-MM-DD")}</div>
                <div className="range-row-item" onMouseLeave={() => {
                  if (clickState) {
                    setClickState(false);
                    handleChange(rowIndex);
                  }
                }}>
                  {
                    columns.map((column, colIndex) => {
                      let columnClass = "range-item ";
                      if (column.disabled) {
                        columnClass += "range-item-disabled"
                      } else if (column.isSelected) {
                        columnClass += "range-item-selected";
                      } else {
                        columnClass += (column.isChecked ? " range-item-checked" : '')
                      }
                      return (
                        <div
                          style={{ height: itemHeight + "px" }}
                          key={"columns-" + colIndex}
                          className={columnClass}
                          onClick={() => {
                            if(onItemClick){
                              const colMinute = colIndex * 30;
                              const itemTime = row.time.clone().minute(colMinute);
                              onItemClick(itemTime);
                            }
                            
                          }}
                          onMouseDown={() => {
                            if (column.disabled || column.isSelected) {
                              return;
                            }
                            const rightColItem = columns[colIndex + 1];
                            const leftColItem = columns[colIndex - 1];
                            // 如果当前按下的是已选择的列，则取消选择
                            let selectedModal = !column.isChecked;
                            if (selectedModal) {
                              // 选择模式
                              let isSelected = false;
                              // 判断是否已经选择了时间，如果选择了
                              for (const r of rangeData) {
                                for (const c of r.columns) {
                                  if (c.isChecked) {
                                    isSelected = true;
                                  }
                                }
                              }
                              if (isSelected) {
                                if (colIndex === 0) {
                                  if (!rightColItem.isChecked) {
                                    return;
                                  }
                                } else if (colIndex === max - 1) {
                                  if (!leftColItem.isChecked) {
                                    return;
                                  }
                                } else {
                                  if (!rightColItem.isChecked && !leftColItem.isChecked) {
                                    return;
                                  }
                                }
                              }
                            } else {
                              // 取消模式
                              if (colIndex > 0 && colIndex < max - 1) {
                                if (rightColItem.isChecked && leftColItem.isChecked) {
                                  return;
                                }
                              }
                            }
                            setModel(selectedModal);
                            if (clickState === false) {
                              setClickState(true);
                            }
                            column.isChecked = selectedModal;
                            handleChange(rowIndex);
                          }
                          }
                          onMouseUp={() => {
                            if (clickState) {
                              setClickState(false);
                              handleChange(rowIndex);
                            }
                          }}
                          onMouseEnter={() => {
                            if (clickState) {
                              if (column.disabled || column.isSelected) {
                                // 如果进入到disabled的item则直接结束
                                setClickState(false);
                              } else {
                                column.isChecked = model;
                              }
                              handleChange(rowIndex);
                            }
                          }} />
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default App;
