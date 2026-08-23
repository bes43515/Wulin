import type { ImageSourcePropType } from "react-native";
import { avatarBaseBodyAsset, avatarBrandMark } from "@/lib/avatar-system";

/** 供原生與 Web 渲染器共用的本機角色資產映射；資料層不直接載入 PNG，保持單元測試可執行。 */
const localAvatarAssets: Record<string, ImageSourcePropType> = {
  [avatarBrandMark]: require("../assets/images/avatar/mountain-gate-mark.png"),
  [avatarBaseBodyAsset]: require("../assets/images/avatar/base-body.png"),
  "/manus-storage/avatar-hair-black-topknot_7e6039ba.png": require("../assets/images/avatar/base-body.png"),
  "/manus-storage/avatar-outfit-cloth_f6f09e54.png": require("../assets/images/avatar/base-body.png"),
  "/manus-storage/avatar-outfit-sect_061cea1d.png": require("../assets/images/avatar/outfit-sect.png"),
  "/manus-storage/avatar-weapon-wood-front_7d6ca50b.png": require("../assets/images/avatar/weapon-wood-front.png"),
};

export const avatarImageSource = (assetUrl: string): ImageSourcePropType => localAvatarAssets[assetUrl] ?? { uri: assetUrl };
