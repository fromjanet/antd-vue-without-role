<!--
 * @Author: your name
 * @Date: 2020-04-26 17:53:50
 * @LastEditTime: 2020-04-27 22:50:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\indicatorManage\TreeList.vue
 -->
<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <div class="contain" v-if="this.indicators">
          <div class="allIndicators" v-for="(item,index) in indicators" :key="index">
            <div @click="item.rotate=!item.rotate" class="firstIndicators" :class="[item.rotate ? 'rotate':'']" >
              <p>{{ item.id }}{{ item.name }}</p>
            </div>
            <div v-if="item.children&&item.rotate">
              <div v-for="(itemChild, i) in item.children" :key="i">
                <div :style="[{backgroundColor: itemChild.hasClick ? '#1890FF' : ''}]" @click="clickItem(itemChild.id)" class="itemChild"><p>{{ itemChild.id }}{{ itemChild.name }}</p></div>
              </div>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="19">
        <div v-if="thirdIndicators">
          <div class="thirdIndicators" v-for="(item, index) in thirdIndicators" :key="index">
            <div>{{ item.id }}</div>
            <div>{{ item.name }}</div>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" /> -->
  </a-card>
</template>

<script>
import STree from '@/components/Tree/Tree'
import { STable } from '@/components'
import OrgModal from './modules/OrgModal'
// import { getOrgTree, getServiceList } from '@/api/manage'
import { getAllIndicators, getThirdIndicators } from '@/api/indicators'

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
      thirdIndicators: []
    }
  },
  created () {
    this.getAllIndicators()
  },
  watch: {
    rotate: (oldV, newV) => {
      console.log(oldV, newV)
    }
  },
  methods: {
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
      console.log(res)
      if (res.data.code === 200) {
        this.thirdIndicators = res.data.detail
      }
    },
    async getAllIndicators () {
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
        console.log(this.indicators)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.contain {
  .allIndicators{
    // background-color: gray;
    .firstIndicators{
      background-color: #FAFAFA;
      cursor: pointer;
      height: 3rem;
      border: 1px solid #DADADA;
      padding-left: 0.5rem;
      p{
        margin-bottom: 0;
        line-height: 3rem;
        font-size: 1.2rem;
        font-weight: 500;
      }
    }
    .itemChild{
      cursor: pointer;
      border: 1px solid #DADADA;
      padding-left: 1rem;
      vertical-align: middle;
      p{
        margin-bottom: 0;
        line-height: 2.5rem;
      }
    }
    .hasClick {
      background-color: #52C41A;
    }
  }
}
.thirdIndicators{
    display: flex;
    border: 1px solid #DADADA;
    padding: 1.5rem 1.5rem;
    div{
      margin-right: 1rem;
    }
  }
</style>
