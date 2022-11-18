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
    // 在页面中定义插屏广告
let interstitialAd = null

// 在页面onLoad回调事件中创建插屏广告实例
if (wx.createInterstitialAd) {
  interstitialAd = wx.createInterstitialAd({
    adUnitId: 'adunit-a4fab2c7a6cb6510'
  })
  interstitialAd.onLoad(() => {})
  interstitialAd.onError((err) => {})
  interstitialAd.onClose(() => {})
}

// 在适合的场景显示插屏广告
if (interstitialAd) {
  interstitialAd.show().catch((err) => {
    console.error(err)
  })
}
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
