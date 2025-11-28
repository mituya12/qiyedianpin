<template>
  <ElDialog v-model="dialogVisible" title="管理员详情" width="800px" align-center>
    <div class="detail-container">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">管理员ID:</span>
            <span class="value">{{ detailData.id }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">管理员账号:</span>
            <span class="value">{{ detailData.account }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">管理员姓名:</span>
            <span class="value">{{ detailData.name }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">角色:</span>
            <span class="value">
              <ElTag>{{ getRoleText(detailData.role) }}</ElTag>
            </span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">状态:</span>
            <span class="value">
              <ElTag :type="detailData.status === 'normal' ? 'success' : 'danger'">
                {{ detailData.status === 'normal' ? '正常' : '禁用' }}
              </ElTag>
            </span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">最后登录时间:</span>
            <span class="value">{{ detailData.lastLoginTime || '-' }}</span>
          </div>
        </ElCol>
      </ElRow>

      <ElRow :gutter="20">
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">创建时间:</span>
            <span class="value">{{ detailData.createTime }}</span>
          </div>
        </ElCol>
        <ElCol :span="12">
          <div class="detail-item">
            <span class="label">更新时间:</span>
            <span class="value">{{ detailData.updateTime || '-' }}</span>
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

  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      R_SUPER: '超级管理员',
      R_ADMIN: '管理员',
      R_USER: '普通用户'
    }
    return roleMap[role] || role
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
