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

  // 账号状态选项
  const statusOptions = ref([
    { label: '全部', value: undefined },
    { label: '正常', value: 1 },
    { label: '禁用', value: 0 }
  ])

  // 表单配置
  const formItems = computed(() => [
    {
      label: '用户名',
      key: 'name',
      type: 'input',
      placeholder: '请输入用户名',
      clearable: true
    },
    {
      label: '用户ID',
      key: 'userId',
      type: 'input',
      placeholder: '请输入用户ID',
      clearable: true
    },
    {
      label: '账号状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择账号状态',
        options: statusOptions.value,
        clearable: true
      }
    },
    {
      label: '注册时间',
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
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch() {
    await searchBarRef.value.validate()
    emit('search', formData.value)
    console.log('表单数据', formData.value)
  }
</script>

