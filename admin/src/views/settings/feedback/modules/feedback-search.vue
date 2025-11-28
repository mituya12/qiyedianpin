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

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {}

  // 反馈分类选项
  const categoryOptions = ref([
    { label: '全部', value: undefined },
    { label: '功能建议', value: 'feature' },
    { label: '问题反馈', value: 'bug' },
    { label: '内容举报', value: 'content' },
    { label: '其他反馈', value: 'other' }
  ])

  // 处理状态选项
  const statusOptions = ref([
    { label: '全部', value: undefined },
    { label: '待处理', value: 0 },
    { label: '已处理', value: 1 },
    { label: '已关闭', value: 2 }
  ])

  // 表单配置
  const formItems = computed(() => [
    {
      label: '反馈ID',
      key: 'feedbackId',
      type: 'input',
      placeholder: '请输入反馈ID',
      clearable: true
    },
    {
      label: '用户名',
      key: 'userName',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    },
    {
      label: '反馈分类',
      key: 'category',
      type: 'select',
      props: {
        placeholder: '请选择反馈分类',
        options: categoryOptions.value,
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
      label: '反馈时间',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期范围',
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          { text: '今日', value: [new Date(), new Date()] },
          {
            text: '最近一周',
            value: [new Date(Date.now() - 604800000), new Date()]
          },
          {
            text: '最近一个月',
            value: [new Date(Date.now() - 2592000000), new Date()]
          }
        ]
      }
    }
  ])

  // 事件
  function handleReset() {
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
  }
</script>
