<template>
  <ElDialog v-model="dialogVisible" title="处理举报" width="600px" align-center>
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <ElFormItem label="举报人" prop="reporterName">
        <ElInput v-model="formData.reporterName" disabled />
      </ElFormItem>
      <ElFormItem label="被举报内容类型" prop="contentType">
        <ElInput
          v-model="formData.contentTypeText"
          disabled
        />
      </ElFormItem>
      <ElFormItem label="被举报内容ID" prop="contentId">
        <ElInput v-model="formData.contentId" disabled />
      </ElFormItem>
      <ElFormItem label="举报原因" prop="reason">
        <ElInput v-model="formData.reasonText" disabled />
      </ElFormItem>
      <ElFormItem label="举报说明" prop="description">
        <ElInput v-model="formData.description" type="textarea" :rows="3" disabled />
      </ElFormItem>
      <ElFormItem label="处理状态" prop="status">
        <ElSelect v-model="formData.status" placeholder="请选择处理状态">
          <ElOption label="待处理" :value="0" />
          <ElOption label="已处理" :value="1" />
          <ElOption label="已驳回" :value="2" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="处理结果" prop="result">
        <ElInput
          v-model="formData.result"
          type="textarea"
          placeholder="请输入处理结果"
          :rows="4"
          maxlength="500"
          show-word-limit
        />
      </ElFormItem>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { fetchHandleReport } from '@/api/report'

  interface Props {
    modelValue: boolean
    dialogType: string
    reportData?: any
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const formRef = ref<FormInstance>()

  const formData = reactive({
    reporterName: '',
    contentType: '',
    contentTypeText: '',
    contentId: '',
    reason: '',
    reasonText: '',
    description: '',
    status: 0,
    result: ''
  })

  const rules: FormRules = {
    status: [{ required: true, message: '请选择处理状态', trigger: 'change' }],
    result: [{ max: 500, message: '最多 500 个字符', trigger: 'blur' }]
  }

  const initFormData = () => {
    const row = props.reportData

    if (row) {
      const contentTypeMap: Record<string, string> = {
        review: '评价',
        reply: '回复'
      }
      const reasonMap: Record<string, string> = {
        fake: '虚假信息',
        defamation: '恶意诋毁',
        spam: '广告营销',
        other: '其他'
      }

      Object.assign(formData, {
        reporterName: row.userName || '',
        contentType: row.contentType || '',
        contentTypeText: contentTypeMap[row.contentType] || row.contentType,
        contentId: row.contentId || '',
        reason: row.reason || '',
        reasonText: row.reason || '',
        description: row.description || '',
        status: row.status || 0,
        result: row.result || ''
      })
    }
  }

  watch(
    () => [props.modelValue, props.reportData],
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

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        try {
          await fetchHandleReport(props.reportData.id, {
            status: formData.status,
            result: formData.result
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
