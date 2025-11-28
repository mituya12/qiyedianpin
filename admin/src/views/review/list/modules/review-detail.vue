<template>
  <ElDialog v-model="dialogVisible" title="评价详情" width="800px" align-center>
    <div class="detail-container">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">评价ID:</span>
            <span class="value">{{ detailData.id }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">企业名称:</span>
            <span class="value">{{ detailData.companyName }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">评价人:</span>
            <span class="value">{{ detailData.authorName }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">评分:</span>
            <span class="value">
              <ElRate v-model="detailData.rating" disabled show-score />
            </span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">在职状态:</span>
            <span class="value">
              <ElTag :type="getStatusType(detailData.status)">
                {{ detailData.status }}
              </ElTag>
            </span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">是否分公司:</span>
            <span class="value">
              <ElTag :type="detailData.isBranch === 1 ? 'success' : 'info'">
                {{ detailData.isBranch === 1 ? '是' : '否' }}
              </ElTag>
            </span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">评价内容:</span>
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
            <span class="label">评价时间:</span>
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

  const getStatusType = (status: string) => {
    const statusMap: Record<string, any> = {
      '当前在职': 'success',
      '已离职': 'warning'
    }
    return statusMap[status] || 'info'
  }

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
