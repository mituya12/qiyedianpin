<template>
  <ElDialog
    v-model="dialogVisible"
    :title="'反馈详情'"
    width="800px"
    align-center
  >
    <div class="detail-container" v-if="detailData">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">反馈ID:</span>
            <span class="value">{{ detailData.id }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">用户名:</span>
            <span class="value">{{ detailData.userName }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">联系方式:</span>
            <span class="value">{{ detailData.contact }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">反馈分类:</span>
            <span class="value">
              <ElTag>{{ getCategoryText(detailData.category) }}</ElTag>
            </span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">处理状态:</span>
            <span class="value">
              <ElTag :type="getStatusConfig(detailData.status).type">
                {{ getStatusConfig(detailData.status).text }}
              </ElTag>
            </span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">反馈时间:</span>
            <span class="value">{{ detailData.createdAt }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">反馈内容:</span>
            <span class="value">{{ detailData.content }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20" v-if="detailData.reply">
        <ElCol :span="24">
          <div class="detail-item">
            <span class="label">管理员回复:</span>
            <span class="value">{{ detailData.reply }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20" v-if="detailData.updatedAt">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">更新时间:</span>
            <span class="value">{{ detailData.updatedAt }}</span>
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
  import { ElTag } from 'element-plus'

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

  const STATUS_CONFIG: Record<number, { type: any; text: string }> = {
    0: { type: 'warning', text: '待处理' },
    1: { type: 'success', text: '已处理' },
    2: { type: 'danger', text: '已关闭' }
  }

  const CATEGORY_CONFIG: Record<string, string> = {
    feature: '功能建议',
    bug: '问题反馈',
    content: '内容举报',
    other: '其他反馈'
  }

  const getStatusConfig = (status: number) => {
    return STATUS_CONFIG[status] || { type: 'info', text: '未知' }
  }

  const getCategoryText = (category: string) => {
    return CATEGORY_CONFIG[category] || category
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
