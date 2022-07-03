<template>
    <uni-popup ref="popup" type="bottom">
        <div class="date-time-picker">
            <view class="time-picker-tool JRound500">
                <view class="cancel-btn" @tap="close">
                    <text>取消</text>
                </view>

                <view class="tool-title">
                    <slot name="title">
                        <text>选择出生日期</text>
                    </slot>
                </view>

                <view class="confirm-btn" @tap="confirm">
                    <text>确定</text>
                </view>
            </view>

            <picker-view
                class="picker-view"
                :indicator-class="indicatorClass"
                :value="dateTime"
                @change="dateTimePickerChange"
            >
                <div class="select_column"></div>
				<picker-view-column class="pick_view_column" data-id='year' v-if='isShowYear'>
					<view class="item" :class="{active_picker_item: years[dateTime[0]] === item}" v-for="(item, index) in years" :key="index">{{item}}</view>
				</picker-view-column>

				<picker-view-column class="pick_view_column" style="margin-left: 200rpx;" data-id='month' v-if='isShowMonth'>
					<view class="item" :class="{active_picker_item: months[dateTime[1]] === item}" v-for="(item, index) in months" :key="index">{{item}}</view>
				</picker-view-column>

				<picker-view-column class="pick_view_column" data-id='day' v-if='isShowDay'>
					<view class="item" :class="{active_picker_item: days[dateTime[2]] === item}" v-for="(item, index) in days" :key="index">{{item}}</view>
				</picker-view-column>
            </picker-view>
        </div>
    </uni-popup>
</template>

