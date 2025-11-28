<template>
  <div class="statistics-overview">
    <StatisticsCardList />

    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="12">
        <UserTrendChart />
      </el-col>
      <el-col :sm="24" :md="12" :lg="12">
        <ReviewTrendChart />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :sm="24" :md="24" :lg="24">
        <RatingDistributionChart />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
  import StatisticsCardList from './widget/StatisticsCardList.vue'
  import UserTrendChart from './widget/UserTrendChart.vue'
  import ReviewTrendChart from './widget/ReviewTrendChart.vue'
  import RatingDistributionChart from './widget/RatingDistributionChart.vue'
  import { useCommon } from '@/composables/useCommon'

  defineOptions({ name: 'StatisticsOverview' })

  useCommon().scrollToTop()
</script>

<style lang="scss" scoped>
  @use './style';
</style>
