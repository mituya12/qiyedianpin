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

  const roleOptions = ref([
    { label: '超级管理员', value: 'R_SUPER' },
    { label: '管理员', value: 'R_ADMIN' },
    { label: '普通用户', value: 'R_USER' }
  ])

  const statusOptions = ref([
    { label: '正常', value: 1 },
    { label: '禁用', value: 0 }
  ])

  const formItems = computed(() => [
    {
      label: '管理员账号',
      key: 'account',
      type: 'input',
      placeholder: '请输入管理员账号',
      clearable: true
    },
    {
      label: '管理员姓名',
      key: 'name',
      type: 'input',
      placeholder: '请输入管理员姓名',
      clearable: true
    },
    {
      label: '角色',
      key: 'role',
      type: 'select',
      props: {
        placeholder: '请选择角色',
        options: roleOptions.value,
        clearable: true
      }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: statusOptions.value,
        clearable: true
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
