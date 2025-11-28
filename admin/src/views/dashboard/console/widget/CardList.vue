<template>
  <el-row :gutter="20" class="card-list">
    <el-col v-for="(item, index) in dataList" :key="index" :sm="12" :md="6" :lg="6">
      <div class="card art-custom-card">
        <span class="des subtitle">{{ item.des }}</span>
        <ArtCountTo class="number box-title" :target="item.num" :duration="1300" />
        <div class="change-box">
          <span class="change-text">较上周</span>
          <span
            class="change"
            :class="[item.change.indexOf('+') === -1 ? 'text-danger' : 'text-success']"
          >
            {{ item.change }}
          </span>
        </div>
        <i class="iconfont-sys" v-html="item.icon"></i>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue'
  import { fetchStatisticsOverview } from '@/api/statistics'

  interface OverviewData {
    totalCompanies: number
    totalUsers: number
    totalReviews: number
    totalReplies: number
    todayCompanies: number
    todayUsers: number
    todayReviews: number
    todayReplies: number
    pendingCompanies: number
    pendingReviews: number
    pendingReplies: number
    pendingReports: number
  }

  const dataList = reactive([
    {
      des: '企业总数',
      icon: '&#xe721;',
      startVal: 0,
      duration: 1000,
      num: 0,
      change: '+0',
      key: 'totalCompanies',
      todayKey: 'todayCompanies'
    },
    {
      des: '用户总数',
      icon: '&#xe82a;',
      startVal: 0,
      duration: 1000,
      num: 0,
      change: '+0',
      key: 'totalUsers',
      todayKey: 'todayUsers'
    },
    {
      des: '评价总数',
      icon: '&#xe724;',
      startVal: 0,
      duration: 1000,
      num: 0,
      change: '+0',
      key: 'totalReviews',
      todayKey: 'todayReviews'
    },
    {
      des: '回复总数',
      icon: '&#xe724;',
      startVal: 0,
      duration: 1000,
      num: 0,
      change: '+0',
      key: 'totalReplies',
      todayKey: 'todayReplies'
    }
  ])

  const loadOverviewData = async () => {
    try {
      const response: any = await fetchStatisticsOverview()
      console.log('数据概览API返回:', response)
      
      // 处理可能的data嵌套
      const data = (response?.data || response) as OverviewData
      console.log('处理后的数据:', data)
      
      dataList.forEach((item: any) => {
        item.num = data[item.key as keyof OverviewData] || 0
        const todayCount = data[item.todayKey as keyof OverviewData] || 0
        item.change = todayCount > 0 ? `+${todayCount}` : '0'
      })
    } catch (error) {
      console.error('加载数据概览失败:', error)
    }
  }

  onMounted(() => {
    loadOverviewData()
  })
</script>

<style lang="scss" scoped>
  .card-list {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    background-color: transparent !important;

    .art-custom-card {
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 140px;
      padding: 0 18px;
      list-style: none;
      transition: all 0.3s ease;

      $icon-size: 52px;

      .iconfont-sys {
        position: absolute;
        top: 0;
        right: 20px;
        bottom: 0;
        width: $icon-size;
        height: $icon-size;
        margin: auto;
        overflow: hidden;
        font-size: 22px;
        line-height: $icon-size;
        color: var(--el-color-primary) !important;
        text-align: center;
        background-color: var(--el-color-primary-light-9);
        border-radius: 12px;
      }

      .des {
        display: block;
        height: 14px;
        font-size: 14px;
        line-height: 14px;
      }

      .number {
        display: block;
        margin-top: 10px;
        font-size: 28px;
        font-weight: 400;
      }

      .change-box {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .change-text {
          display: block;
          font-size: 13px;
          color: var(--art-text-gray-600);
        }

        .change {
          display: block;
          margin-left: 5px;
          font-size: 13px;
          font-weight: bold;

          &.text-success {
            color: var(--el-color-success);
          }

          &.text-danger {
            color: var(--el-color-danger);
          }
        }
      }
    }
  }

  .dark {
    .card-list {
      .art-custom-card {
        .iconfont-sys {
          background-color: #232323 !important;
        }
      }
    }
  }
</style>
