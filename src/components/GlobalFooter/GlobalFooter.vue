<!--
 * @Author: your name
 * @Date: 2020-04-26 15:44:18
 * @LastEditTime: 2020-04-26 21:22:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\components\GlobalFooter\GlobalFooter.vue
 -->
<template>
  <div class="footer">
    <!-- <div class="links">
      <a
        href="https://pro.loacg.com/"
        target="_blank"
      >Pro 首页</a>
      <a
        href="https://github.com/sendya/ant-design-pro-vue"
        target="_blank"
      >
        <a-icon type="github" />
      </a>
      <a href="https://ant.design/">Ant Design</a>
      <a href="https://vue.ant.design/">Vue Antd</a>
    </div> -->
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2020 <span>Janet</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
