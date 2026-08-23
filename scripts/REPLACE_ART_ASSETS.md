# 批次替換全站武林場景資產

## 資產格式與命名策略

目前 App 以 **完整合成 JPEG 場景**作為首頁、成就、設定、背包、市集與江湖榜的背景，因此不需再修改 React Native 程式引用。替換工具只覆寫既有靜態檔名，Expo 在 Web、iOS 與 Android 都會維持相同載入策略。透明角色立繪則保留 PNG 選項，供後續需要分層角色的場景使用。

所有場景 Banner 應為無文字、無浮水印的 Q 版卡通武俠插畫，主角與環境自然融合，並為左側資訊文字保留安全區。建議在替換前將新 Banner 處理為不超過 1280 × 720、約 1MB 以下的高品質 JPEG，以避免 bundle 與 checkpoint 過大。

| 選項 | 目標畫面 | 接受格式 |
|---|---|---|
| `--banner` | 首頁山門名帖 | JPEG |
| `--achievement-banner` | 成就功德碑 | JPEG |
| `--settings-banner` | 門派內務／書案 | JPEG |
| `--inventory-banner` | 江湖行囊 | JPEG |
| `--market-banner` | 江湖市集 | JPEG |
| `--leaderboard-banner` | 比武擂台／英雄榜 | JPEG |
| `--character` | 後續分層角色備用 | 透明 PNG |

## 先做 dry-run

```bash
pnpm replace:art -- --banner ./incoming/home.jpg --market-banner ./incoming/market.jpg --dry-run
```

dry-run 會驗證明確傳入檔案的大小、附檔名與 JPEG／PNG 簽名，並列出預計覆寫的靜態資產；不會下載、執行或寫入外部檔案。

## 正式替換

```bash
pnpm replace:art -- --banner ./incoming/home.jpg --achievement-banner ./incoming/achievement.jpg
```

可只替換單一場景：

```bash
pnpm replace:art -- --leaderboard-banner ./incoming/arena.jpg
```

正式執行會先把舊檔備份到 `assets/images/.backup/<timestamp>/`，再以對應目標檔名覆寫。若確認不需要備份，可加上 `--no-backup`；一般不建議使用。

## 回復與驗證

如需回復，先停止開發服務，將對應時間戳備份中的檔案複製回 `assets/images/`，再重新啟動服務。每次替換後應執行：

```bash
pnpm check && pnpm lint && pnpm test
```

並確認首頁文字安全區、場景人物比例與各頁 Banner 不會出現白底、棋盤格或不同畫風素材。執行替換前建議先保存一個 checkpoint。
