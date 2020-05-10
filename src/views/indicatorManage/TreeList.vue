<!--
 * @Author: your name
 * @Date: 2020-04-26 17:53:50
 * @LastEditTime: 2020-05-09 21:55:55
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\indicatorManage\TreeList.vue
 -->
<template>
  <div>
    <a-card :bordered="false">
      <!-- <h1>指标库</h1> -->
      <a-row :gutter="8">
        <a-col :span="5">
          <div
            class="contain"
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
                  <div><p @click="addIndex(2, index)">
                    <a-icon type="plus" />&nbsp;添加新指标</p>
                  </div>
                </div>
                <div
                  v-for="(itemChild, i) in item.children"
                  :key="i"
                >
                  <div
                    :style="[{backgroundColor: itemChild.hasClick ? '#1890FF' : ''}]"
                    @click="clickItem(itemChild)"
                    class="itemChild"
                  >
                    <div><p><span>{{ itemChild.indexid }}</span><span>{{ itemChild.indexname }}</span></p>
                    </div>
                    <div class="del">
                      <a-popconfirm
                        title="确认要删除这个指标吗?"
                        @confirm="ok(itemChild.indexid)"
                        okText="确认"
                        cancelText="取消"
                      ><a-icon
                        type="close-circle"
                        style="fontSize:18px;cursor: pointer;"
                      />
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col :span="19">
          <div v-if="thirdIndicators">
            <div class="thirdIndicators">
              <div
                style="cursor: pointer;color:blue;"
                @click="addIndex(3)"
              >
                <a-icon type="plus" />&nbsp;添加新指标</div>
            </div>
            <div
              class="thirdIndicators"
              v-for="(item, index) in thirdIndicators"
              :key="index"
            >
              <a-tooltip placement="top">
                <template slot="title">
                  <span>{{ item.indexdescribe }}</span>
                </template>
                <div>
                  <p><span>{{ item.indexid }}</span><span>{{ item.indexname }}</span></p>
                </div>
              </a-tooltip>
              <div>
                <span>
                  <a-button
                    type="primary"
                    @click="changeIndexMap(item)"
                  >修改</a-button>
                </span>
                <span>
                  <a-popconfirm
                    title="确认要删除这个指标吗?"
                    @confirm="ok(item.indexid)"
                    okText="确认"
                    cancelText="取消"
                  >
                    <a-icon
                      type="close-square"
                      style="fontSize:25px;color:blue;cursor: pointer;"
                    />
                  </a-popconfirm>
                </span>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>

      <!-- <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" /> -->

    </a-card>
    <a-modal
      title="指标信息"
      v-model="isShow"
      :footer="null"
      closable
      destroyOnClose
    >
      <div><span>指标名称（必填）</span>
        <a-input
          v-model="indexname"
          placeholder="请输入指标名称"
        />
      </div>
      <div style="margin: 20px 0;"><span>指标描述</span>
        <a-input
          v-model="indexdescribe"
          placeholder="请输入指标描述"
        />
      </div>
      <div style="display: flex; justifyContent: space-around">
        <a-button
          type="primary"
          style="width: 100px;"
          @click="confirm"
        >确定</a-button>
        <a-button
          style="width: 100px;"
          @click="cancel"
        >取消</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import OrgModal from './modules/OrgModal'
