<template>
  <div class="card art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="box-title">用户概述</h4>
        <p class="subtitle">新增用户增长数量</p>
      </div>
    </div>
    <ArtBarChart
      class="chart"
      barWidth="50%"
      height="calc(100% - 60px)"
      :showAxisLine="false"
      :data="[45, 38, 52, 48, 61, 55, 58, 63, 72]"
      :xAxisData="['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月']"
    />
  </div>
</template>

<script setup lang="ts">
  // 新增用户增长数量数据
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
