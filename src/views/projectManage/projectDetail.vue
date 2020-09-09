<!--
 * @Author: your name
 * @Date: 2020-04-27 23:09:20
 * @LastEditTime: 2020-05-18 22:51:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\projectManage\projectDetail.vue
 -->
<template>
  <div class="projectDetail">
    <div class="rowbutton">
      <div class="addModel">
        <p>载入模板库</p>
        <div>
          <a-select
            placeholder="选择载入模板库"
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
      </div>
      <div>
        <a-button
          type="primary"
          @click="confirm()"
        >确认修改指标库</a-button>
        <a-button
          @click="cancel()"
        >取消</a-button>
      </div>
    </div>
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
                /></span><span>{{ item.indexid }}</span><span>{{ item.indexname }}</span></p>
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
                  @click="clickItem(itemChild.indexid)"
                  class="itemChild"
                >
                  <div>
                    <p><span>{{ itemChild.indexid }}</span><span>{{ itemChild.indexname }}</span></p>
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
              <div>{{ item.indexid }}</div>
              <div>{{ item.indexname }}</div>
            </div>
          </draggable>
        </div>
      </div>
      <div class="right">
        <div class="selected" >
          <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
            全选&nbsp;选中{{ checkNum }}项
          </a-checkbox>
          共{{ list2.length }}项
          <a-popconfirm
            title="确认删除这些指标?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="deleteList"
          >
            <a-button size="small" type="primary">删除</a-button>
          </a-popconfirm>
        </div>
        <draggable
          class="draggable"
          :list="list2"
          group="people"
          @change="log"
        >
          <div
            class="list-group-item"
            v-for="(element, index) in list2"
            :key="index"
          >
            <a-checkbox @change="onChange(element.indexid)" :checked="element.checked">
              {{ element.indexid }} {{ element.indexname }}
            </a-checkbox>
          </div>
        </draggable>
      </div>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
// import { getAllIndicators, getThirdIndicators } from '@/api/indicators'
import { getAllIndexMap, getIndexChild } from '@/api/indexMap'
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
      selectedItems: [],
      plainOptions: [],
      checkedList: [],
      indeterminate: true,
      checkAll: false,
      checkFlag: 0,
      checkNum: 0
    }
  },
  created () {
    this.getAllIndicators()
    this.getModelMapCut()
  },
  methods: {
    deleteList () {
      const data = JSON.parse(JSON.stringify(this.list2))
      const res = []
      data.forEach((item, index) => {
        if (!item.checked) {
          res.push(item)
        }
      })
      this.list2 = res
      // console.log(res)
    },
    onCheckAllChange (e) {
      this.checkFlag = this.checkFlag + 1
      if (this.checkFlag % 2 === 0) {
        this.list2.forEach((item) => {
        item.checked = false
      })
      this.checkNum = 0
      } else {
        this.list2.forEach((item) => {
        item.checked = true
      })
      this.checkNum = this.list2.length
      }
      // console.log(this.list2)
      this.indeterminate = !this.indeterminate
      this.checkAll = !this.checkAll
    },
    onChange (indexid) {
      this.list2.forEach((item) => {
        if (item.indexid === indexid) {
          item.checked = !item.checked
          if (item.checked) {
            this.checkNum += 1
          } else {
            this.checkNum -= 1
          }
        }
      })
      // console.log(this.list2)
    },
     async handleChange (selectedItems) {
      this.selectedItems = selectedItems
      const res = await getCutByCId({ cid: this.selectedItems })
      const data = res.data.detail
      let hasupdate = true
      data.forEach((item) => {
        let has = true
        this.list2.forEach((old) => {
          if (old.indexid === item.indexid) {
            has = false
          }
        })
        if (has) {
          item.checked = false
          this.list2.push(item)
          hasupdate = false
        }
      })
      if (hasupdate) {
        this.$message.info('无指标更新')
      } else {
        this.getThirdIndicators('L1')
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
    cancel () {
      this.$message.info('指标库未做更改')
      this.$router.push('/project/projectManage')
    },
    async confirm () {
     const listIndexid = []
    this.list2.forEach((item) => {
        listIndexid.push(item.indexid)
    })
    // console.log(listIndexid)
    // console.log(this.originList)
    let isEqual = true
      for (let i = 0; i < this.originList.length; i++) {
        let hasindex = false
        for (let j = 0; j < listIndexid.length; j++) {
          if (this.originList[j] === listIndexid[i]) {
            hasindex = true
          }
        }
        if (!hasindex) {
          isEqual = false
        }
      }
        if (!this.originList[0] || listIndexid.length !== this.originList.length) {
          isEqual = false
        }
      if (!isEqual) {
      this.$message.info('请稍等')
        const res = await inserCut({ cid: this.$route.query.cid,
        listIndexid: listIndexid + '' })
        if (res.data.code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.data.description)
        }
      } else {
          this.$message.info('指标库保持原状')
        }
      this.$router.push('/project/projectManage')
    },
    async clickItem (indexid) {
      this.indicators.forEach((item, index) => {
          item.children.forEach((child, i) => {
            child.hasClick = false
            if (child.indexid === indexid) {
            child.hasClick = true
            this.getThirdIndicators(child.indexid)
          }
          })
        })
    },
    async getThirdIndicators (indexid) {
      const param = indexid + 'A_'
      const res = await getIndexChild({ param })
      // console.log(res)
      if (res.data.code === 200) {
        const data = res.data.detail
        this.list2.forEach(item => {
          data.forEach((map, index) => {
            if (item.indexid === map.indexid) {
              data.splice(index, 1)
            }
          })
        })
        this.thirdIndicators = data
        this.thirdIndicators.forEach((item) => {
          item.checked = false
        })
      }
    },
    async getAllIndicators () {
      if (this.$route.query.cid) {
        const cid = +this.$route.query.cid
        const res2 = await getCutByCId({ cid })
        if (res2.data.code === 200) {
          // console.log(res2.data.detail)
          const list2 = res2.data.detail
          list2.forEach((item) => {
            item.checked = false
          })
          this.list2 = list2
          const originList = []
          this.list2.forEach((item) => {
        originList.push(item.indexid)
    })
        this.originList = originList
          // this.orginList = JSON.parse(JSON.stringify(this.list2))
          // console.log(this.list2)
        }
      }
      const res = await getAllIndexMap()
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
            this.getThirdIndicators(child.indexid)
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
  .rowbutton {
    background-color: #fff;
    display: flex;
    padding: 2rem 1.5rem 0;
    align-items: center;
    justify-content: space-between;
    height: 5rem;
    .addModel{
      display: flex;
      align-items: center;
      p{
        text-align: center;
        margin: 0;
        vertical-align: middle;
        height: 100%;
        margin-right: 0.5rem;
      }
      div{
        width: 200px;
      }
    }
  //   .confirm {
  //   // width: 100%;
  //   background-color: #1890ff;
  //   height: 100%;
  // }
  }
  .row {
    background-color: #fff;
    display: flex;
    padding: 1rem 1.5rem;
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
      .draggable{
        width: 100%;
        height: 95%;
      }
      .selected{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.3rem 0.5rem;
      }
      .list-group-item {
        display: flex;
        border: 1px solid;
        padding: 0.2rem 0.4rem;
      }
    }
  }
}
</style>
