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

  const isOfficialOptions = ref([
    { label: '是', value: 1 },
    { label: '否', value: 0 }
  ])

  const auditStatusOptions = ref([
    { label: '待审核', value: 0 },
    { label: '已通过', value: 1 },
    { label: '已拒绝', value: 2 }
  ])

  const formItems = computed(() => [
    {
      label: '回复ID',
      key: 'id',
      type: 'input',
      placeholder: '请输入回复ID',
      clearable: true
    },
    {
      label: '回复人',
      key: 'replierName',
      type: 'input',
      placeholder: '请输入回复人',
      clearable: true
    },
    {
      label: '原评价ID',
      key: 'reviewId',
      type: 'input',
      placeholder: '请输入原评价ID',
      clearable: true
    },
    {
      label: '是否官方回复',
      key: 'isOfficial',
      type: 'select',
      props: {
        placeholder: '请选择',
        options: isOfficialOptions.value,
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
      label: '回复日期',
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
