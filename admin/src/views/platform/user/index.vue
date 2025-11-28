<!-- 平台管理-用户管理 -->
<template>
  <div class="platform-user-page art-full-height">
    <!-- 搜索栏 -->
    <UserSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></UserSearch>

    <ElCard class="art-table-card" shadow="never">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 用户弹窗 -->
      <UserDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentUserData"
        @submit="handleDialogSubmit"
      />

      <!-- 重置密码弹窗 -->
      <ResetPasswordDialog
        v-model:visible="resetPasswordVisible"
        :user-id="currentUserId"
        @submit="handleResetPasswordSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import { ElMessageBox, ElMessage, ElTag } from 'element-plus'
  import { Edit, Delete, Key } from '@element-plus/icons-vue'
  import { useTable } from '@/composables/useTable'
  import UserSearch from './modules/user-search.vue'
  import UserDialog from './modules/user-dialog.vue'
  import ResetPasswordDialog from './modules/reset-password-dialog.vue'
  import { fetchUserList, fetchDeleteUser } from '@/api/user'

  defineOptions({ name: 'PlatformUser' })

  interface PlatformUser {
    id: number
    name: string
    avatar: string
    bio: string
    reviewCount: number
    replyCount: number
    totalLikes: number
    status: number
    createdAt: string
    lastLoginAt: string
  }

  // 弹窗相关
  const dialogType = ref<Form.DialogType>('add')
  const dialogVisible = ref(false)
  const currentUserData = ref<Partial<PlatformUser>>({})

  // 重置密码弹窗
  const resetPasswordVisible = ref(false)
  const currentUserId = ref('')

  // 选中行
  const selectedRows = ref<PlatformUser[]>([])

  // 搜索表单
  const searchForm = ref({
    name: undefined,
    userId: undefined,
    status: undefined,
    daterange: undefined
  })

  // 状态配置
  const STATUS_CONFIG = {
    0: { type: 'danger' as const, text: '禁用' },
    1: { type: 'success' as const, text: '正常' }
  } as const

  /**
   * 获取状态配置
   */
  const getStatusConfig = (status: number) => {
    return (
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || {
        type: 'info' as const,
        text: '未知'
      }
    )
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    searchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchUserList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '用户ID', minWidth: 80 },
        { prop: 'name', label: '用户名', minWidth: 120 },
        {
          prop: 'avatar',
          label: '头像',
          minWidth: 80,
          formatter: (row) =>
            h('img', {
              src: row.avatar || 'https://via.placeholder.com/40',
              style: 'width: 40px; height: 40px; border-radius: 6px;'
            })
        },
        { prop: 'bio', label: '个人简介', minWidth: 150, showOverflowTooltip: true },
        { prop: 'reviewCount', label: '发布评价数', minWidth: 100 },
        { prop: 'replyCount', label: '回复数', minWidth: 80 },
        { prop: 'totalLikes', label: '获赞总数', minWidth: 100 },
        {
          prop: 'status',
          label: '账号状态',
          minWidth: 100,
          formatter: (row) => {
            const config = getStatusConfig(row.status)
            return h(ElTag, { type: config.type }, () => config.text)
          }
        },
        {
          prop: 'createdAt',
          label: '注册时间',
          minWidth: 160,
          sortable: true
        },
        {
          prop: 'lastLoginAt',
          label: '最后登录时间',
          minWidth: 160,
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          minWidth: 180,
          fixed: 'right',
          formatter: (row) =>
            h('div', { style: 'display: flex; align-items: center; gap: 8px;' }, [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              }),
              h(ArtButtonMore, {
                list: [
                  {
                    key: 'resetPassword',
                    label: '重置密码',
                    icon: Key
                  }
                ],
                onClick: (item: ButtonMoreItem) => {
                  if (item.key === 'resetPassword') {
                    showResetPasswordDialog(row)
                  }
                }
              })
            ])
        }
      ]
    },
    // 数据处理
    transform: {
      dataTransformer: (records: any) => {
        if (!Array.isArray(records)) {
          console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
          return []
        }
        return records
      }
    }
  })

  /**
   * 搜索处理
   */
  const handleSearch = (params: Record<string, any>) => {
    const { daterange, ...rest } = params
    const searchParams = {
      ...rest,
      startDate: daterange?.[0],
      endDate: daterange?.[1]
    }
    getData(searchParams)
  }

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: Form.DialogType, row?: PlatformUser): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    currentUserData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 显示重置密码弹窗
   */
  const showResetPasswordDialog = (row: PlatformUser): void => {
    console.log('打开重置密码弹窗:', row)
    currentUserId.value = row.id
    nextTick(() => {
      resetPasswordVisible.value = true
    })
  }

  /**
   * 删除用户
   */
  const deleteUser = async (row: PlatformUser): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除用户“${row.name}”吗？`, '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      
      await fetchDeleteUser(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      // 用户取消操作
    }
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentUserData.value = {}
      refreshData()
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理重置密码提交事件
   */
  const handleResetPasswordSubmit = async () => {
    try {
      resetPasswordVisible.value = false
      currentUserId.value = ''
    } catch (error) {
      console.error('重置密码失败:', error)
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: PlatformUser[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>

<style lang="scss" scoped>
  .platform-user-page {
    :deep(.avatar) {
      width: 40px;
      height: 40px;
      border-radius: 6px;
    }
  }
</style>

