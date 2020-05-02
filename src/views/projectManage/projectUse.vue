<!--
 * @Author: your name
 * @Date: 2020-04-28 14:43:26
 * @LastEditTime: 2020-04-28 16:18:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\projectManage\projectUse.vue
 -->
<template>
  <div>基本分析模型
    <div>选择省份
      <a-select style="width: 300px" @change="handleChange" >
        <a-select-option v-for="(item, index) in province" :key="index">{{ item }}</a-select-option>
      </a-select></div>
    <div>选择城市
      <a-select style="width: 300px" @change="handleCityChange">
        <a-select-option v-for="(item) in city" :key="item.citycode">{{ item.cityname }}</a-select-option>
      </a-select></div>
    <div>
      <ul>
        <li>惠民服务</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getAllCity } from '@/api/city'
export default {
  data () {
    return {
      list: [],
      province: [],
      city: []
    }
  },
  created () {
    this.getAllCity()
  },
methods: {
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
    },
    handleChange (e) {
      this.city = []
      this.list.forEach((item, index) => {
          if (item.province === this.province[e]) {
            this.city.push(item)
          }
        })
    },
    handleCityChange (e) {
      console.log(e)
    }
}
}
</script>

<style>

</style>
