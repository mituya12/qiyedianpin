<template>
  <ElDialog v-model="dialogVisible" title="企业详情" width="800px" align-center>
    <div class="detail-container">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">企业ID:</span>
            <span class="value">{{ detailData.id }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">企业名称:</span>
            <span class="value">{{ detailData.name }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">企业别名:</span>
            <span class="value">{{ detailData.alias || '-' }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">综合评分:</span>
            <span class="value">{{ detailData.totalRating }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">评价数量:</span>
            <span class="value">{{ detailData.reviewCount }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">创建时间:</span>
            <span class="value">{{ detailData.createdAt }}</span>
          </div>
        </ElCol>
      </ElRow>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">关闭</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: boolean
    detailData?: any
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

</script>

<style scoped lang="scss">
  .detail-container {
    padding: 10px 0;

    .el-row {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .detail-item {
      display: flex;
      align-items: flex-start;
      line-height: 1.8;

      .label {
        flex-shrink: 0;
        min-width: 100px;
        font-size: 14px;
        color: var(--el-text-color-secondary);
      }

      .value {
        flex: 1;
        font-size: 14px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        word-break: break-all;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
