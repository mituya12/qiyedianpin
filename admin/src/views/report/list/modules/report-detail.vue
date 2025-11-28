<template>
  <ElDialog v-model="dialogVisible" title="举报详情" width="800px" align-center>
    <div class="detail-container">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">举报ID:</span>
            <span class="value">{{ detailData.id }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">举报人:</span>
            <span class="value">{{ detailData.userName }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">被举报内容类型:</span>
            <span class="value">
              <ElTag :type="detailData.contentType === 'review' ? 'primary' : 'success'">
                {{ detailData.contentType === 'review' ? '评价' : '回复' }}
              </ElTag>
            </span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">被举报内容ID:</span>
            <span class="value">{{ detailData.contentId }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">举报原因:</span>
            <span class="value">
              <ElTag>{{ getReasonText(detailData.reason) }}</ElTag>
            </span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">处理状态:</span>
            <span class="value">
              <ElTag :type="getStatusType(detailData.status)">
                {{ getStatusText(detailData.status) }}
              </ElTag>
            </span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">举报说明:</span>
            <span class="value">{{ detailData.description }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">举报时间:</span>
            <span class="value">{{ detailData.createdAt }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">更新时间:</span>
            <span class="value">{{ detailData.updatedAt || '-' }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20" v-if="detailData.result">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">处理结果:</span>
            <span class="value">{{ detailData.result }}</span>
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

  const getReasonText = (reason: string) => {
    const reasonMap: Record<string, string> = {
      fake: '虚假信息',
      defamation: '恶意诋毁',
      spam: '广告营销',
      other: '其他'
    }
    return reasonMap[reason] || reason
  }

  const getStatusType = (status: number) => {
    const statusMap: Record<number, any> = {
      0: 'warning',
      1: 'success',
      2: 'danger'
    }
    return statusMap[status] || 'info'
  }

  const getStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: '待处理',
      1: '已处理',
      2: '已驳回'
    }
    return statusMap[status] || '未知'
  }
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
        min-width: 120px;
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
