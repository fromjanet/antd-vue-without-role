<!--
 * @Author: your name
 * @Date: 2020-04-28 14:43:26
 * @LastEditTime: 2020-05-10 17:43:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\views\projectManage\projectUse.vue
 -->
<template>
  <div class="citycollect">
    <div class="selected">
      <div><p>选择省份或城市</p>
        <Cascader
          :options="cityOfProvince"
          placeholder="请选择省份或城市"
          allowClear
          :fieldNames="fieldNames"
          @change="onChange"
        />
      </div>
      <div><a-button type="primary" style="marginRight:1rem;" @click="confirm">确定提交收集表</a-button><a-button @click="cancel">取消</a-button></div>
    </div>
    <div class="colTable">
      <p>城市信息采集表</p>
      <table>
        <tr
          v-for="(item, index) in Cut"
          :key="item.indexid">
          <td class="xuhao">{{ index }}</td>
          <td class="indexname">{{ item.indexname }}</td>
          <td class="indexvalue"><a-input-number :min="0" :max="100" :step="1" v-model="item.indexvalue" /></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { getAllCity } from '@/api/city'
import { getCutByCId } from '@/api/cut'
import { insertCol } from '@/api/collect'
import { getMapCutById } from '@/api/mapCut'
import { Cascader } from 'ant-design-vue'
export default {
  data () {
    return {
      cityOfProvince: [],
      fieldNames: {
        value: 'citycode',
        label: 'cityname',
        children: 'children'
      },
      selectedCity: [],
      Cut: []
    }
  },
  components: {
    Cascader
  },
  created () {
    this.getAllCity()
    this.getCutByCId()
  },
methods: {
  cancel () {
    const cid = +this.$route.query.cid
    this.$router.push({ path: '/project/projectExist', query: { cid } })
  },
  async confirm () {
    // console.log(this.selectedCity)
    if (this.selectedCity[0]) {
      let indexid = []
    let indexvalue = []
    this.Cut.forEach((item, index) => {
      indexid.push(item.indexid)
      indexvalue.push(item.indexvalue)
    })
    const cid = +this.$route.query.cid
    indexid = indexid + ''
    indexvalue = indexvalue + ''
    const res = await insertCol({ cid, citycode: this.selectedCity, indexid, indexvalue })
    // console.log(res)
    if (res.data.code === 200) {
      this.$router.push({ path: '/project/projectExist', query: { cid } })
    }
    } else {
      this.$message.error('请选择一个城市')
    }
  },
  onChange (value) {
      // console.log(value)
      this.selectedCity = value[1]
    },
    async getCutByCId () {
      if (this.$route.query.cid) {
        const cid = +this.$route.query.cid
        const res2 = await getCutByCId({ cid })
        if (res2.data.code === 200) {
          // console.log(res2.data.detail)
          const list = res2.data.detail
          list.forEach((item) => {
            item.indexvalue = 0
          })
          this.Cut = list
        }
      }
    },
  async getAllCity () {
      const res = await getAllCity()
      const cid = +this.$route.query.cid
      const mapRes = await getMapCutById({ cid })
      let province = []
      const cityOfProvince = []
      if (res.data.code === 200 && mapRes.data.code === 200) {
        const data = res.data.detail
        const mapCut = mapRes.data.detail
        // console.log(mapCut)
        const modelTag = mapCut.tag
        // console.log(modelTag)
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
        // this.list = data
        // console.log(data)
        // console.log(province)
        const rs = new Map()
        province = province.filter((arr) => !rs.has(arr.citycode) && rs.set(arr.citycode, 1))
        // console.log(province)
        province.forEach((pro, index) => {
          data.forEach((city) => {
            // console.log(city)
            let bepush = false
            if (city.province === pro.cityname) {
              city.cityattributes.forEach((tag) => {
                if (modelTag.indexOf(tag) !== -1) {
                  // console.log(city.cityname)
                  bepush = true
                }
              })
              // console.log(city.cityname, bepush)
              if (modelTag === '') {
                bepush = true
              }
              if (bepush) {
                // console.log(city.cityname)
              pro.children.push(city)
              }
            }
          })
          if (pro.children[0]) {
            // console.log(index)
            cityOfProvince.push(pro)
            // province.splice(index, 1)
          }
        })
        // console.log(province)
        this.cityOfProvince = cityOfProvince
        // this.city = data
      }
    }
}
}
</script>

<style lang="less" scoped>
.selected{
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: #fff;
  margin-bottom: 0.5rem;
  height: 3rem;
  div{
  display: flex;
  align-items: center;
  p{
    margin: 0 0.5rem;
  }}

}
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
      width: 15%;
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
