<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增回复' : '编辑回复'"
    width="600px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <ElFormItem label="回复人" prop="replierName">
        <ElInput v-model="formData.replierName" placeholder="请输入回复人" />
      </ElFormItem>
      <ElFormItem label="原评价ID" prop="reviewId">
        <ElInput v-model="formData.reviewId" placeholder="请输入原评价ID" />
      </ElFormItem>
      <ElFormItem label="回复内容" prop="content">
        <ElInput
          v-model="formData.content"
          type="textarea"
          placeholder="请输入回复内容"
          :rows="4"
          maxlength="200"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="是否官方回复" prop="isOfficial">
        <ElRadioGroup v-model="formData.isOfficial">
          <ElRadio :value="1">是</ElRadio>
          <ElRadio :value="0">否</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="审核状态" prop="auditStatus">
        <ElSelect v-model="formData.auditStatus" placeholder="请选择审核状态">
          <ElOption label="待审核" :value="0" />
          <ElOption label="已通过" :value="1" />
          <ElOption label="已拒绝" :value="2" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="备注" prop="remark">
        <ElInput
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          :rows="2"
          maxlength="200"
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

  interface Props {
    modelValue: boolean
    dialogType: string
    replyData?: any
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
    replierName: '',
    reviewId: '',
    content: '',
    isOfficial: 0,
    auditStatus: 0,
    remark: ''
  })

  const rules: FormRules = {
    replierName: [{ required: true, message: '请输入回复人', trigger: 'blur' }],
    reviewId: [{ required: true, message: '请输入原评价ID', trigger: 'blur' }],
    content: [
      { required: true, message: '请输入回复内容', trigger: 'blur' },
      { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
    ],
    isOfficial: [{ required: true, message: '请选择是否官方回复', trigger: 'change' }],
    auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }

  const initFormData = () => {
    const isEdit = props.dialogType === 'edit' && props.replyData
    const row = props.replyData

    Object.assign(formData, {
      replierName: isEdit ? row.author || '' : '',
      reviewId: isEdit ? row.reviewId || '' : '',
      content: isEdit ? row.content || '' : '',
      isOfficial: isEdit ? row.isOfficial || 0 : 0,
      auditStatus: isEdit ? row.auditStatus || 0 : 0,
      remark: isEdit ? row.remark || '' : ''
    })
  }

  watch(
    () => [props.modelValue, props.dialogType, props.replyData],
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

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(props.dialogType === 'add' ? '新增成功' : '编辑成功')
        dialogVisible.value = false
        emit('success')
      }
    })
  }
</script>
