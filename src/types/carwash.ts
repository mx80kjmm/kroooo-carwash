// 洗車場の型定義
export interface CarwashLocation {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    business_hours?: string;
    has_self_wash: boolean;      // セルフ洗車
    has_auto_wash: boolean;      // 自動洗車機
    has_non_brush: boolean;      // ノンブラシ（コーティング車対応）
    has_vacuum: boolean;         // 掃除機
    has_mat_wash: boolean;       // マット洗い
    price_range?: string;        // 料金帯
    notes?: string;              // 備考
    url?: string;                // 公式URL
    x_post_url?: string;         // X(Twitter) URL
    created_at: string;
    updated_at: string;
}

// 検索条件の型
export interface SearchFilters {
    keyword?: string;
    prefecture?: string;
    hasNonBrush?: boolean;
    hasSelfWash?: boolean;
    hasAutoWash?: boolean;
}
