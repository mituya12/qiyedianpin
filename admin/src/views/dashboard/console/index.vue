<template>
  <div class="console">
    <CardList></CardList>

    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="10">
        <ActiveUser />
      </el-col>
      <el-col :sm="24" :md="12" :lg="14">
        <SalesOverview />
      </el-col>
    </el-row>

    <!-- 新用户图表暂时隐藏，后续会修改 -->
    <!-- <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="24">
        <NewUser />
      </el-col>
    </el-row> -->
  </div>
</template>

<script setup lang="ts">
  import CardList from './widget/CardList.vue'
  import ActiveUser from './widget/ActiveUser.vue'
  import SalesOverview from './widget/SalesOverview.vue'
  // import NewUser from './widget/NewUser.vue' // 暂时隐藏
  import { useCommon } from '@/composables/useCommon'

  defineOptions({ name: 'Console' })

  useCommon().scrollToTop()
</script>

<style lang="scss" scoped>
  @use './style';
</style>
