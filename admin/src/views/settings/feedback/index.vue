<template>
  <div class="feedback-page art-full-height">
    <FeedbackSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></FeedbackSearch>

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

    <FeedbackDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :feedback-data="currentFeedbackData"
      @success="refreshData"
    />

    <!-- 反馈详情弹窗 -->
    <FeedbackDetail v-model="detailVisible" :detail-data="currentFeedbackData" />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import FeedbackSearch from './modules/feedback-search.vue'
  import FeedbackDialog from './modules/feedback-dialog.vue'
  import FeedbackDetail from './modules/feedback-detail.vue'
  import { fetchFeedbackList, fetchDeleteFeedback } from '@/api/feedback'

  defineOptions({ name: 'SettingsFeedback' })

  interface FeedbackItem {
    id: number
    userId: number
    userName: string
    contact: string
    category: string
    content: string
    status: number
    reply?: string
    createdAt: string
    updatedAt?: string
  }

  const searchForm = ref({
    feedbackId: undefined,
    userName: undefined,
    category: undefined,
    status: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(true)
  const dialogVisible = ref(false)
  const detailVisible = ref(false)
  const dialogType = ref<Form.DialogType>('edit')
  const currentFeedbackData = ref<FeedbackItem | undefined>(undefined)

  const STATUS_CONFIG: Record<number, { type: any; text: string }> = {
    0: { type: 'warning', text: '待处理' },
    1: { type: 'success', text: '已处理' },
    2: { type: 'danger', text: '已关闭' }
  }

  const CATEGORY_CONFIG: Record<string, string> = {
    feature: '功能建议',
    bug: '问题反馈',
    content: '内容举报',
    other: '其他反馈'
  }

  const getStatusConfig = (status: number) => {
    return STATUS_CONFIG[status] || { type: 'info', text: '未知' }
  }

  const getCategoryText = (category: string) => {
    return CATEGORY_CONFIG[category] || category
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
      apiFn: fetchFeedbackList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '反馈ID', minWidth: 80 },
        { prop: 'userName', label: '用户名', minWidth: 100 },
        { prop: 'contact', label: '联系方式', minWidth: 120, showOverflowTooltip: true },
        {
          prop: 'category',
          label: '反馈分类',
          minWidth: 100,
          formatter: (row) => getCategoryText(row.category)
        },
        { prop: 'content', label: '反馈内容', minWidth: 200, showOverflowTooltip: true },
        {
          prop: 'status',
          label: '处理状态',
          minWidth: 100,
          formatter: (row) => {
            const statusConfig = getStatusConfig(row.status)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        { prop: 'createdAt', label: '反馈时间', minWidth: 160, sortable: true },
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
                onClick: () => deleteFeedback(row)
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

  const showDialog = (type: Form.DialogType, row?: FeedbackItem): void => {
    dialogType.value = type
    currentFeedbackData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const viewDetail = (row: FeedbackItem): void => {
    currentFeedbackData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  const deleteFeedback = async (row: FeedbackItem): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除该反馈记录吗？`, '删除反馈', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })

      await fetchDeleteFeedback(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }

  onMounted(() => {
    getData()
  })
</script>

<style scoped lang="scss">
  .feedback-page {
    display: flex;
    flex-direction: column;
  }
</style>
