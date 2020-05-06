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
            <a-row type="flex" justify="center">
              <a-col :span="22">
                选择省份或城市
                <Cascader
                  :options="cityOfProvince"
                  placeholder="请选择省份或城市"
                  allowClear
                  :fieldNames="fieldNames"
                  change-on-select
                  @change="onChange"
                />
                <table class="list">
                  <tr><td>城市行政编码</td><td>城市名称</td><td>所属省份</td><td>城市属性</td></tr>
                  <tr
                    :key="index"
                    v-for="(item, index) in city"
                  >
                    <td>{{ item.citycode }}
                    </td>
                    <td>{{ item.cityname }}</td>
                    <td>{{ item.province }}</td>
                    <td>
                      <div>
                        <template v-for="(tag) in item.cityattributes">
                          <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
                            <a-tag :key="tag" closable @close="() => handleClose(tag, item)">
                              {{ `${tag.slice(0, 20)}...` }}
                            </a-tag>
                          </a-tooltip>
                          <a-tag v-else :key="tag" closable @close="() => handleClose(tag, item)">
                            {{ tag }}
                          </a-tag>
                        </template>
                        <a-input
                          v-if="item.inputVisible"
                          ref="input"
                          type="text"
                          size="small"
                          :style="{ width: '78px' }"
                          :value="inputValue"
                          @change="handleInputChange"
                          @blur="handleInputConfirm"
                          @keyup.enter="handleInputConfirm(item)"
                        />
                        <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput(item)">
                          <a-icon type="plus" />
                        </a-tag>
                      </div>
                    </td>
                  </tr>
                </table>
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
    <!-- <div
      class="popup"
      v-if="beChange"
    >
      <div>修改城市信息</div>
      <div>城市名{{ beChange.cityname }}</div>
      <div>城市行政编码</div>
      <div>城市所属省份</div>
      <div>是否是直辖市</div>
      <div>是否是省会城市</div>
    </div> -->
  </div>
</template>

<script>
import ChinaMap from './modules/ChinaMap'
import { mixinDevice } from '@/utils/mixin'
import { getAllCity, updateCity } from '@/api/city'
import { Cascader } from 'ant-design-vue'
// , updateCity
export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ChinaMap,
    Cascader
  },
  data () {
    return {
      loading: true,
      list: [],
      city: [],
      beChange: {},
      cityOfProvince: [],
      fieldNames: {
        value: 'citycode',
        label: 'cityname',
        children: 'children'
      },
      inputValue: ''
    }
  },
  created () {
    this.loading = !this.loading
    this.getAllCity()
  },
  methods: {
     async handleClose (removedTag, item) {
      // const tags = this.tags.filter(tag => tag !== removedTag)
      // console.log(removedTag)
      let cityattributes = item.cityattributes.filter(tag => tag !== removedTag)
      cityattributes = cityattributes.join(',')
      const param = {
        citycode: item.citycode,
        cityattributes: cityattributes
      }
      const res = await updateCity(param)
      if (res.data.code === 200) {
        this.$message.success('更新成功')
      }
      // this.tags = tags
    },

    showInput (item) {
      item.inputVisible = true
      // this.$nextTick(function () {
      //   this.$refs.input.focus()
      // })
    },

    handleInputChange (e) {
      // console.log(e)
      this.inputValue = e.target.value
    },

    async handleInputConfirm (item) {
      const inputValue = this.inputValue
      let tags = item.cityattributes
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
        // console.log(tags)
        const attributes = tags.join(',')
        const param = {
          citycode: item.citycode,
          cityattributes: attributes
      }
      const res = await updateCity(param)
      if (res.data.code === 200) {
        this.$message.success('更新成功')
      }
      }
      item.cityattributes = tags
      item.inputVisible = false
      this.inputValue = ''
      // console.log(tags);
      // Object.assign(this, {
      //   tags,
      //   inputVisible: false,
      //   inputValue: ''
      // })
    },
    closeTag (e) {
      console.log(e)
    },
    onChange (value) {
      // console.log(value)
      if (value[1]) {
       this.city = this.list.filter((item) => {
          if (item.citycode === value[1]) {
            return item
          }
      })
      } else if (value[0]) {
        this.city = this.list.filter((item) => {
          if (item.citycode.slice(0, 2) === value[0]) {
            return item
          }
      })
      } else {
        this.city = this.list
      }
    },
    async getAllCity () {
      const res = await getAllCity()
      let province = []
      if (res.data.code === 200) {
        const data = res.data.detail
        // console.log(this.list)
        data.forEach((item, index) => {
          let attributes
          if (item.cityattributes) {
           attributes = item.cityattributes.split(',')
          // console.log(attributes)
          } else {
            attributes = []
          }
          item.cityattributes = attributes
          const proItem = {
                citycode: item.citycode.slice(0, 2),
                cityname: item.province,
                children: []
              }
          province.push(proItem)
          item.inputVisible = false
        })
        this.list = data
        // console.log(this.list)
        const rs = new Map()
        province = province.filter((arr) => !rs.has(arr.citycode) && rs.set(arr.citycode, 1))
        province.forEach((pro) => {
          data.forEach((city) => {
            if (city.province === pro.cityname) {
              pro.children.push(city)
            }
          })
        })
        this.cityOfProvince = province
        this.city = data
      }
    }
  }
}
</script>

<style lang="less" scoped>
table {
  padding: 0.5rem 6rem;
  margin-top: 1rem;
  width: 100%;
  tr:first-child{
    background-color: #1890FF;
    color: #fff;
    font-weight: bold;
  }
  tr {
    td:last-child {
      width: 40%
    }
    td {
      line-height: 35px;
      display: inline-block;
      width: 20%;
      height: 35px;
      text-align: center;
      border: 1px solid #EBEDF0;
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