// import { getOrgTree, getServiceList } from '@/api/manage'
// import { getAllIndicators, getThirdIndicators } from '@/api/indicators'
import { getAllIndexMap, insertIndexMap, updateIndexMap, deleteIndexMap } from '@/api/indexMap'
// ,  getIndexChild, getAllIndexMap,updateIndexMap,deleteIndexMap
export default {
  name: 'TreeList',
  components: {
    STable,
    STree,
    OrgModal
  },
  data () {
    return {
      indicators: [],
      rotate: false,
      thirdIndicators: [],
      isShow: false,
      indexname: '',
      indexdescribe: '',
      indexlevel: 1,
      indexid: '',
      modalType: -1 // 1是插入，2是更新
    }
  },
  created () {
    // this.getAllIndicators()
    this.getAllIndexMap()
  },
  watch: {
  },
  methods: {
    async ok (param) {
      if (param.length < 6) {
        param = param + '%'
      }
      const res = await deleteIndexMap({ param })
      if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.getAllIndexMap()
          this.thirdIndicators = []
        } else {
          this.$message.error('指标已被模型使用，不能删除')
        }
    },
    changeIndexMap (item) {
      this.indexname = ''
      this.indexdescribe = ''
      this.indexname = item.indexname
      this.indexdescribe = item.indexdescribe
      this.indexid = item.indexid
      this.indexlevel = item.indexlevel
      this.modalType = 2
      this.isShow = true
    },
    async confirm () {
      if (this.indexname) {
      this.isShow = false
      if (this.modalType === 1) {
        const param = {
        indexid: this.indexid,
        indexname: this.indexname,
        indexlevel: this.level,
        indexdescribe: this.indexdescribe
      }
        const res = await insertIndexMap(param)
      this.$message.info('添加成功')
      sessionStorage.setItem('beClick', res.data.detail.indexid.slice(0, 4))
      // console.log(res)
      } else if (this.modalType === 2) {
        const param1 = {
        indexid: this.indexid,
        indexname: this.indexname,
        indexdescribe: this.indexdescribe
      }
        const res = await updateIndexMap(param1)
        if (res.data.code === 200) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.data.description)
        }
        // console.log(res)
      }
      this.getAllIndexMap()
      } else {
        this.$message.error('请输入指标名称')
      }
    },
    cancel () {
      this.isShow = false
      this.indexname = ''
      this.indexdescribe = ''
    },
    async addIndex (level, index) {
      this.indexname = ''
      this.indexdescribe = ''
      let indexid
      const beclickindexid = sessionStorage.getItem('beClick')
      if (level === 1) {
        indexid = 'L' + (this.indicators.length + 1)
      } else if (level === 3) {
        indexid = beclickindexid + 'A' + (this.thirdIndicators.length + 1)
      } else if (level === 2) {
        indexid = this.indicators[index].indexid.slice(0, 2) + 'P' + (this.indicators[index].children.length + 1)
      }
      this.indexid = indexid
      this.level = level
      this.modalType = 1
      this.isShow = true
      // console.log(this.beClick.indexid)
    },
    async clickItem (item) {
      this.cleanClick()
        item.hasClick = true
        sessionStorage.setItem('beClick', item.indexid)
        this.thirdIndicators = item.children
    },
    cleanClick () {
      sessionStorage.setItem('beClick', '')
      this.indicators.forEach((item, index) => {
          // item.rotate = false
          item.children.forEach((child, i) => {
            child.hasClick = false
          })
    })
      },
    // async getThirdIndicators (id) {
    //   const res = await getThirdIndicators({ param: id })
    //   console.log(res)
    //   if (res.data.code === 200) {
    //     this.thirdIndicators = res.data.detail
    //   }
    // },
    async getAllIndexMap () {
      const beclickindexid = sessionStorage.getItem('beClick')
      let hasthird
      const res = await getAllIndexMap()
      if (res.data.code === 200) {
        const data = res.data.detail
        data.forEach((item, index) => {
          item.rotate = false
          item.children.forEach((child, i) => {
            child.hasClick = false
            if (child.indexid === beclickindexid) {
            child.hasClick = true
            item.rotate = true
            hasthird = true
            this.thirdIndicators = child.children
          }
          })
        })
        if (!hasthird) {
          data[0].children[0].hasClick = true
          data[0].rotate = true
          hasthird = false
          this.thirdIndicators = data[0].children[0].children
        }
        this.indicators = data
        // console.log(data)
      }
    }
    // async getAllIndicators () {
    //   const res = await getAllIndicators()
    //   if (res.data.code === 200) {
    //     const data = res.data.detail
    //     data.forEach((item, index) => {
    //       item.rotate = false
    //       if (index === 0) {
    //         item.rotate = true
    //       }
    //       item.children.forEach((child, i) => {
    //         child.hasClick = false
    //         if (i === 0 && index === 0) {
    //         child.hasClick = true
    //         this.getThirdIndicators(child.id)
    //       }
    //       })
    //     })
    //     this.indicators = data
    //     console.log(this.indicators)
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
.contain {
  border-radius: 0.5rem;
  .allIndicators {
    // background-color: gray;
    .firstIndicators {
      background-color: #fafafa;
      cursor: pointer;
      height: 3rem;
      border: 1px solid #dadada;
      padding-left: 0.5rem;
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
      cursor: pointer;
      border: 1px solid #dadada;
      padding-left: 1rem;
      vertical-align: middle;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .del{
        margin-right: 0.5rem;
      }
      div{
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
.thirdIndicators {
  display: flex;
  border: 1px solid #dadada;
  padding: 0.5rem 1.5rem;
  // height: 50px;
  justify-content: space-between;
  align-items: center;
  div {
    margin-right: 1rem;
    display: flex;
    align-items: center;
    span {
      margin: 0 0.5rem;
    }
    p {
      text-align: center;
      margin-bottom: 0;
      span:first-child {
        font-weight: bolder;
      }
      span {
        margin: 0 0.5rem;
      }
    }
  }
}
</style>
