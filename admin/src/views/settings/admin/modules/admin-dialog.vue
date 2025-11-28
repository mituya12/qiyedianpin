<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增管理员' : '编辑管理员'"
    width="600px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <ElFormItem label="管理员账号" prop="account">
        <ElInput v-model="formData.account" placeholder="请输入管理员账号" maxlength="20" />
      </ElFormItem>
      <ElFormItem label="管理员姓名" prop="name">
        <ElInput v-model="formData.name" placeholder="请输入管理员姓名" maxlength="20" />
      </ElFormItem>
      <ElFormItem label="登录密码" prop="password">
        <ElInput
          v-model="formData.password"
          type="password"
          placeholder="请输入登录密码"
          maxlength="20"
          show-password
        />
      </ElFormItem>
      <ElFormItem label="角色" prop="role">
        <ElSelect v-model="formData.role" placeholder="请选择角色">
          <ElOption label="超级管理员" value="R_SUPER" />
          <ElOption label="管理员" value="R_ADMIN" />
          <ElOption label="普通用户" value="R_USER" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="状态" prop="status">
        <ElRadioGroup v-model="formData.status">
          <ElRadio :value="1">正常</ElRadio>
          <ElRadio :value="0">禁用</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="备注" prop="remark">
        <ElInput
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入备注"
          :rows="3"
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
    adminData?: any
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
    account: '',
    name: '',
    password: '',
    role: 'R_ADMIN',
    status: 1,
    remark: ''
  })

  const rules: FormRules = {
    account: [
      { required: true, message: '请输入管理员账号', trigger: 'blur' },
      { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入管理员姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      {
        required: props.dialogType === 'add',
        message: '请输入登录密码',
        trigger: 'blur'
      },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  }

  const initFormData = () => {
    const isEdit = props.dialogType === 'edit' && props.adminData
    const row = props.adminData

    Object.assign(formData, {
      account: isEdit ? row.username || '' : '',
      name: isEdit ? row.name || '' : '',
      password: '',
      role: isEdit ? row.role || 'R_ADMIN' : 'R_ADMIN',
      status: isEdit ? row.status || 1 : 1,
      remark: isEdit ? row.remark || '' : ''
    })
  }

  watch(
    () => [props.modelValue, props.dialogType, props.adminData],
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
