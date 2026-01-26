import { useEffect } from 'react'
import { useTableManager } from '@/hooks/useTableManager'
import { useModalStore } from '@/store/modalStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { useArticleFormMutations } from '../hooks/useArticleFormMutations'
import { articleApi } from '../api/api'
import { createArticlesColumns } from '../components/ArticleColumns'
import DataTable from '@/components/table/DataTable'
import SearchBar from '@/components/table/SearchBar'
import Toast from '@/components/ui/Toast'
import ArticleModal from '../components/ArticleModal'
import type { IArticleDetail } from '../article.types' 

export default function ArticlePage() {
  const { open: openModal } = useModalStore()
  const { confirmDelete } = useConfirmStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = useArticleFormMutations()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<IArticleDetail>({
    queryKey: 'articles',
    fetchFn: (params) => articleApi.getAll({ ...params, f_type: 'article' }),
    defaultSortField: 'index',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this article')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Articles</h1>
          <div className="page-actions">
            <SearchBar placeholder="Search articles..." isFetching={isLoading} />
            <button onClick={() => openModal('create')} className="btn-primary">
              Create
            </button>
          </div>
        </div>

        <DataTable
          data={data?.items || []}
          columns={createArticlesColumns()}
          sorting={sorting}
          onSortChange={handleSortChange}
          isLoading={isLoading}
          error={error}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            total: data?.total || 0,
            limit,
            onPageChange: (newPage) => updateParams({ page: newPage }),
            onLimitChange: (newLimit) => updateParams({ limit: newLimit, page: 1 }),
          }}
          emptyMessage="No articles found"
        />
      </div>

      <ArticleModal />
      <Toast />
    </>
  )
}
