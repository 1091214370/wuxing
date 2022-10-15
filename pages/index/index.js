import {formatTime} from '../../utils/util';

const DATAH = [];
for (let i = 0; i< 24; i++) {
  DATAH.push({value: i, label: `${i}点`})
}
Page({
  data: {
    valueDate: formatTime(new Date()),
    valueH: '0',
    res: {},
    dataH: DATAH,
  },

  onLoad() {
    this.echart =this.selectComponent('#mychart');
  },

  handleDate(e) {
    this.setData({
      valueDate: e.detail.value,
    })
  },
  handleHour(e) {
    this.setData({
      valueH: e.detail.value,
    })
  },
  handleScle() {
    const { valueDate, valueH } = this.data;
    wx.redirectTo({
      url: `/pages/wuxingres/index?valueDate=${valueDate}&valueH=${valueH}&flag=1`,
    })
  },
})
