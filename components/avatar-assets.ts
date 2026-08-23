import type { ImageSourcePropType } from "react-native";
import { avatarAsset, avatarBaseBodyAsset, avatarBrandMark } from "@/lib/avatar-system";

/** 由本機隨 App 封裝的 Q 版透明素材表；避免 Web Preview 或原生 App 依賴失效的臨時網址。 */
const localAvatarAssets: Record<string, ImageSourcePropType> = {
  [avatarBrandMark]: require("../assets/images/avatar/mountain-gate-mark.png"),
  [avatarBaseBodyAsset]: require("../assets/images/avatar-q/base-body.png"),
  [avatarAsset.hairFront]: require("../assets/images/avatar-q/hair-front.png"),
  [avatarAsset.outfitCloth]: require("../assets/images/avatar-q/outfit-cloth.png"),
  [avatarAsset.outfitSect]: require("../assets/images/avatar-q/outfit-sect.png"),
  [avatarAsset.outfitQingyun]: require("../assets/images/avatar-q/outfit-qingyun.png"),
  [avatarAsset.outfitRedflame]: require("../assets/images/avatar-q/outfit-redflame.png"),
  [avatarAsset.weaponWood]: require("../assets/images/avatar-q/weapon-wood.png"),
  [avatarAsset.weaponIron]: require("../assets/images/avatar-q/weapon-iron.png"),
  [avatarAsset.weaponCloud]: require("../assets/images/avatar-q/weapon-cloud.png"),
  [avatarAsset.weaponDragon]: require("../assets/images/avatar-q/weapon-dragon.png"),
  [avatarAsset.headbandBlue]: require("../assets/images/avatar-q/headband-blue.png"),
  [avatarAsset.headOrnamentSect]: require("../assets/images/avatar-q/head-ornament-sect.png"),
  [avatarAsset.headHatGold]: require("../assets/images/avatar-q/head-hat-gold.png"),
  [avatarAsset.capePlain]: require("../assets/images/avatar-q/back-cape-plain.png"),
  [avatarAsset.capeRedflame]: require("../assets/images/avatar-q/back-cape-redflame.png"),
  [avatarAsset.swordcase]: require("../assets/images/avatar-q/back-swordcase.png"),
  [avatarAsset.innerGlowBack]: require("../assets/images/avatar-q/aura-innerglow-back.png"),
  [avatarAsset.swordQiBack]: require("../assets/images/avatar-q/aura-swordqi-back.png"),
  [avatarAsset.goldMasterBack]: require("../assets/images/avatar-q/aura-goldmaster-back.png"),
  [avatarAsset.auraFrontClear]: require("../assets/images/avatar-q/aura-front-clear.png"),
};

export const avatarImageSource = (assetUrl: string): ImageSourcePropType => localAvatarAssets[assetUrl] ?? { uri: assetUrl };
