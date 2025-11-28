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

  const contentTypeOptions = ref([
    { label: '评价', value: 'review' },
    { label: '回复', value: 'reply' }
  ])

  const reasonOptions = ref([
    { label: '虚假信息', value: 'fake' },
    { label: '恶意诋毁', value: 'defamation' },
    { label: '广告营销', value: 'spam' },
    { label: '其他', value: 'other' }
  ])

  const statusOptions = ref([
    { label: '待处理', value: 'pending' },
    { label: '已处理', value: 'processed' },
    { label: '已驳回', value: 'rejected' }
  ])

  const formItems = computed(() => [
    {
      label: '举报ID',
      key: 'id',
      type: 'input',
      placeholder: '请输入举报ID',
      clearable: true
    },
    {
      label: '举报人',
      key: 'reporterName',
      type: 'input',
      placeholder: '请输入举报人',
      clearable: true
    },
    {
      label: '被举报内容类型',
      key: 'contentType',
      type: 'select',
      props: {
        placeholder: '请选择',
        options: contentTypeOptions.value,
        clearable: true
      }
    },
    {
      label: '举报原因',
      key: 'reason',
      type: 'select',
      props: {
        placeholder: '请选择举报原因',
        options: reasonOptions.value,
        clearable: true
      }
    },
    {
      label: '处理状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择处理状态',
        options: statusOptions.value,
        clearable: true
      }
    },
    {
      label: '举报日期',
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
