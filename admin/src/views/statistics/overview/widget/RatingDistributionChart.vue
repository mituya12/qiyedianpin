<template>
  <div class="card art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">评分分布统计</h4>
        <p class="subtitle">各星级评价数量分布</p>
      </div>
    </div>
    <ArtBarChart
      class="chart"
      barWidth="50%"
      height="calc(100% - 60px)"
      :showAxisLine="false"
      :data="data"
      :xAxisData="xAxisData"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { fetchRatingDistribution } from '@/api/statistics'

  const data = ref<number[]>([0, 0, 0, 0, 0])
  const xAxisData = ref<string[]>(['1星', '2星', '3星', '4星', '5星'])

  const loadRatingDistribution = async () => {
    try {
      const response: any = await fetchRatingDistribution()
      const distributionData = response?.data || response
      
      if (Array.isArray(distributionData)) {
        // API返回格式: [{ rating: 4, count: 1 }, { rating: 3, count: 3 }]
        const ratingMap: Record<number, number> = {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
        
        distributionData.forEach((item: any) => {
          if (item.rating && item.count !== undefined) {
            ratingMap[item.rating] = item.count
          }
        })
        
        data.value = [
          ratingMap[1],
          ratingMap[2],
          ratingMap[3],
          ratingMap[4],
          ratingMap[5]
        ]
      }
    } catch (error) {
      console.error('加载评分分布失败:', error)
    }
  }

  onMounted(() => {
    loadRatingDistribution()
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
  }

  .dark {
    .card {
      .chart {
        background: none;
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .dark {
      .card {
        .chart {
          padding: 15px 0 0 !important;
        }
      }
    }
  }
</style>
