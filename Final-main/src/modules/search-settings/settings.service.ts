import { API_ENDPOINTS } from '@/api/api'
import { createCrudService } from '@/services/base.service'
import type { Setting, SettingFormData, TrendingKeyword, TrendingKeywordFormData } from './settings.types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<Setting, SettingFormData>(API_ENDPOINTS.ADMIN_SETTINGS)

export const settingsService = {
  getSettings: baseService.getAll,
  getSettingById: baseService.getById,
  createSetting: baseService.create,
  updateSetting: baseService.update,
  deleteSetting: baseService.delete,
  bulkDeleteSettings: baseService.bulkDelete,
}

// Trending Keywords Service (Search Settings)
const trendingKeywordsService = createCrudService<TrendingKeyword, TrendingKeywordFormData>(API_ENDPOINTS.ADMIN_TRENDING_KEYWORDS)

export const searchSettings = {
  getSearchSettings: trendingKeywordsService.getAll,
  getSearchSettingById: trendingKeywordsService.getById,
  createSearchSetting: trendingKeywordsService.create,
  updateSearchSetting: trendingKeywordsService.update,
  deleteSearchSetting: trendingKeywordsService.delete,
  bulkDeleteSearchSettings: trendingKeywordsService.bulkDelete,
}


