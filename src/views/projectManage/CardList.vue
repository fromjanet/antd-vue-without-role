<template>
  <div
    class="card-list"
    ref="content"
  >
    <a-list
      rowKey="id"
      :grid="{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }"
      :dataSource="allMapCut"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="item"
      >
        <template v-if="!item || item.cid === undefined">
          <a-button
            class="new-btn"
            type="dashed"
            @click="newModel()"
          >
            <a-icon type="plus" />
            新增分析模型
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a slot="title" @click="ChangeModel(item)">{{ item.cname }}</a>
            <a slot="extra" style="color:red">
              <a-popconfirm
                title="确认删除这个模型?"
                ok-text="确认"
                cancel-text="取消"
                @confirm="deleteModel(item)"
              >
                <a style="color:red">删除</a>
              </a-popconfirm>
            </a>
            <a-card-meta @click="ChangeModel(item)" >
              <div
                class="meta-content"
                slot="description"
              >
                <div v-if="item.attributes[0]">标签：<template v-for="(tag) in item.attributes">
                  <a-tooltip v-if="tag.length > 5" :key="tag" :title="tag">
                    <a-tag :key="tag" color="blue">
                      {{ `${tag.slice(0, 5)}...` }}
                    </a-tag>
                  </a-tooltip>
                  <a-tag v-else :key="tag" color="blue">
                    {{ tag }}
                  </a-tag>
                </template></div>
                <div v-else>标签：无</div>
                <a-tooltip v-if="item.cdescribe.length > 43" :title="item.cdescribe" >
                  <div>{{ `${item.cdescribe.slice(0, 43)}...` }}</div>
                </a-tooltip>
                <div v-else style="height:40px">{{ item.cdescribe }}</div>
                <div >创建时间：{{ item.formatTime }}</div>
                <div >是否是模板库：{{ +item.cmodel===1?'是':'否' }}</div>
              </div>
            </a-card-meta>
            <template
              class="ant-card-actions"
              slot="actions"
            >
              <a @click="jumpToDetail(item.cid)">剪裁指标体系</a>
              <a @click="jumpToUse(item.cid)">使用</a>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
    <a-modal
      title="模型信息"
      v-model="isShow"
      :footer="null"
      closable
      destroyOnClose
    >
      <div><span>模型名称</span>
        <a-input
          v-model="modelname"
          placeholder="请输入模型名称"
        />
      </div>
      <div style="margin: 20px 0;"><span>模型描述</span>
        <a-textarea
          v-model="modeldescribe"
          placeholder="请输入模型信息描述"
          :auto-size="{ minRows: 2 }"
          allowClear
        />
      </div>
      <div style="margin: 20px 0;">
        <a-select
          mode="multiple"
          :default-value="modeltag"
          style="width: 100%;"
          placeholder="请选择此模型的标签"
          @change="addTag"
        >
          <a-select-option v-for="(tag,index) in tags" :key="index">
            {{ tag }}
          </a-select-option>
        </a-select>
      </div>
      <div style="margin: 20px 0;"><span style="margin-right: 20px">是否设为模板库</span>
        <a-switch v-model="checked" @change="ChangeSwitch" />
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
import { getAllMapCut, insertMapCut, updateMapCut, deleteMapCut } from '@/api/mapCut'
import { getAllCity } from '@/api/city'

