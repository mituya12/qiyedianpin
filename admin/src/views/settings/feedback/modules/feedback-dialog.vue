<template>
  <ElDialog
    v-model="dialogVisible"
    :title="'处理反馈'"
    width="600px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="用户名" prop="userName">
        <ElInput v-model="formData.userName" disabled />
      </ElFormItem>

      <ElFormItem label="反馈内容" prop="content">
        <ElInput
          v-model="formData.content"
          type="textarea"
          disabled
          :rows="4"
        />
      </ElFormItem>

      <ElFormItem label="管理员回复" prop="reply">
        <ElInput
          v-model="formData.reply"
          type="textarea"
          placeholder="请输入处理结果或回复内容"
          :rows="4"
          maxlength="500"
          show-word-limit
        />
      </ElFormItem>

      <ElFormItem label="处理状态" prop="status">
        <ElRadioGroup v-model="formData.status">
          <ElRadio :value="1">已处理</ElRadio>
          <ElRadio :value="2">已关闭</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确定</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { fetchHandleFeedback } from '@/api/feedback'

  interface Props {
    visible: boolean
    dialogType: string
    feedbackData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    userName: '',
    content: '',
    reply: '',
    status: 1
  })

  // 表单验证规则
  const rules: FormRules = {
    reply: [
      { required: true, message: '请输入管理员回复', trigger: 'blur' },
      { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择处理状态', trigger: 'change' }
    ]
  }

  // 初始化表单数据
  const initFormData = () => {
    const row = props.feedbackData

    Object.assign(formData, {
      userName: row?.userName || '',
      content: row?.content || '',
      reply: row?.reply || '',
      status: row?.status || 1
    })
  }

  // 统一监听对话框状态变化
  watch(
    () => [props.visible, props.feedbackData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  // 提交表单
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          await fetchHandleFeedback(props.feedbackData.id, {
            reply: formData.reply,
            status: formData.status
          })
          ElMessage.success('处理成功')
          dialogVisible.value = false
          emit('success')
        } catch (error) {
          ElMessage.error('处理失败')
        }
      }
    })
  }
</script>
