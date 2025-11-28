<template>
  <ElDialog v-model="dialogVisible" title="回复详情" width="800px" align-center>
    <div class="detail-container">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">回复ID:</span>
            <span class="value">{{ detailData.id }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">回复人:</span>
            <span class="value">{{ detailData.author }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">原评价ID:</span>
            <span class="value">{{ detailData.reviewId }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">是否官方回复:</span>
            <span class="value">
              <ElTag :type="detailData.isOfficial === 1 ? 'success' : 'info'">
                {{ detailData.isOfficial === 1 ? '是' : '否' }}
              </ElTag>
            </span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">回复内容:</span>
            <span class="value">{{ detailData.content }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">审核状态:</span>
            <span class="value">
              <ElTag :type="getAuditStatusType(detailData.auditStatus)">
                {{ getAuditStatusText(detailData.auditStatus) }}
              </ElTag>
            </span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">回复时间:</span>
            <span class="value">{{ detailData.date }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">备注:</span>
            <span class="value">{{ detailData.remark || '-' }}</span>
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

  const getAuditStatusType = (status: number) => {
    const statusMap: Record<number, any> = {
      0: 'warning',
      1: 'success',
      2: 'danger'
    }
    return statusMap[status] || 'info'
  }

  const getAuditStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: '待审核',
      1: '已通过',
      2: '已拒绝'
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