export default {
  name: 'CardList',
  data () {
    return {
      allMapCut: [],
      isShow: false,
      modelname: '',
      modeldescribe: '',
      isNew: false,
      checked: false,
      cid: 0,
      tags: [],
      modeltag: [],
      paramtag: []
    }
  },
  created () {
    this.getAllMapCut()
    this.getAllCity()
  },
  methods: {
    async getAllCity () {
      const res = await getAllCity()
      const allcity = res.data.detail
      let tags = []
      allcity.forEach((item) => {
        let tag
        if (item.cityattributes) {
         tag = item.cityattributes.split(',')
          tags.push.apply(tags, tag)
        }
      })
      tags = [...new Set(tags)]
      this.tags = tags
    },
    addTag (value) {
      // console.log(`selected ${value}`)
      // this.param
      const paramTag = []
      value.forEach((val) => {
        this.tags.forEach((tag, index) => {
          if (val === index) {
            paramTag.push(tag)
          }
        })
      })
      this.paramTag = paramTag
      // console.log(this.paramTag)
    },
    async deleteModel (item) {
      const Cid = +item.cid
      const res = await deleteMapCut({ Cid })
      if (res.data.code === 200) {
          this.$message.success('删除成功')
          this.getAllMapCut()
        } else {
          this.$message.error('请删除模型中的指标后重试')
        }
    },
    async confirm () {
      if (this.modelname !== '') {
        const paramTag = this.paramTag.join(',')
      if (this.isNew) {
        const param = {
          cname: this.modelname,
          cdescribe: this.modeldescribe,
          cmodel: this.checked ? '1' : '0',
          tag: paramTag
        }
        // console.log(param)
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
          cname: this.modelname,
          cdescribe: this.modeldescribe,
          cmodel: this.checked ? '1' : '0',
          tag: paramTag
        }
        // console.log(param)
        const res = await updateMapCut(param)
        if (res.data.code === 200) {
          this.$message.success('更新成功')
          this.getAllMapCut()
          this.isShow = false
        } else {
          this.$message.error(res.data.description)
        }
      }
      } else {
        this.$message.error('请输入模型名称')
      }
    },
    cancel () {
      this.cid = 0
      this.modelname = ''
      this.modeldescribe = ''
      this.modeltag = []
      this.paramTag = []
      this.isShow = false
    },
    ChangeModel (item) {
      this.isNew = false
      if (+item.cmodel === 1) {
        this.checked = true
      } else {
        this.checked = false
      }
      this.cid = item.cid
      this.modelname = item.cname
      this.modeldescribe = item.cdescribe
      this.isShow = true
      const tagIndex = []
      if (item.attributes[0]) {
        this.tags.forEach((tag, index) => {
        item.attributes.forEach((arr) => {
          if (arr === tag) {
            tagIndex.push(index)
          }
        })
      })
      }
      this.modeltag = tagIndex
    },
    ChangeSwitch (checked) {
      this.checked = checked
    },
    formatTime (time) {
      const now = new Date(time)
      var year = now.getFullYear()
      var month = now.getMonth() + 1
      var date = now.getDate()
      var hour = now.getHours()
      var minute = now.getMinutes().toString().length > 1 ? now.getMinutes() : '0' + now.getMinutes()
      var second = now.getSeconds().toString().length > 1 ? now.getSeconds() : '0' + now.getSeconds()
      return year + '-' + month + '-' + date + '  ' + hour + ':' + minute + ':' + second
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
      this.modelname = ''
      this.modeldescribe = ''
      this.modeltag = []
      this.paramTag = []
      this.checked = false
      this.isShow = true
      this.isNew = true
      this.checked = false
    },
    jumpToDetail (cid) {
      this.$router.push({ path: '/project/projectDetail', query: { cid } })
    },
    jumpToUse (cid) {
      this.$router.push({ path: '/project/projectExist', query: { cid } })
    },
    testFun () {
      this.$message.info('快速开始被点击！')
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/components/index.less';

.card-list {
  /deep/ .ant-card-body:hover {
    .ant-card-meta-title > a {
      color: @primary-color;
    }
  }

  /deep/ .ant-card-meta-title {
    margin-bottom: 12px;

    & > a {
      display: inline-block;
      max-width: 100%;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  /deep/ .meta-content {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    height: 102px;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;

    // margin-bottom: 1em;
  }
}

.card-avatar {
  width: 48px;
  height: 48px;
  border-radius: 48px;
}

.ant-card-actions {
  background: #f7f9fa;

  li {
    float: left;
    text-align: center;
    margin: 12px 0;
    color: rgba(0, 0, 0, 0.45);
    width: 50%;

    &:not(:last-child) {
      border-right: 1px solid #e8e8e8;
    }

    a {
      color: rgba(0, 0, 0, 0.45);
      line-height: 22px;
      display: inline-block;
      width: 100%;
      &:hover {
        color: @primary-color;
      }
    }
  }
}

.new-btn {
  background-color: #fff;
  border-radius: 2px;
  width: 100%;
  height: 244.6px;
}
</style>
