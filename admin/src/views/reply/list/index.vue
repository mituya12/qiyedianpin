<template>
  <div class="reply-page art-full-height">
    <ReplySearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="resetSearchParams"
    ></ReplySearch>

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
            <ElButton @click="showDialog('add')" v-ripple>新增回复</ElButton>
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

    <!-- 回复编辑弹窗 -->
    <ReplyDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :reply-data="currentReplyData"
      @success="refreshData"
    />

    <!-- 回复详情弹窗 -->
    <ReplyDetail v-model="detailVisible" :detail-data="currentReplyData" />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, ElTag } from 'element-plus'
  import { useTable } from '@/composables/useTable'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ReplySearch from './modules/reply-search.vue'
  import ReplyDialog from './modules/reply-dialog.vue'
  import ReplyDetail from './modules/reply-detail.vue'
  import { fetchReplyList, fetchDeleteReply, fetchAuditReply } from '@/api/reply'

  defineOptions({ name: 'ReplyList' })

  interface ReplyItem {
    id: number
    author: string
    reviewId: number
    companyName: string
    reviewAuthor: string
    content: string
    isOfficial: number
    auditStatus: number
    date: string
  }

  const searchForm = ref({
    replyId: undefined,
    author: undefined,
    reviewId: undefined,
    isOfficial: undefined,
    auditStatus: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(true)
  const dialogVisible = ref(false)
  const detailVisible = ref(false)
  const dialogType = ref<Form.DialogType>('add')
  const currentReplyData = ref<ReplyItem | undefined>(undefined)

  const AUDIT_STATUS_CONFIG: Record<number, { type: any; text: string }> = {
    0: { type: 'warning', text: '待审核' },
    1: { type: 'success', text: '已通过' },
    2: { type: 'danger', text: '已拒绝' }
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
      apiFn: fetchReplyList,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () => [
        { type: 'selection' },
        { type: 'index', minWidth: 60, label: '序号' },
        { prop: 'id', label: '回复ID', minWidth: 80 },
        { prop: 'author', label: '回复人', minWidth: 100 },
        { prop: 'reviewId', label: '原评价ID', minWidth: 100 },
        { prop: 'companyName', label: '原评价企业', minWidth: 150 },
        { prop: 'reviewAuthor', label: '原评价人', minWidth: 100 },
        {
          prop: 'content',
          label: '回复内容',
          minWidth: 300,
          showOverflowTooltip: true
        },
        {
          prop: 'isOfficial',
          label: '是否官方回复',
          minWidth: 120,
          formatter: (row) => {
            const config = row.isOfficial === 1 
              ? { type: 'success', text: '官方回复' }
              : { type: 'info', text: '普通回复' }
            return h(ElTag, { type: config.type }, () => config.text)
          }
        },
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
          label: '回复时间',
          minWidth: 160,
          sortable: true
        },
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
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              row.auditStatus === 0
                ? h(ArtButtonTable, {
                    text: '审核',
                    onClick: () => handleAudit(row)
                  })
                : null,
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteReply(row)
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

  const showDialog = (type: Form.DialogType, row?: ReplyItem): void => {
    dialogType.value = type
    currentReplyData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const viewDetail = (row: ReplyItem): void => {
    currentReplyData.value = row
    nextTick(() => {
      detailVisible.value = true
    })
  }

  const handleAudit = (row: ReplyItem): void => {
    ElMessageBox.confirm('请选择审核结果', '审核回复', {
      distinguishCancelAndClose: true,
      confirmButtonText: '通过',
      cancelButtonText: '拒绝',
      type: 'warning'
    })
      .then(async () => {
        try {
          // 审核通过：auditStatus = 1
          await fetchAuditReply(row.id, { auditStatus: 1 })
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
            await fetchAuditReply(row.id, { auditStatus: 2 })
            ElMessage.info('审核拒绝')
            refreshData()
          } catch (error) {
            console.error('审核拒绝失败:', error)
          }
        }
      })
  }

  const deleteReply = async (row: ReplyItem): Promise<void> => {
    try {
      await ElMessageBox.confirm(`确定要删除该回复吗？`, '删除回复', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      })
      
      await fetchDeleteReply(row.id)
      ElMessage.success('删除成功')
      refreshData()
    } catch (error) {
      // 用户取消
    }
  }
</script>

<style scoped lang="scss">
  .reply-page {
    padding: 0;
  }
</style>
