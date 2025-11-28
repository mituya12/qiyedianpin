<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: Record<string, any>
  }
  interface Emits {
    (e: 'update:modelValue', value: Record<string, any>): void
    (e: 'search', params: Record<string, any>): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const rules = {}

  // 在职状态选项
  const employmentStatusOptions = ref([
    { label: '当前在职', value: '当前在职' },
    { label: '已离职', value: '已离职' }
  ])

  // 评分选项
  const ratingOptions = ref([
    { label: '5星', value: 5 },
    { label: '4星', value: 4 },
    { label: '3星', value: 3 },
    { label: '2星', value: 2 },
    { label: '1星', value: 1 }
  ])

  // 是否分公司选项
  const isBranchOptions = ref([
    { label: '是', value: 1 },
    { label: '否', value: 0 }
  ])

  // 审核状态选项
  const auditStatusOptions = ref([
    { label: '待审核', value: 0 },
    { label: '已通过', value: 1 },
    { label: '已拒绝', value: 2 }
  ])

  const formItems = computed(() => [
    {
      label: '评价ID',
      key: 'id',
      type: 'input',
      placeholder: '请输入评价ID',
      clearable: true
    },
    {
      label: '企业名称',
      key: 'enterpriseName',
      type: 'input',
      placeholder: '请输入企业名称',
      clearable: true
    },
    {
      label: '评价人',
      key: 'reviewerName',
      type: 'input',
      placeholder: '请输入评价人',
      clearable: true
    },
    {
      label: '在职状态',
      key: 'employmentStatus',
      type: 'select',
      props: {
        placeholder: '请选择在职状态',
        options: employmentStatusOptions.value,
        clearable: true
      }
    },
    {
      label: '评分',
      key: 'rating',
      type: 'select',
      props: {
        placeholder: '请选择评分',
        options: ratingOptions.value,
        clearable: true
      }
    },
    {
      label: '是否分公司',
      key: 'isBranch',
      type: 'select',
      props: {
        placeholder: '请选择',
        options: isBranchOptions.value,
        clearable: true
      }
    },
    {
      label: '审核状态',
      key: 'auditStatus',
      type: 'select',
      props: {
        placeholder: '请选择审核状态',
        options: auditStatusOptions.value,
        clearable: true
      }
    },
    {
      label: '发布日期',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期范围',
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD'
      }
    }
  ])

  function handleReset() {
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
  }
</script>
