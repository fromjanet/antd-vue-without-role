<!--
 * @Author: your name
 * @Date: 2020-05-08 17:47:50
 * @LastEditTime: 2020-05-18 23:24:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\projectManage\projectExist.vue
 -->
<template>
  <div>
    <div><a-select
           label-in-value
           placeholder="选择查看已创建的收集表"
           style="width: 120px"
           @change="handleChange"
         >
           <a-select-option v-for="(cityitem) in city" :key="cityitem.citycode" :value="cityitem.citycode">
             {{ cityitem.cityname }}
           </a-select-option>
         </a-select><a-button @click="createNew">创建新的收集表</a-button>
      <a-popconfirm
        title="确认删除此收集表吗?"
        ok-text="确认"
        cancel-text="取消"
        @confirm="deleteCol"
      >
        <a-button>删除此收集表</a-button>
      </a-popconfirm></div>
    <div class="colTable">
      <table>
        <tr
          v-for="(item, index) in column"
          :key="item.citycode">
          <td class="xuhao">{{ index }}</td>
          <td class="indexname">{{ item.indexname }}</td>
          <td class="indexvalue">{{ item.indexvalue }}</td>
        </tr>
      <!-- {{ item.citycode }} {{ item.id }} -->
      </table>
    </div>
  </div>
</template>

<script>
import { getAllCity, deleteCollect } from '@/api/collect'
import { getCityById } from '@/api/city'
import { getCutByCId } from '@/api/cut'
export default {
  data () {
    return {
      list: [],
      column: [],
      city: []
    }
  },
  components: {
  },
  created () {
    this.getAllCity()
    this.getCutByCId()
  },
  methods: {
    async deleteCol () {
      if (this.colid) {
        const cid = +this.$route.query.cid
      const id = this.colid
      const res = await deleteCollect({ cid, id })
      console.log(res)
        this.$message.success('删除成功')
        this.getAllCity()
      } else {
        this.$message.error('请先选择一张表格')
      }
    },
    createNew () {
      const cid = +this.$route.query.cid
      this.$router.push({ path: '/project/projectUse', query: { cid } })
    },
    async getCutByCId () {
      if (this.$route.query.cid) {
        const cid = +this.$route.query.cid
        const res2 = await getCutByCId({ cid })
        if (res2.data.code === 200) {
          const list = res2.data.detail
          list.forEach((item) => {
            item.indexvalue = 0
          })
          this.column = list
          // console.log(this.column)
        }
      }
    },
    handleChange (value) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].citycode === value.key) {
          this.column.forEach((item) => {
            for (const t in this.list[i]) {
              if (item.indexid === t) {
                this.colid = this.list[i].id
              item.indexvalue = this.list[i][t]
            }
            }
          })
        }
      }
    },
    async getAllCity () {
      // this.column = []
      const cid = +this.$route.query.cid
      const res = await getAllCity({ cid })
      const json = res.data.detail
      var obj = JSON.parse(json)
      // let name
      // for (name in obj[0]) {
      //   this.column.push(name)
      // }
      const city1 = []
      for (let i = 0; i < obj.length; i++) {
        const citycode = obj[i].citycode
        const res = await getCityById({ citycode })
        const city = res.data.detail
        const cityParam = {
          citycode: city.citycode.trim(),
          cityname: city.cityname.trim()
        }
        city1.push(cityParam)
      }
      this.city = city1
      this.list = obj
      // console.log(obj)
    }
  }

}
</script>

<style lang="less" scoped>
.colTable{
  padding: 1rem 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  p{
    font-size: 16px;
    font-weight: bolder;
  }
  table {
  width: 80%;
  tr:nth-child(odd){
    background: #B0E0E6;
    }
  tr {
    .xuhao{
      width: 10%;
    }
    .indexname{
      width: 75%;
    }
    .indexvalue{
      width: 15%
    }
    td {
      line-height: 35px;
      display: inline-block;
      text-align: center;
      border: 1px solid #EBEDF0;
    }
  }
}
}
</style>
