<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增企业' : '编辑企业'"
    width="600px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="企业名称" prop="name">
        <ElInput v-model="formData.name" placeholder="请输入企业名称" maxlength="50" />
      </ElFormItem>
      <ElFormItem label="企业别名" prop="alias">
        <ElInput v-model="formData.alias" placeholder="请输入企业别名" maxlength="20" />
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
  import { fetchCreateEnterprise, fetchUpdateEnterprise } from '@/api/enterprise'

  interface Props {
    modelValue: boolean
    dialogType: string
    enterpriseData?: any
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    name: '',
    alias: ''
  })

  // 表单验证规则
  const rules: FormRules = {
    name: [
      { required: true, message: '请输入企业名称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    alias: [{ min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }]
  }

  // 初始化表单数据
  const initFormData = () => {
    const isEdit = props.dialogType === 'edit' && props.enterpriseData
    const row = props.enterpriseData

    Object.assign(formData, {
      name: isEdit ? row.name || '' : '',
      alias: isEdit ? row.alias || '' : ''
    })
  }

  // 监听对话框状态变化
  watch(
    () => [props.modelValue, props.dialogType, props.enterpriseData],
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

    try {
      const valid = await formRef.value.validate()
      if (!valid) return

      const params = {
        name: formData.name,
        alias: formData.alias
      }

      if (props.dialogType === 'add') {
        await fetchCreateEnterprise(params)
        ElMessage.success('新增成功')
      } else {
        await fetchUpdateEnterprise(props.enterpriseData.id, params)
        ElMessage.success('编辑成功')
      }

      dialogVisible.value = false
      emit('success')
    } catch (error) {
      // 错误已在请求拦截器中处理
    }
  }
</script>
