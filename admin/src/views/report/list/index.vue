<template>
  <div class="report-page art-full-height">
    <ReportSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></ReportSearch>

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

    <ReportDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :report-data="currentReportData"
      @success="refreshData"
    />

    <!-- 举报详情弹窗 -->
    <ReportDetail v-model="detailVisible" :detail-data="currentReportData" />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ReportSearch from './modules/report-search.vue'
  import ReportDialog from './modules/report-dialog.vue'
  import ReportDetail from './modules/report-detail.vue'
  import { fetchReportList, fetchDeleteReport, fetchHandleReport } from '@/api/report'

  defineOptions({ name: 'ReportList' })

  interface ReportItem {
    id: number
    userId: number
    userName: string
    contentType: string
    contentId: number
    reason: string
    description: string
    status: number
    result?: string
    createdAt: string
    updatedAt?: string
  }

  const searchForm = ref({
    reportId: undefined,
    userName: undefined,
    contentType: undefined,
    reason: undefined,
    status: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(true)
  const dialogVisible = ref(false)
  const detailVisible = ref(false)
  const dialogType = ref<Form.DialogType>('edit')
  const currentReportData = ref<ReportItem | undefined>(undefined)

  const STATUS_CONFIG: Record<number, { type: any; text: string }> = {
    0: { type: 'warning', text: '待处理' },
    1: { type: 'success', text: '已处理' },
    2: { type: 'danger', text: '已驳回' }
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
      apiFn: fetchReportList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '举报ID', minWidth: 80 },
        { prop: 'userName', label: '举报人', minWidth: 100 },
        {
          prop: 'contentType',
          label: '被举报内容类型',
          minWidth: 140,
          formatter: (row) => {
            const typeMap = { 'review': '评价', 'reply': '回复' }
            return typeMap[row.contentType] || row.contentType
          }
        },
        { prop: 'contentId', label: '被举报内容ID', minWidth: 140 },
        { prop: 'reason', label: '举报原因', minWidth: 150, showOverflowTooltip: true },
        { prop: 'description', label: '举报描述', minWidth: 200, showOverflowTooltip: true },
        {
          prop: 'status',
          label: '处理状态',
          minWidth: 100,
          formatter: (row) => {
            const statusConfig = getStatusConfig(row.status)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        { prop: 'createdAt', label: '举报时间', minWidth: 160, sortable: true },
        {
          prop: 'operation',
          label: '操作',
          minWidth: 200,
          fixed: 'right',
          formatter: (row) =>
            h('div', { style: 'display: flex; gap: 8px;' }, [
              h(ArtButtonTable, {
                type: 'view',
                onClick: () => viewDetail(row)
              }),
              row.status === 0
                ? h(ArtButtonTable, {
                    type: 'edit',
                    onClick: () => showDialog('edit', row)
                  })
                : null,
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteReport(row)
              })
            ])
        }
      ]
    }
  })

  const handleSearch = (params: Record<string, any>) => {
    const { daterange, ...rest } = params
    const searchParams = {
      ...rest,
      startDate: daterange?.[0],
      endDate: daterange?.[1]
    }
    getData(searchParams)
  }

  const showDialog = (type: Form.DialogType, row?: ReportItem): void => {
    dialogType.value = type
    currentReportData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const viewDetail = (row: ReportItem): void => {
    currentReportData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  const deleteReport = async (row: ReportItem): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除该举报记录吗？`, '删除举报', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      
      await fetchDeleteReport(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      // 用户取消
    }
  }
</script>

<style scoped lang="scss">
  .report-page {
    padding: 0;
  }
</style>
