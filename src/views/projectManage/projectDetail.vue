<!--
 * @Author: your name
 * @Date: 2020-04-27 23:09:20
 * @LastEditTime: 2020-05-06 17:09:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\projectManage\projectDetail.vue
 -->
<template>
  <div class="projectDetail">
    <div>
      <p>载入模板库</p>
      <a-select
        placeholder="选择载入模板"
        :value="selectedItems"
        :defaultActiveFirstOption="false"
        style="width: 100%"
        @change="handleChange"
      >
        <a-select-option
          v-for="item in modelIndicators"
          :key="item.cid"
          :value="item.cid"
        >
          {{ item.cname }}
        </a-select-option>
      </a-select>
    </div>
    <div
      class="confirm"
      style="cursor:pointer"
      @click="confirm()"
    >确定</div>
    <div class="row">
      <div class="contain">
        <div
          class="left"
          v-if="this.indicators"
        >
          <div
            class="allIndicators"
            v-for="(item,index) in indicators"
            :key="index"
          >
            <div
              @click="item.rotate=!item.rotate"
              class="firstIndicators"
              :class="[item.rotate ? 'rotate':'']"
            >
              <p><span>
                <a-icon
                  type="down"
                  :rotate="item.rotate ? 0 : -90"
                  style="fontSize:0.8rem"
                /></span><span>{{ item.id }}</span><span>{{ item.name }}</span></p>
            </div>
            <div v-if="item.rotate">
              <div
                class="itemChild"
                style="color:blue"
              >
              </div>
              <div
                v-for="(itemChild, i) in item.children"
                :key="i"
              >
                <div
                  :style="[{backgroundColor: itemChild.hasClick ? '#1890FF' : ''}]"
                  @click="clickItem(itemChild.id)"
                  class="itemChild"
                >
                  <div>
                    <p><span>{{ itemChild.id }}</span><span>{{ itemChild.name }}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="list-group">
          <div
            class="nodata"
            v-if="!thirdIndicators[0]"
          >
            暂无数据
          </div>
          <draggable
            :list="thirdIndicators"
            group="people"
            @change="log"
          >
            <div
              class="thirdIndicators"
              v-for="(item, index) in thirdIndicators"
              :key="index"
            >
              <div>{{ item.id }}</div>
              <div>{{ item.name }}</div>
            </div>
          </draggable>
        </div>
      </div>
      <draggable
        class="right"
        :list="list2"
        group="people"
        @change="log"
      >
        <div
          class="list-group-item"
          v-for="(element, index) in list2"
          :key="index"
        >
          <a-checkbox @change="onChange(element.id)">
            {{ element.id }} {{ element.name }}
          </a-checkbox>
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getAllIndicators, getThirdIndicators } from '@/api/indicators'
import { getCutByCId, inserCut } from '@/api/cut'
import { getModelMapCut } from '@/api/mapCut'

