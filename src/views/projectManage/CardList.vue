<template>
  <div
    class="card-list"
    ref="content"
  >
    <a-list
      rowKey="id"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
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
            @click="jumpToDetail()"
          >
            <a-icon type="plus" />
            新增分析模型
          </a-button>
        </template>
        <template v-else>
          <a-card :hoverable="true">
            <a-card-meta>
              <a slot="title">{{ item.cname }}</a>
              <a-icon type="fund" />
              <div
                class="meta-content"
                slot="description"
              >{{ item.cdescribe }}</div>
            </a-card-meta>
            <template
              class="ant-card-actions"
              slot="actions"
            >
              <a @click="jumpToDetail()">修改</a>
              <a @click="jumpToUse()">使用</a>
            </template>
          </a-card>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { getAllMapCut } from '@/api/mapCut'

export default {
  name: 'CardList',
  data () {
    return {
      description: '段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态， 提供跨越设计与开发的体验解决方案。',
      linkList: [
        {
          icon: 'rocket',
          href: '#',
          title: '快速开始',
          // 回调，可不写
          callback: () => {
            // this.$message.info('快速开始被单击')
            this.testFun()
            console.log('call[\'快速开始\'] action')
          }
        },
        { icon: 'info-circle-o', href: '#', title: '产品简介' },
        { icon: 'file-text', href: '#', title: '产品文档' }
      ],
      extraImage: 'https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png',
      dataSource: [],
      allMapCut: []
    }
  },
  created () {
    this.dataSource.push({})
  this.getAllMapCut()
  },
  methods: {
    async getAllMapCut () {
      const res = await getAllMapCut()
      if (res.data.code === 200) {
        this.allMapCut = res.data.detail
        this.allMapCut.push({})
        console.log(this.allMapCut)
      }
    },
    jumpToDetail () {
      this.$router.push('/projectDetail')
    },
    jumpToUse () {
      this.$router.push('/projectUse')
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
    height: 64px;
    -webkit-line-clamp: 3;
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
  height: 188px;
}
</style>
