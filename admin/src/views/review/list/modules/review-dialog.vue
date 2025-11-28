<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '新增评价' : '编辑评价'"
    width="700px"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <ElFormItem label="企业名称" prop="enterpriseName">
        <ElInput v-model="formData.enterpriseName" placeholder="请输入企业名称" />
      </ElFormItem>
      <ElFormItem label="评价人" prop="reviewerName">
        <ElInput v-model="formData.reviewerName" placeholder="请输入评价人" />
      </ElFormItem>
      <ElFormItem label="在职状态" prop="status">
        <ElSelect v-model="formData.status" placeholder="请选择在职状态">
          <ElOption label="当前在职" value="当前在职" />
          <ElOption label="已离职" value="已离职" />
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="所在部门" prop="department">
        <ElInput v-model="formData.department" placeholder="请输入所在部门" maxlength="30" />
      </ElFormItem>
      <ElFormItem label="是否分公司" prop="isBranch">
        <ElRadioGroup v-model="formData.isBranch">
          <ElRadio :value="1">是</ElRadio>
          <ElRadio :value="0">否</ElRadio>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="评分" prop="rating">
        <ElRate v-model="formData.rating" />
      </ElFormItem>
      <ElFormItem label="评价内容" prop="content">
        <ElInput
          v-model="formData.content"
          type="textarea"
          placeholder="请输入评价内容"
          :rows="4"
          maxlength="500"
          show-word-limit
        />
      </ElFormItem>
      <ElFormItem label="薪资待遇" prop="salary">
        <ElInput v-model="formData.salary" placeholder="请输入薪资待遇" maxlength="50" />
      </ElFormItem>
      <ElFormItem label="福利待遇" prop="benefits">
        <ElInput
          v-model="formData.benefits"
          type="textarea"
          placeholder="请输入福利待遇"
          :rows="3"
          maxlength="200"
          show-word-limit
        />
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
    reviewData?: any
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
    enterpriseName: '',
    reviewerName: '',
    status: '当前在职',
    department: '',
    isBranch: 0,
    rating: 5,
    content: '',
    salary: '',
    benefits: '',
    auditStatus: 0,
    remark: ''
  })

  const rules: FormRules = {
    enterpriseName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
    reviewerName: [{ required: true, message: '请输入评价人', trigger: 'blur' }],
    status: [{ required: true, message: '请选择在职状态', trigger: 'change' }],
    department: [
      { required: true, message: '请输入所在部门', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ],
    isBranch: [{ required: true, message: '请选择是否分公司', trigger: 'change' }],
    rating: [{ required: true, message: '请选择评分', trigger: 'change' }],
    content: [
      { required: true, message: '请输入评价内容', trigger: 'blur' },
      { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
    ],
    auditStatus: [{ required: true, message: '请选择审核状态', trigger: 'change' }]
  }

  const initFormData = () => {
    const isEdit = props.dialogType === 'edit' && props.reviewData
    const row = props.reviewData

    Object.assign(formData, {
      enterpriseName: isEdit ? row.companyName || '' : '',
      reviewerName: isEdit ? row.authorName || '' : '',
      status: isEdit ? row.status || '当前在职' : '当前在职',
      department: isEdit ? row.department || '' : '',
      isBranch: isEdit ? row.isBranch || 0 : 0,
      rating: isEdit ? row.rating || 5 : 5,
      content: isEdit ? row.content || '' : '',
      salary: isEdit ? row.salary || '' : '',
      benefits: isEdit ? row.benefits || '' : '',
      auditStatus: isEdit ? row.auditStatus || 0 : 0,
      remark: isEdit ? row.remark || '' : ''
    })
  }

  watch(
    () => [props.modelValue, props.dialogType, props.reviewData],
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