export default {
  name: 'TwoLists',
  display: 'Two Lists',
  order: 1,
  components: {
    draggable
  },
  data () {
    return {
      list1: [],
      list2: [],
      indicators: [],
      thirdIndicators: [],
      originList: [],
      modelIndicators: [],
      selectedItems: []
    }
  },
  created () {
    this.getAllIndicators()
    this.getModelMapCut()
  },
  methods: {
    onChange (id) {
      console.log('checked = ', id)
    },
     async handleChange (selectedItems) {
      this.selectedItems = selectedItems
      const res = await getCutByCId({ cid: this.selectedItems })
      const data = res.data.detail
      let hasupdate = true
      data.forEach((item) => {
        let has = true
        this.list2.forEach((old) => {
          if (old.id === item.id) {
            has = false
          }
        })
        if (has) {
          this.list2.push(item)
          hasupdate = false
        }
      })
      if (hasupdate) {
        this.$message.info('无指标更新')
      }
    },
    async getModelMapCut () {
      const res = await getModelMapCut({ cmodel: '1' })
      res.data.detail.forEach((item, index) => {
        if (item.cid === +this.$route.query.cid) {
          res.data.detail.splice(index, 1)
        }
      })
      this.modelIndicators = res.data.detail
    },
    async confirm () {
     const listIndexid = []
    this.list2.forEach((item) => {
        listIndexid.push(item.id)
    })
      const res = await inserCut({ cid: this.$route.query.cid,
        listIndexid: listIndexid + '' })
        if (res.data.code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.data.description)
        }
      // this.$router.push('/project/projectManage')
    },
    async clickItem (id) {
      this.indicators.forEach((item, index) => {
          item.children.forEach((child, i) => {
            child.hasClick = false
            if (child.id === id) {
            child.hasClick = true
            this.getThirdIndicators(child.id)
          }
          })
        })
    },
    async getThirdIndicators (id) {
      const res = await getThirdIndicators({ param: id })
      // console.log(res)
      if (res.data.code === 200) {
        const data = res.data.detail
        this.list2.forEach(item => {
          data.forEach((map, index) => {
            if (item.id === map.id) {
              data.splice(index, 1)
            }
          })
        })
        this.thirdIndicators = data
      }
    },
    async getAllIndicators () {
      if (this.$route.query.cid) {
        const cid = +this.$route.query.cid
        const res2 = await getCutByCId({ cid })
        if (res2.data.code === 200) {
          // console.log(res2.data.detail)
          const list2 = res2.data.detail
          this.list2 = list2
          this.orginList = JSON.parse(JSON.stringify(this.list2))
        }
      }
      const res = await getAllIndicators()
      if (res.data.code === 200) {
        const data = res.data.detail
        data.forEach((item, index) => {
          item.rotate = false
          if (index === 0) {
            item.rotate = true
          }
          item.children.forEach((child, i) => {
            child.hasClick = false
            if (i === 0 && index === 0) {
            child.hasClick = true
            this.getThirdIndicators(child.id)
          }
          })
        })
        this.indicators = data
        // console.log(this.indicators)
      }
    },
    add: function () {
      this.list.push({ name: 'Juan' })
    },
    replace: function () {
      this.list = [{ name: 'Edgard' }]
    },
    clone: function (el) {
      return {
        name: el.name + ' cloned'
      }
    },
    log: function (evt) {
      window.console.log(evt)
    }
  }
}
</script>

<style lang="less" scoped>
.projectDetail {
  text-align: center;
  .row {
    background-color: #fff;
    display: flex;
    padding: 2rem 1.5rem;
    .contain {
      margin-right: 1rem;
      display: flex;
      width: 60%;
      .left {
        border-radius: 0.5rem;
        .allIndicators {
          // background-color: gray;
          width: 150px;
          .firstIndicators {
            background-color: #fafafa;
            cursor: pointer;
            height: 3rem;
            border: 1px solid #dadada;
            // padding-left: 0.5rem;
            overflow: hidden;
            p {
              margin-bottom: 0;
              line-height: 3rem;
              font-size: 1rem;
              span {
                cursor: pointer;
                margin: 0 0.2rem;
                z-index: 1000;
                text-align: right;
                font-weight: bolder;
              }
            }
          }
          .itemChild {
            width: 100%;
            cursor: pointer;
            border: 1px solid #dadada;
            // padding-left: 0.5rem;
            vertical-align: middle;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .del {
              margin-right: 0.5rem;
            }
            div {
              p {
                margin-bottom: 0;
                line-height: 2.5rem;
                span:first-child {
                  font-weight: bolder;
                }
                span {
                  margin: 0 0.5rem;
                }
              }
            }
          }
          .hasClick {
            background-color: #52c41a;
          }
        }
        .add {
          background-color: #fafafa;
          cursor: pointer;
          height: 3rem;
          border: 1px solid #dadada;
          padding-left: 0.5rem;
          p {
            margin-bottom: 0;
            line-height: 3rem;
            font-size: 1.2rem;
            font-weight: 500;
            span {
              cursor: pointer;
              z-index: 1000;
              text-align: right;
            }
          }
        }
      }
      .list-group {
        width: 72%;
        // height: 100%;
        border: 1px solid;
        .nodata {
          margin-top: 5rem;
          font-size: 20px;
          color: blue;
        }
        .thirdIndicators {
          display: flex;
          border: 1px solid;
          div {
            margin-right: 0.3rem;
          }
        }
      }
    }
    .right {
      width: 50%;
      // background-color: #dadada;
      border: 1px solid;
      .list-group-item {
        display: flex;
        border: 1px solid;
        div {
          margin-right: 0.3rem;
          color: #fff;
        }
      }
    }
  }
  .confirm {
    // width: 100%;
    background-color: #1890ff;
  }
}
</style>
