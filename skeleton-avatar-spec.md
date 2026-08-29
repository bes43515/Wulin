# 骨架模型系統規格

本角色系統採用固定 1024×1024 畫布與單一 Q 版少俠姿勢。人物基礎形象是骨架的視覺基準，服飾與配件不再依賴各自的自由裁切，而是以骨節與掛點描述其預期位置，再由共用 `CharacterAvatar` 依規定深度合成。

## 骨架層級

`root` 是腰部中心；`spine` 連接軀幹；`neck` 與 `head` 負責頭部；左右肩節分別連接左右手節；`hip` 連接左右腳節。所有節點都保留固定座標、父節點、旋轉與縮放欄位，後續若加入呼吸、揮劍或待機動畫，可在不改變物品資料的情況下對骨架做動畫。

| 骨架／掛點 | 用途 | 安全要求 |
| --- | --- | --- |
| `root`／`spine_back` | 基礎身體、服飾、披風 | 服飾不得進入臉部矩形；披風在身體後方。 |
| `head`／`head_accessory` | 髮型與頭飾 | 不得覆蓋雙眼、鼻口與表情。 |
| `hand_right` | 武器前景與後景 | 武器位於右手外側，不穿過胸口。 |
| `foot_aura` | 內力、劍氣、宗師光環 | 只在足邊與角色外圍，不覆蓋頭臉。 |

## 目前基礎人物

`avatarAsset.skeletonBaseBody` 使用 `avatar-q://skeleton-base-body`，並由 `components/avatar-assets.ts` 映射至新生成、清理後的 `assets/images/avatar-q/skeleton-base-body.png`。該圖是正面中立 A 姿勢、無武器、無披風、無光環的完整基礎人物，用來固定頭身比例、肩手位置、腰部中心、雙腳落點與未來所有配件的對位。既有 Q 版 `base-body.png` 仍保留作為回退資產，不會影響既有資料遷移。

## 資產替換規則

新人物或配件必須保持 1024×1024、RGBA、真透明背景與固定姿勢。替換基礎人物時，只需更新 `avatarAsset.skeletonBaseBody` 的檔案或同名資產；替換衣物與配件時，保留 `avatarItems` 的 `id`、`type`、`layer_order` 與 `safe_zones`，避免破壞玩家已保存的裝備資料。

每次替換後必須執行 `pnpm check` 與 `pnpm test`。若新增物品，須通過 `avatarItemSafetyViolations()`，再用角色頁的五步流程確認臉部、右手武器、背部配件及足邊特效位置，最後在首頁 Banner 驗證跨頁同步。
