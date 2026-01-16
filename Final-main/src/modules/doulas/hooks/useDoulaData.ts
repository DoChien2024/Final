import { useQuery } from '@tanstack/react-query'
import { doulaService } from '../doula.service'
import { reviewService } from '@/services/review.service'
import { useDoulaStore } from '@/store'

export const useDoulaData = (id: string) => {
  const activeTab = useDoulaStore((state) => state.activeTab)

  // Main doula data
  const doula = useQuery({
    queryKey: ['doula', id],
    queryFn: () => doulaService.getDoulaById(id),
    enabled: !!id,
  })

  // Subscription data
  const subscription = useQuery({
    queryKey: ['doula-subscription', id],
    queryFn: () => doulaService.getDoulaSubscription(id),
    enabled: !!id && activeTab === 'subscription',
    retry: false,
  })

  // Packages data
  const packages = useQuery({
    queryKey: ['doula-packages', id],
    queryFn: () => doulaService.getDoulaPackages(id),
    enabled: !!id && activeTab === 'packages',
  })

  // Transactions data
  const transactions = useQuery({
    queryKey: ['doula-transactions', id],
    queryFn: () => doulaService.getDoulaTransactions(id),
    enabled: !!id && activeTab === 'subscription',
  })

  // Reviews data
  const reviews = useQuery({
    queryKey: ['doula-reviews', id],
    queryFn: () => reviewService.getReviews({ doulaId: id } as any),
    enabled: !!id && activeTab === 'reviews',
  })

  return {
    doula: {
      data: doula.data?.data,
      isLoading: doula.isLoading,
      error: doula.error,
    },
    subscription: {
      data: subscription.data?.data,
      isLoading: subscription.isLoading,
    },
    packages: {
      data: Array.isArray(packages.data?.data?.data) 
        ? packages.data.data.data 
        : Array.isArray(packages.data?.data) 
          ? packages.data.data 
          : [],
      isLoading: packages.isLoading,
    },
    transactions: {
      data: Array.isArray(transactions.data?.data?.data)
        ? transactions.data.data.data
        : Array.isArray(transactions.data?.data)
          ? transactions.data.data
          : [],
      isLoading: transactions.isLoading,
    },
    reviews: {
      data: Array.isArray(reviews.data?.data) ? reviews.data.data : [],
      isLoading: reviews.isLoading,
    },
  }
}