<script>
import {
    getOneMonthDays,
    getTimeArray,
    addZero,
    getIndexOfArray
} from './uitls/util.js'
export default {
    name: 'jp-timePicker',
    props: {
        startYear: {
            type: Number,
            default: 1970
        },
        endYear: {
            type: Number,
            default: new Date().getFullYear()
        },
        datestring: {
            type: String,
            default: ''
        },
        datestype: {
            type: String,
            default: 'date'
        },
        indicatorClass: {
            type: String,
            default: 'selected_column'
        },
    },
    data () {
        return {
            formatDateArrays: [],
            dateTime: [],
            days: [],
            type: '',
        }
    },
    watch: {
        datestype () {
            this.type = this.datestype
        },
        indicatorStyle (val) {
            this.getIndicatorStyle();
        },
        type () {
            this.initDateTime()
        },
        datestring: {
            immediate: true,
            handler () {
                this.initDateTime()
            }
        },
    },
    computed: {
        years () {
            return this.initTimeData(this.endYear, this.startYear);
        },
        isShowYear () {
            return this.type !== 'time' && this.type !== 'hour-minute';
        },
        months () {
            return this.initTimeData(12, 1);
        },
        isShowMonth () {
            return this.type !== 'year' && this.type !== 'time' && this.type !== 'hour-minute';
        },
        isShowDay () {
            return this.type === 'date' || this.type === 'datetime' || this.type === 'datetime-all';
        },
        hours () {
            return this.initTimeData(23, 0);
        },
        isShowHour () {
            return this.type !== 'date' && this.type !== 'year-month' && this.type !== 'year';
        },
        minutes () {
            return this.initTimeData(59, 0);
        },
        isShowMinute () {
            return this.type !== 'date' && this.type !== 'year-month' && this.type !== 'year';
        },
        seconds () {
            return this.initTimeData(59, 0);
        },
        isShowSecond () {
            return this.type === 'datetime-all' || this.type === 'time';
        }
    },
    methods: {
        confirm () {
            this.formatDate();
            this.close();
        },
        open () {
            this.$refs.popup.open()
            this.initDateTime()
        },
        close () {
            this.$refs.popup.close()
        },
        initDateTime () {
            let value;
            if (this.datestring.length > 0) {
                if (this.type === 'year') {
                    value = new Date(this.datestring, 0);
                } else if (this.type === 'time' || this.type === 'hour-minute') {
                    let date = new Date();
                    let ary = this.datestring.split(':');
                    ary.forEach((item, index) => {
                        if (index == 0) {
                            date.setHours(item)
                        } else if (index == 1) {
                            date.setMinutes(item)
                        } else if (index == 2) {
                            date.setSeconds(item)
                        }
                    })
                    value = date;
                } else {
                    value = new Date(this.datestring.replace(/-/g, '/'));
                }


            } else {
                value = new Date();
            }

            let len, timeArray, index;
            let array = getTimeArray(value);
            let [year, month, day, hour, minute, second] = array;
            this.days = this.initTimeData(getOneMonthDays(year, month - 1), 1);
            let names = ['year', 'month', 'day', 'hour', 'minute', 'second'];
            switch (this.type) {
                case "date":
                    len = 3;
                    break;
                case "year-month":
                    len = 2;
                    break;
                case "year":
                    len = 1;
                    break;
                case "datetime":
                    len = 5;
                    break;
                case "datetime-all":
                    len = 6;
                    break;
                case "time":
                    len = 3;
                    break;
                case "hour-minute":
                    len = 2;
                    break;
            }
            timeArray = new Array(len).fill(0);
            if (this.type === 'time' || this.type === 'hour-minute') {
                names = names.slice(3);
                array = array.slice(3);
            }
            timeArray = timeArray.map((item, index) => {
                const name = names[index];
                return getIndexOfArray(array[index], this[name + 's'])
            })
            this.$nextTick(() => {
                setTimeout(() => {
                    this.dateTime = timeArray;
                    if (this.type === 'date' || this.type === 'year-month' || this.type === 'year') {
                        this.formatDateArrays = this.dateTime.map((item, index) => {
                            return this[names[index] + 's'][item] < 10 ? addZero(this[names[index] + 's'][item]) : this[names[index] + 's'][item];
                        })
                    }
                }, 500)
            })
        },
        initTimeData (end, start) {
            let timeArray = [];
            while (start <= end) {
                timeArray.push(+start);
                start++;
            }
            return timeArray;
        },
        formatDate () {
            let names = ['year', 'month', 'day', 'hour', 'minute', 'second'];
            let dateString, formatDateArray = [];
            if (this.type === 'date' || this.type === 'year-month' || this.type === 'year') {
                formatDateArray = this.dateTime.map((item, index) => {
                    return this[names[index] + 's'][item] < 10 ? addZero(this[names[index] + 's'][item]) : this[names[index] + 's'][item];
                })
                dateString = formatDateArray.join('-');
            }
            this.$emit('change', dateString)
        },
        dateTimePickerChange (e) {
            let columns = e.target.value;
            if (this.type === 'date' || this.type === 'datetime' || this.type === 'datetime-all') {
                this.dateTime.splice(0, 1, columns[0]);
                if (columns[0] != this.dateTime[0]) {
                    this.days = this.initTimeData(getOneMonthDays(this.years[this.dateTime[0]], this.months[this.dateTime[1]]), 1);
                    if (this.dateTime[1] == 1) {
                        if (this.dateTime[2] === this.days.length - 1) {
                            if (getOneMonthDays(this.years[columns[0]], this.dateTime[1]) < getOneMonthDays(this.years[this.dateTime[0]], this.dateTime[1])) {
                                this.dateTime.splice(2, 1, this.days.length - 1)
                            }
                        }
                    }
                } else {
                    this.dateTime.splice(1, 1, columns[1]);
                    this.days = this.initTimeData(getOneMonthDays(this.years[this.dateTime[0]], this.dateTime[1]), 1);
                    if (columns[1] != this.dateTime[1]) {
                        if (this.dateTime[1] == 1) {
                            if (this.dateTime[2] === this.days.length - 1) {
                                if (getOneMonthDays(this.years[columns[0]], this.dateTime[1]) < getOneMonthDays(this.years[this.dateTime[0]],
                                    this.dateTime[1])) {
                                    this.dateTime.splice(2, 1, this.days.length - 1)
                                }
                            }
                        } else {
                            if (this.dateTime[2] > this.days.length - 1) {
                                this.dateTime.splice(2, 1, this.days.length - 1)
                            } else {
                                this.dateTime.splice(2, 1, columns[2])
                            }
                        }
                    } else {
                        this.dateTime.splice(2, 1, columns[2])
                    }
                }
                if (columns.length > 2) {
                    columns.splice(3).forEach((column, index) => {
                        this.dateTime.splice(index + 3, 1, column);
                    })
                }
            } else {
                columns.forEach((column, index) => {
                    this.dateTime.splice(index, 1, column);
                })
            }

            let names = ['year', 'month', 'day', 'hour', 'minute', 'second'];
            this.formatDateArrays = [];
            if (this.type === 'date' || this.type === 'year-month' || this.type === 'year') {
                this.formatDateArrays = this.dateTime.map((item, index) => {
                    return this[names[index] + 's'][item] < 10 ? addZero(this[names[index] + 's'][item]) : this[names[index] + 's'][item];
                })
            }
        },
    },
    mounted () {
        this.type = this.datestype
        this.initDateTime();
    },
    onUnload () { },
}
</script>

<style lang='scss' scoped>
.date-time-picker {
    border-radius: 66rpx 66rpx 0 0;
    height: 618rpx;
    padding-top: 35rpx;
    background-color: #fff;
    display: flex;
    flex-direction: column;

    .time-picker-tool {
        height: 80rpx;
        padding: 0 50rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;

        .cancel-btn {
            font-size: 32rpx;
            line-height: 37rpx;
            box-sizing: border-box;
            color: #626262;
        }

        .tool-title {
            font-weight: 500;
            font-size: 36rpx;
            line-height: 42rpx;
            max-width: 50%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .confirm-btn {
            font-size: 32rpx;
            line-height: 37rpx;
            box-sizing: border-box;
            color: var(--base-color-primary);
        }
    }

    .picker-view {
        position: relative;
        padding: 0 87rpx;
        height: 100%;
        flex: 1;

        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36rpx;
            color: #81818A;
        }
    }
}

	.active_picker_item {
		color: var(--base-color-primary)!important;
	}

	/* 选中样式 */
    /deep/ .select_column {
        position: absolute;
        top: 50%;
        width: 720rpx;
        height: 34px;
        margin-left: 15rpx;
        transform: translateY(-50%);
		border-top: 2rpx solid #E9EDF3;
		border-bottom: 2rpx solid #E9EDF3;
		font-family: JRound500;
		font-size: 40rpx;
		&::before {
            border: none;
        }
        &::after {
            border: none;
        }
    }
</style>
