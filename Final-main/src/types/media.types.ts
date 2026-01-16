// Media Types
export interface Media {
  id: string
  uri: string
  type: string
  metadata?: {
    thumbnail?: { uri: string; key: string }
    medium?: { uri: string; key: string }
  }
  createdAt: string
}
