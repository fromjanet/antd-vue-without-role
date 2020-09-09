<template>
    <div class="page-header-index-wide">
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
            <a-row type="flex">
              <a-col :span="10">
                选择省份或城市
                <Cascader
                  :options="cityOfProvince"
                  placeholder="请选择省份或城市"
                  allowClear
                  :fieldNames="fieldNames"
                  change-on-select
                  @change="onChange"
                />
              </a-col>
              <a-col :span="12">
                  裁剪指标个数
                <a-input-number id="indexNumber" v-model="indexNumber" :min="1" :max="100"/>
              </a-col>
              <a-col>
                <a-button type="primary" @click="buttonClick">
                    自动裁剪
                </a-button>
              </a-col>
            </a-row>
            <a-table
                :columns="columns"
                :data-source="tableData"
                :pagination="pagination"
                :loading="loading"
                @change="handleTableChange">
            </a-table>
             <a-col>
                <a-button type="primary" @click="confirm">
                保存裁剪指标
                </a-button>
              </a-col>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
</template>
<script>
import { Cascader } from 'ant-design-vue'
import { getAllCity, searchIndexByCity } from '@/api/city'
import { getAllMapCut, insertMapCut, updateMapCut } from '@/api/mapCut'
const columns = [
    {
        title: '指标名称',
        dataIndex: 'indexName',
        width: '50%'
    },
    {
        title: '指标评分',
        dataIndex: 'score',
        width: '50%'
    }
]

export default {
    name: 'red',
    components: {
        Cascader
    },
    data () {
        return {
            cityOfProvince: [],
            indexNumber: 1,
            columns,
            tableData: [],
            pagination: {},
            loading: false,
            fieldNames: {
                value: 'citycode',
                label: 'cityname',
                children: 'children'
            },
            cityCode: '',
            allMapCut: [],
            isShow: false,
            modeldescribe: '',
            isNew: true,
            checked: false,
            cid: 0,
            tags: [],
            modeltag: [],
            paramtag: []
        }
    },
    created () {
        this.getAllCity()
        this.getAllMapCut()
    },
    methods: {
        onChange (value) {
            if (value[1]) {
                this.city = this.list.filter((item) => {
                    if (item.citycode === value[1]) {
                        this.cityCode = item.citycode
                        return item
                    }
                })
            } else if (value[0]) {
                    this.city = this.list.filter((item) => {
                    if (item.citycode.slice(0, 2) === value[0]) {
                        this.cityCode = item.citycode
                        return item
                    }
                })
            } else {
                this.city = this.list
            }
        },
        async buttonClick () {
            const cityCode = this.cityCode
            const indexNumber = this.indexNumber
            const res = await searchIndexByCity({ cityCode, indexNumber })
            if (res.data.code === 200) {
                const data = res.data.detail
                this.tableData = data
            }
        },
     async confirm () {
      if (this.isNew) {
        const param = {
          cname: this.fieldNames.label,
          cdescribe: this.modeldescribe,
          cmodel: this.checked ? '1' : '0'
        }
        console.log(param)
        const res = await insertMapCut(param)
        if (res.data.code === 200) {
          this.$message.success('添加成功')
          this.getAllMapCut()
          this.isShow = false
        } else {
          this.$message.error(res.data.description)
        }
        // this.$router.push('/project/projectUse')
      } else {
        const param = {
          cid: this.cid,
          cname: this.fieldNames.cityname,
          cdescribe: this.modeldescribe,
          cmodel: this.checked ? '1' : '0'
        }// console.log(param)
        const res = await updateMapCut(param)
        if (res.data.code === 200) {
          this.$message.success('更新成功')
          this.getAllMapCut()
          this.isShow = false
        } else {
          this.$message.error(res.data.description)
        }
      }
    },
     async getAllMapCut () {
      const res = await getAllMapCut()
      if (res.data.code === 200) {
        const data = res.data.detail
        data.forEach(item => {
          item.formatTime = this.formatTime(item.ctime)
          let attributes
          if (item.tag) {
           attributes = item.tag.split(',')
          // console.log(attributes)
          } else {
            attributes = []
          }
          item.attributes = attributes
        })
        this.allMapCut = data
        this.allMapCut.push({})
        // console.log(this.allMapCut)
      }
    },
    newModel () {
      this.modelname = this.fieldNames.cityname
      this.modeldescribe = ''
      this.modeltag = []
      this.paramTag = []
      this.checked = false
      this.isShow = true
      this.isNew = true
      this.checked = false
    },
        handleTableChange (pagination, filters, sorter) {
        },
        async getAllCity () {
            const res = await getAllCity()
            console.log(res)
            let province = []
            if (res.data.code === 200) {
                const data = res.data.detail
                data.forEach((item, index) => {
                let attributes
                if (item.cityattributes) {
                attributes = item.cityattributes.split(',')
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
.el-table, .el-table__expanded-cell {
    background-color: transparent;
}

.el-table th, .el-table tr {
    background-color: red;
}
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
</style>
