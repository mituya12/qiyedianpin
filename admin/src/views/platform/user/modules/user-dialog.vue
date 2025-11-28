<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
    width="500px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="100px">
      <ElFormItem label="用户昵称" prop="name">
        <ElInput v-model="formData.name" placeholder="请输入用户昵称" maxlength="50" />
      </ElFormItem>

      <ElFormItem label="用户头像" prop="avatar">
        <ElInput v-model="formData.avatar" placeholder="请输入头像URL" />
      </ElFormItem>

      <ElFormItem label="个人简介" prop="bio">
        <ElInput
          v-model="formData.bio"
          type="textarea"
          placeholder="请输入个人简介"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
      </ElFormItem>

      <ElFormItem label="账号状态" prop="status">
        <ElRadioGroup v-model="formData.status">
          <ElRadio :value="1">正常</ElRadio>
          <ElRadio :value="0">禁用</ElRadio>
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

  interface Props {
    visible: boolean
    type: string
    userData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    name: '',
    avatar: '',
    bio: '',
    status: 1
  })

  // 表单验证规则
  const rules: FormRules = {
    name: [
      { required: true, message: '请输入用户昵称', trigger: 'blur' },
      { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
    ],
    avatar: [
      { required: false, message: '请输入头像URL', trigger: 'blur' }
    ],
    bio: [
      { required: false, message: '请输入个人简介', trigger: 'blur' },
      { max: 200, message: '长度不超过 200 个字符', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择账号状态', trigger: 'change' }
    ]
  }

  // 初始化表单数据
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData

    Object.assign(formData, {
      name: isEdit ? row.name || '' : '',
      avatar: isEdit ? row.avatar || '' : '',
      bio: isEdit ? row.bio || '' : '',
      status: isEdit ? row.status || 1 : 1
    })
  }

  // 统一监听对话框状态变化
  watch(
    () => [props.visible, props.type, props.userData],
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

    await formRef.value.validate((valid) => {
      if (valid) {
        ElMessage.success(dialogType.value === 'add' ? '新增成功' : '更新成功')
        dialogVisible.value = false
        emit('submit')
      }
    })
  }
</script>

<style lang="scss" scoped>
  // 样式已简化
</style>

