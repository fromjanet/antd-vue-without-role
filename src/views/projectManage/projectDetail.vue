<!--
 * @Author: your name
 * @Date: 2020-04-27 23:09:20
 * @LastEditTime: 2020-04-28 13:59:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\projectManage\projectDetail.vue
 -->
<template>
  <div class="projectDetail">
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
              <p>{{ item.id }}{{ item.name }}</p>
            </div>
            <div v-if="item.children&&item.rotate">
              <div
                v-for="(itemChild, i) in item.children"
                :key="i"
              >
                <div
                  :style="[{backgroundColor: itemChild.hasClick ? '#1890FF' : ''}]"
                  @click="clickItem(itemChild.id)"
                  class="itemChild"
                >
                  <p>{{ itemChild.id }}{{ itemChild.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <draggable
          class="list-group"
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
          {{ element.id }} {{ element.name }}
        </div>
      </draggable>
    </div>
    <div class="confirm" style="cursor:pointer" @click="confirm()">确定</div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { getAllIndicators, getThirdIndicators } from '@/api/indicators'

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
      thirdIndicators: []
    }
  },
  created () {
    this.getAllIndicators()
    const list2 = sessionStorage.getItem('list2')
    this.list2 = JSON.parse(list2) || []
  },
  methods: {
    confirm () {
      var t = prompt('请输入模型名字：', '')
      console.log(t)
      sessionStorage.setItem('name', t)
      sessionStorage.setItem('list2', JSON.stringify(this.list2))
      console.log(this.list2)
      this.$router.push('/projectManage')
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
.projectDetail{
  text-align: center;
.row {
  background-color: #fff;
  display: flex;
  padding: 2rem 3rem;
  .contain {
    margin-right: 1rem;
    display: flex;
    width: 50%;
    .left {
      width: 20%;
      .allIndicators {
        // background-color: gray;
        .firstIndicators {
          background-color: #fafafa;
          cursor: pointer;
          height: 2rem;
          border: 1px solid #dadada;
          padding-left: 0.5rem;
          p {
            margin-bottom: 0;
            line-height: 2rem;
            font-size: 1.2rem;
            font-weight: 500;
          }
        }
        .itemChild {
          cursor: pointer;
          border: 1px solid #dadada;
          padding-left: 1rem;
          vertical-align: middle;
          p {
            margin-bottom: 0;
            line-height: 2.5rem;
          }
        }
        .hasClick {
          background-color: #1890FF;
        }
      }
    }
    .list-group {
      width: 80%;
      height: 100%;
      border: 1px solid;
      .thirdIndicators {
        display: flex;
        border: 1px solid;
        div {
          margin-right: 0.3rem;
        }
      }
    }

  }
      .right{
        width: 50%;
      background-color: #dadada;
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
.confirm{
  width: 100%;
  background-color: #1890FF;
}
}
</style>
