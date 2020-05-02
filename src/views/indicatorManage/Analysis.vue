<template>
  <div class="page-header-index-wide">
    <a-card
      :loading="loading"
      :bordered="false"
      :body-style="{padding: '0'}"
    >
      <div class="salesCard">
        <a-tabs
          default-active-key="1"
          size="large"
          :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}"
        >
          <a-tab-pane
            tab="表格"
            key="1"
            loading="true"
          >
            <a-row>
              <a-col>
                <ul class="list">
                  <li><span>城市行政编码</span><span>城市名称</span><span>所属省份</span><span>城市属性</span><span>修改</span></li>
                  <li
                    :key="index"
                    v-for="(item, index) in list"
                  >
                    <span>{{ item.citycode }}
                    </span>
                    <span>{{ item.cityname }}</span>
                    <span>{{ item.province }}</span>
                    <span>{{ item.cityattributes || '无' }}</span>
                    <span @click="changeCity(item)">修改</span>
                  </li>
                </ul>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane
            tab="地图"
            key="2"
          >
            <a-row>
              <a-col
                :xl="16"
                :lg="12"
                :md="12"
                :sm="24"
                :xs="24"
              >
                <ChinaMap />
              </a-col>
              <!-- <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="门店销售排行榜" :list="rankList"/>
              </a-col> -->
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <div class="popup" v-if="beChange">
      <div>修改城市信息</div>
      <div>城市名{{ beChange.cityname }}</div>
      <div>城市行政编码</div>
      <div>城市所属省份</div>
      <div>是否是直辖市</div>
      <div>是否是省会城市</div>
    </div>
  </div>
</template>

<script>
import ChinaMap from './modules/ChinaMap'
import { mixinDevice } from '@/utils/mixin'
import { getAllCity } from '@/api/city'

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChinaMap
  },
  data () {
    return {
      loading: true,

      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      },
      list: [],
      beChange: {},
      province: [],
      city: []
    }
  },
  created () {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.getAllCity()
  },
  methods: {
    changeCity (item) {
      this.beChange = item
    },
    async getAllCity () {
      const res = await getAllCity()
      if (res.data.code === 200) {
        this.list = res.data.detail
        // console.log(this.list)
        this.list.forEach((item, index) => {
          this.province.push(item.province)
        })
        this.province = [...new Set(this.province)]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.list {
  padding: 0.5rem 3rem;
  li {
    list-style-type: none;
    span {
      display: inline-block;
      width: 15%;
      text-align: center;
      border: 1px solid;
    }
  }
}
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
</style>
