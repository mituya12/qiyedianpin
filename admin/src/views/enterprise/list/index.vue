<template>
  <div class="enterprise-page art-full-height">
    <!-- 搜索栏 -->
    <EnterpriseSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></EnterpriseSearch>

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <!-- 表格头部 -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增企业</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
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

    <!-- 企业编辑弹窗 -->
    <EnterpriseDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :enterprise-data="currentEnterpriseData"
      @success="refreshData"
    />

    <!-- 企业详情弹窗 -->
    <EnterpriseDetail v-model="detailVisible" :detail-data="currentEnterpriseData" />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import EnterpriseSearch from './modules/enterprise-search.vue'
  import EnterpriseDialog from './modules/enterprise-dialog.vue'
  import EnterpriseDetail from './modules/enterprise-detail.vue'
  import { fetchEnterpriseList, fetchDeleteEnterprise } from '@/api/enterprise'

  defineOptions({ name: 'EnterpriseList' })

  interface EnterpriseItem {
    id: number
    name: string
    alias: string
    totalRating: number
    reviewCount: number
    createdAt: string
  }

  // 搜索表单
  const searchForm = ref({
    name: undefined,
    alias: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(true)
  const dialogVisible = ref(false)
  const detailVisible = ref(false)
  const dialogType = ref<Form.DialogType>('add')
  const currentEnterpriseData = ref<EnterpriseItem | undefined>(undefined)

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
      apiFn: fetchEnterpriseList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '企业ID', minWidth: 80 },
        { prop: 'name', label: '企业名称', minWidth: 180 },
        { prop: 'alias', label: '企业别名', minWidth: 120 },
        {
          prop: 'totalRating',
          label: '综合评分',
          minWidth: 100,
          formatter: (row) => row.totalRating
        },
        { prop: 'reviewCount', label: '评价数量', minWidth: 100 },
        {
          prop: 'createdAt',
          label: '创建时间',
          minWidth: 160,
          sortable: true
        },
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
                type: 'delete',
                onClick: () => deleteEnterprise(row)
              })
            ])
        }
      ]
    }
  })

  // 搜索处理
  const handleSearch = (params: Record<string, any>) => {
    Object.assign(searchParams, params)
    getData()
  }

  // 显示弹窗
  const showDialog = (type: Form.DialogType, row?: EnterpriseItem): void => {
    dialogType.value = type
    currentEnterpriseData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  // 查看详情
  const viewDetail = (row: EnterpriseItem): void => {
    currentEnterpriseData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  // 删除企业
  const deleteEnterprise = async (row: EnterpriseItem): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除企业"${row.name}"吗？`, '删除企业', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      
      await fetchDeleteEnterprise(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      // 用户取消操作
    }
  }
</script>

<style scoped lang="scss">
  .enterprise-page {
    padding: 0;
  }
</style>
