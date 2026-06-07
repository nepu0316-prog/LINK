/**
 * 給「硬寫在 page.tsx」的外部按鈕使用的固定 UUID。
 * 這些 UUID 不對應 links 表中的任何列，
 * 但 click_analytics INSERT 只需要合法的 UUID 格式即可成功。
 */
export const EXTERNAL_LINK_IDS = {
  LINE_COMMUNITY: 'ee000001-0000-0000-0000-000000000001',
  WEBSITE:        'ee000002-0000-0000-0000-000000000002',
} as const

/** 在 Dashboard 顯示時用的中文名稱 */
export const EXTERNAL_LINK_LABELS: Record<string, string> = {
  'ee000001-0000-0000-0000-000000000001': '📣 LINE 社群',
  'ee000002-0000-0000-0000-000000000002': '🌐 嘟力日記官網',
}
