import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import moment from 'moment';

const Body: React.FC = (props) => {
    const disabledRangeList = [
        {
            startTime: moment("2019-11-10").hour(1).minute(0),
            endTime: moment("2019-11-10").hour(2).minute(30)
        },
        {
            startTime: moment("2019-11-9").hour(1).minute(0),
            endTime: moment("2019-11-9").hour(2).minute(30)
        }
    ];
    const [time, setTime] = useState({ startTime: moment().hour(1).minute(0), endTime: moment().hour(3).minute(0) })
    return (
        <div>
            <h1>时间范围选择器Demo</h1>
            <div style={{ width: '800px' }}>
                <App
                    contentWidth={1000}
                    dateRange={{ startTime: moment(), endTime: moment().add(3, 'day') }}
                    value={{ startTime: time.startTime, endTime: time.endTime }}
                    disabledRangeList={disabledRangeList}
                    onChange={({ startTime, endTime }) => {
                        setTime({ startTime, endTime })
                    }} />
            </div>
            <div>
                <div>start:{time.startTime.format("YYYY-MM-DD HH:mm:ss")}</div>
                <div>end:{time.endTime.format("YYYY-MM-DD HH:mm:ss")}</div>
            </div>
            <button onClick={() => {
                setTime({ startTime: moment(), endTime: moment() })
            }}>清空</button>
            <ul>
                <li>1. 必须要把现有的清除掉，才能选择其他的时间断</li>
                <li>2. 可以继续选择，但是必须在已选的范围附近</li>
                <li>3. 不支持跨时间断选择</li>
                <li>4. 清空只需要把开始时间和结束时间设为一样就可以了</li>
                <li>5. 参数看注释</li>

            </ul>
        </div>
    )
}

ReactDOM.render(<Body />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
