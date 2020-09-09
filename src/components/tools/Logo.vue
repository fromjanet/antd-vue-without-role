<!--
 * @Author: your name
 * @Date: 2020-04-26 15:44:18
 * @LastEditTime: 2020-05-09 15:57:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \my-project\src\components\tools\Logo.vue
 -->
<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <LogoSvg alt="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: {
      type: String,
      default: 'Smart City',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
