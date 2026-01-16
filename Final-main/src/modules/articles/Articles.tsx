import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import ArticleFormModal from './ArticleFormModal'
import { articleService } from './article.service'
import { useTableManager } from '@/hooks/useTableManager'
import { createArticlesColumns } from './articles.columns'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { useArticleFormMutations } from './hooks/useArticleFormMutations'
import type { Article } from './article.types'

export default function Articles() {
  const { isOpen: isModalOpen, selectedData: selectedArticle, mode: modalMode, open: openModal, close: closeModal } = useModalStore()
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
  } = useTableManager<Article>({
    queryKey: 'articles',
    fetchFn: (params) => articleService.getArticles({ 
      ...params,
      f_type: 'article',
      embed: 'author,category'
    }),
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this article')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  // Table columns
  const columns = createArticlesColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Article</h1>
          <div className="page-actions">
            <SearchBar
              placeholder="Search articles..."
              isFetching={isLoading}
            />
            <button
              onClick={() => openModal('create')}
              className="btn-primary"
            >
              Create
            </button>
          </div>
        </div>

        <DataTable
          data={data?.items || []}
          columns={columns}
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

      <ArticleFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        article={selectedArticle}
        mode={modalMode}
      />

      <Toast />
    </>
  )
}


