import calendarFormatter from '../../utils/calendarFormatter';
import * as echarts from '../../components/ec-canvas/echarts';

const G = ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
const Z = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
const SGZ = [
  Z.map((z, i) => `${G[i > 9 ? i - 9 : i]}${z}`),
  Z.map((z, i) => `${G[i > 7 ? i - 8 : i + 2]}${z}`),
  Z.map((z, i) => `${G[i > 5 ? i - 6 : i + 4]}${z}`),
  Z.map((z, i) => `${G[i > 3 ? i - 4 : i + 6]}${z}`),
  Z.map((z, i) => `${G[i > 1 ? i - 2 : i + 8]}${z}`),
];

const DATAH = [];
for (let i = 0; i< 24; i++) {
  DATAH.push({value: i, label: `${i}点`})
}
Page({
  data: {
    valueDate: undefined,
    valueH: undefined,
    flag: false,
    pengyouquan: false,
    res: {},
    dataH: DATAH,
    wuxing: {
      jin: 0,
      mu: 0,
      shui: 0,
      huo: 0,
      tu: 0,
    },
    ec: {
      lazyLoad: true,
    },
    allColors: [
      'rgb(130,57,53)',
      'rgb(137,190,178)',
      'rgb(201,186,131)',
      'rgb(222,211,140)',
      'rgb(222,156,83)',
      'rgb(159,125,80)',
      'rgb(17,63,61)',
      'rgb(60,79,57)',
      'rgb(98,92,51)',
      'rgb(179,214,110)',
    ],
  },

  onLoad(e) {
    const { valueDate, valueH, flag, pengyouquan } = e;
    this.setData({valueDate, valueH, flag: flag === '1', pengyouquan: pengyouquan === '1' });
  },

  onShow(){
    this.echart =this.selectComponent('#mychart');
    this.handleScle();
  },

  onShareAppMessage() {
    const { valueDate, valueH } = this.data;
    const promise = new Promise(resolve => {
        resolve({
          title: '这是我的八字与五行分布',
          path: `/pages/wuxingres/index?valueDate=${valueDate}&valueH=${valueH}`,
        })
    });
    return {
      title: '我的八字与五行分布',
      path: `/pages/wuxingres/index?valueDate=${valueDate}&valueH=${valueH}`,
      promise 
    }
  },
  onShareTimeline() {
    const { valueDate, valueH } = this.data;
    return {
      title: '我的八字与五行分布',
      query: `valueDate=${valueDate}&valueH=${valueH}&pengyouquan=1`,
    }
  },
  
  handleScle() {
    const { valueDate, valueH } = this.data;
    const temp = valueDate.split('-');
    const v = calendarFormatter.solar2lunar(temp[0],temp[1],temp[2]);
    const d = v.gzDay[0];
    const i =  G.indexOf(d);
    const r = i > 4 ? i - 5 : i;
    const h = Math.floor((Number(valueH) + 1) / 2);
    v.gzHour = SGZ[r][h > 0 && h < 12 ? h : 0];
    const wuxing = this.getWuxing(v);
    this.initChart(wuxing);
    this.setData({
      res: v,
      wuxing,
    });
  },
  getWuxing(v) {
    const wuxing = [...`${v.gzYear}${v.gzMonth}${v.gzDay}${v.gzHour}`];
    const res = {
      jin: 0,
      mu: 0,
      shui: 0,
      huo: 0,
      tu: 0,
    };
    wuxing.forEach(i => {
      switch (true) {
        case '庚辛申酉'.indexOf(i) > -1:
          res.jin += 1;
          break;
        case '甲乙寅卯'.indexOf(i) > -1:
          res.mu += 1;
          break;
        case '壬癸亥子'.indexOf(i) > -1:
          res.shui += 1;
          break;
        case '丙丁巳午'.indexOf(i) > -1:
          res.huo += 1;
          break;
        case '戊己辰戌丑未'.indexOf(i) > -1:
          res.tu += 1;
          break;
      }
    });
    return res;
  },
  goback() {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  /**设置图表映射 */
  initChart: function(wuxing) {
    const option = {
      series: [
        {
          name: 'Area Mode',
          type: 'pie',
          radius: [20, 140],
          center: ['50%', '60%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 5
          },
          data: [
            { value: wuxing.jin, name: '金' },
            { value: wuxing.mu, name: '木' },
            { value: wuxing.shui, name: '水' },
            { value: wuxing.huo, name: '火' },
            { value: wuxing.tu, name: '土' },
          ]
        }
      ]
    };
    //echarts会继承父元素的宽高,所以我们一定要设置echarts组件父元素的高度。
    this.echart.init((canvas) => {
      const chart = echarts.init(canvas, null, {
        width: 400,
        height: 400,
        devicePixelRatio: 2,
      });
      //给echarts 设置数据及配置项（图表类型、数据量等）
      chart.setOption(option);
      return chart;
    });
  },

})
