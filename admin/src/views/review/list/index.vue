<template>
  <div class="review-page art-full-height">
    <!-- 搜索栏 -->
    <ReviewSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></ReviewSearch>

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
            <ElButton @click="showDialog('add')" v-ripple>新增评价</ElButton>
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

    <!-- 评价编辑弹窗 -->
    <ReviewDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :review-data="currentReviewData"
      @success="refreshData"
    />

    <!-- 评价详情弹窗 -->
    <ReviewDetail v-model="detailVisible" :detail-data="currentReviewData" />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag, ElRate } from 'element-plus'
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import { useTable } from '@/composables/useTable'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import ReviewSearch from './modules/review-search.vue'
  import ReviewDialog from './modules/review-dialog.vue'
  import ReviewDetail from './modules/review-detail.vue'
  import { fetchReviewList, fetchDeleteReview, fetchAuditReview } from '@/api/review'

  defineOptions({ name: 'ReviewList' })

  interface ReviewItem {
    id: number
    companyName: string
    authorName: string
    status: string
    department: string
    isBranch: number
    rating: number
    content: string
    likes: number
    replyCount: number
    auditStatus: number
    date: string
  }

  // 搜索表单
  const searchForm = ref({
    reviewId: undefined,
    companyName: undefined,
    authorName: undefined,
    status: undefined,
    rating: undefined,
    isBranch: undefined,
    auditStatus: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(true)
  const dialogVisible = ref(false)
  const detailVisible = ref(false)
  const dialogType = ref<Form.DialogType>('add')
  const currentReviewData = ref<ReviewItem | undefined>(undefined)

  // 在职状态配置
  const STATUS_CONFIG: Record<string, { type: any; text: string }> = {
    '当前在职': { type: 'success', text: '当前在职' },
    '已离职': { type: 'warning', text: '已离职' }
  }

  // 审核状态配置
  const AUDIT_STATUS_CONFIG: Record<number, { type: any; text: string }> = {
    0: { type: 'warning', text: '待审核' },
    1: { type: 'success', text: '已通过' },
    2: { type: 'danger', text: '已拒绝' }
  }

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || { type: 'info', text: '未知' }
  }

  const getAuditStatusConfig = (status: number) => {
    return AUDIT_STATUS_CONFIG[status] || { type: 'info', text: '未知' }
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
      apiFn: fetchReviewList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '评价ID', minWidth: 80 },
        { prop: 'companyName', label: '企业名称', minWidth: 150 },
        { prop: 'authorName', label: '评价人', minWidth: 100 },
        {
          prop: 'status',
          label: '在职状态',
          minWidth: 100,
          formatter: (row) => {
            const statusConfig = getStatusConfig(row.status)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        { prop: 'department', label: '所在部门', minWidth: 120 },
        {
          prop: 'isBranch',
          label: '是否分公司',
          minWidth: 100,
          formatter: (row) => (row.isBranch === 1 ? '是' : '否')
        },
        {
          prop: 'rating',
          label: '评分',
          minWidth: 120,
          formatter: (row) => h(ElRate, { modelValue: row.rating, disabled: true, showScore: true })
        },
        {
          prop: 'content',
          label: '评价内容',
          minWidth: 300,
          showOverflowTooltip: true
        },
        { prop: 'likes', label: '点赞数', minWidth: 80 },
        { prop: 'replyCount', label: '回复数', minWidth: 80 },
        {
          prop: 'auditStatus',
          label: '审核状态',
          minWidth: 100,
          formatter: (row) => {
            const statusConfig = getAuditStatusConfig(row.auditStatus)
            return h(ElTag, { type: statusConfig.type }, () => statusConfig.text)
          }
        },
        {
          prop: 'date',
          label: '发布时间',
          minWidth: 160,
          sortable: true
        },
        {
          prop: 'operation',
          label: '操作',
          width: 180,
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
              row.auditStatus === 0
                ? h(ArtButtonMore, {
                    list: [
                      {
                        key: 'audit',
                        label: '审核评价'
                      }
                    ] as any,
                    onClick: (item: ButtonMoreItem) => buttonMoreClick(item, row)
                  })
                : null,
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteReview(row)
              })
            ])
        }
      ]
    }
  })

  // 搜索处理
  const handleSearch = (params: Record<string, any>) => {
    const { daterange, ...rest } = params
    const searchParams = {
      ...rest,
      startDate: daterange?.[0],
      endDate: daterange?.[1]
    }
    getData(searchParams)
  }

  // 显示弹窗
  const showDialog = (type: Form.DialogType, row?: ReviewItem): void => {
    dialogType.value = type
    currentReviewData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  // 查看详情
  const viewDetail = (row: ReviewItem): void => {
    currentReviewData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  // 按钮操作处理
  const buttonMoreClick = (item: ButtonMoreItem, row: ReviewItem) => {
    if (item.key === 'audit') {
      handleAudit(row)
    }
  }

  // 审核处理
  const handleAudit = (row: ReviewItem): void => {
    ElMessageBox.confirm('请选择审核结果', '审核评价', {
      distinguishCancelAndClose: true,
      confirmButtonText: '通过',
      cancelButtonText: '拒绝',
      type: 'warning'
    })
      .then(async () => {
        try {
          // 审核通过：auditStatus = 1
          await fetchAuditReview(row.id, { auditStatus: 1 })
          ElMessage.success('审核通过')
          refreshData()
        } catch (error) {
          console.error('审核通过失败:', error)
        }
      })
      .catch(async (action) => {
        if (action === 'cancel') {
          try {
            // 审核拒绝：auditStatus = 2
            await fetchAuditReview(row.id, { auditStatus: 2 })
            ElMessage.info('审核拒绝')
            refreshData()
          } catch (error) {
            console.error('审核拒绝失败:', error)
          }
        }
      })
  }

  // 删除评价
  const deleteReview = async (row: ReviewItem): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除该评价吗？`, '删除评价', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      
      await fetchDeleteReview(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      // 用户取消
    }
  }
</script>

<style scoped lang="scss">
  .review-page {
    padding: 0;
  }
</style>
