<template>
  <div class="card art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">近30天用户注册趋势</h4>
        <p class="subtitle">新增用户增长数量</p>
      </div>
    </div>
    <div v-if="data.length < 2" class="empty-state">
      <p>数据不足，需要至少2天的数据才能显示趋势</p>
    </div>
    <ArtLineChart
      v-else
      class="chart"
      height="calc(100% - 40px)"
      :data="data"
      :xAxisData="xAxisData"
      :showAreaColor="true"
      :showAxisLine="false"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchUserTrend } from '@/api/statistics'

  const data = ref<number[]>([])
  const xAxisData = ref<string[]>([])

  const loadUserTrend = async () => {
    try {
      const response: any = await fetchUserTrend({ days: 30 })
      const trendData = response?.data || response
      
      if (Array.isArray(trendData)) {
        data.value = trendData.map((item: any) => item.count)
        xAxisData.value = trendData.map((item: any) => item.date)
      }
    } catch (error) {
      console.error('加载用户注册趋势失败:', error)
    }
  }

  onMounted(() => {
    loadUserTrend()
  })
</script>

<style lang="scss" scoped>
  .card {
    box-sizing: border-box;
    width: 100%;
    height: 420px;
    padding: 20px 0 30px;

    .card-header {
      padding: 0 18px !important;
    }

    .chart {
      box-sizing: border-box;
      width: 100%;
      padding: 20px 20px 0;
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: calc(100% - 60px);
      color: var(--art-text-gray-600);
      font-size: 14px;
    }
  }

  @media screen and (max-width: $device-phone) {
    .card {
      height: 280px;
    }
  }
</style>
