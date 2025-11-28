<template>
  <div class="admin-settings-page art-full-height">
    <AdminSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></AdminSearch>

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增管理员</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>

    <AdminDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :admin-data="currentAdminData"
      @success="refreshData"
    />

    <!-- 管理员详情弹窗 -->
    <AdminDetail v-model="detailVisible" :detail-data="currentAdminData" />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import AdminSearch from './modules/admin-search.vue'
  import AdminDialog from './modules/admin-dialog.vue'
  import AdminDetail from './modules/admin-detail.vue'
  import { fetchAdminList, fetchDeleteAdmin } from '@/api/admin'

  defineOptions({ name: 'AdminSettings' })

  interface AdminItem {
    id: number
    username: string
    name: string
    role: string
    status: number
    remark: string
    lastLoginAt: string
    createdAt: string
  }

  const searchForm = ref({
    username: undefined,
    name: undefined,
    role: undefined,
    status: undefined
  })

  const showSearchBar = ref(true)
  const dialogVisible = ref(false)
  const detailVisible = ref(false)
  const dialogType = ref<Form.DialogType>('add')
  const currentAdminData = ref<AdminItem | undefined>(undefined)

  const STATUS_CONFIG: Record<number, { type: any; text: string }> = {
    0: { type: 'danger', text: '禁用' },
    1: { type: 'success', text: '正常' }
  }

  const ROLE_CONFIG: Record<string, string> = {
    R_SUPER: '超级管理员',
    R_ADMIN: '管理员',
    R_USER: '普通用户'
  }

  const getStatusConfig = (status: number) => {
    return STATUS_CONFIG[status] || { type: 'info', text: '未知' }
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
    core: {
      apiFn: fetchAdminList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '管理员ID', minWidth: 100 },
        { prop: 'username', label: '管理员账号', minWidth: 120 },
        { prop: 'name', label: '管理员姓名', minWidth: 120 },
        {
          prop: 'role',
          label: '角色',
          minWidth: 120,
          formatter: (row) => ROLE_CONFIG[row.role] || row.role
        },
        {
          prop: 'status',
          label: '状态',
          minWidth: 100,
          formatter: (row) => {
            const statusConfig = getStatusConfig(row.status)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        { prop: 'remark', label: '备注', minWidth: 150, showOverflowTooltip: true },
        { prop: 'lastLoginAt', label: '最后登录时间', minWidth: 160 },
        { prop: 'createdAt', label: '创建时间', minWidth: 160, sortable: true },
        {
          prop: 'operation',
          label: '操作',
          minWidth: 180,
          fixed: 'right',
          formatter: (row) =>
            h('div', { style: 'display: flex; gap: 8px;' }, [
              h(ArtButtonTable, {
                type: 'view',
                onClick: () => viewDetail(row)
              }),
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                text: row.status === 1 ? '禁用' : '启用',
                onClick: () => toggleStatus(row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteAdmin(row)
              })
            ])
        }
      ]
    }
  })

  const handleSearch = (params: Record<string, any>) => {
    Object.assign(searchParams, params)
    getData()
  }

  const showDialog = (type: Form.DialogType, row?: AdminItem): void => {
    dialogType.value = type
    currentAdminData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const viewDetail = (row: AdminItem): void => {
    currentAdminData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  const toggleStatus = async (row: AdminItem): Promise<void> => {
    const action = row.status === 1 ? '禁用' : '启用'
    try {
      await ElMessageBox.confirm(`确定要${action}该管理员吗？`, `${action}管理员`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      // TODO: 调用更新状态API
      ElMessage.success(`${action}成功`)
      refreshData()
    } catch (error) {
      // 用户取消
    }
  }

  const deleteAdmin = async (row: AdminItem): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除管理员“${row.name}”吗？`, '删除管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      
      await fetchDeleteAdmin(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      // 用户取消
    }
  }
</script>

<style scoped lang="scss">
  .admin-settings-page {
    padding: 0;
  }
</style>
