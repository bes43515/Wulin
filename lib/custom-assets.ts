import type { ImageSourcePropType } from "react-native";

/** Expo 內建靜態 Banner。替換腳本覆寫同名 PNG 後，Web、iOS 與 Android 可一致載入。 */
export const customHeroBanner: ImageSourcePropType = require("../assets/images/jianghu-composited-profile-banner.jpg");

/** 各分頁專屬的完整合成武林場景 Banner。 */
export const achievementBanner: ImageSourcePropType = require("../assets/images/jianghu-achievement-banner.jpg");
export const settingsBanner: ImageSourcePropType = require("../assets/images/jianghu-settings-banner.jpg");
export const inventoryBanner: ImageSourcePropType = require("../assets/images/jianghu-inventory-banner.jpg");
export const marketBanner: ImageSourcePropType = require("../assets/images/jianghu-market-banner.jpg");
export const leaderboardBanner: ImageSourcePropType = require("../assets/images/jianghu-leaderboard-banner.jpg");

/** 同時支援原有遠端 URL 與批次替換後的本地 require 資產。 */
export function imageSource(source: string | number): ImageSourcePropType {
  return typeof source === "string" ? { uri: source } : source;
}
