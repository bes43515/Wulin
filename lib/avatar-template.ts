/**
 * Q 版武林角色模板：所有可穿戴圖層都使用同一張 1024×1024 畫布與固定人體定位。
 * 請勿以 CSS 縮放修正錯位素材；新素材必須依此資料於生成階段對位。
 */
export const avatarCanvas = { width: 1024, height: 1024, aspectRatio: 1 } as const;

export type AvatarRect = { x: number; y: number; width: number; height: number };
export type AvatarAnchorName = "head_center" | "shoulder_left" | "shoulder_right" | "hand_left" | "hand_right" | "waist" | "foot_left" | "foot_right";
export type AvatarSafeZone = "face" | "outfit" | "hair" | "head_accessory" | "hand_weapon" | "back" | "aura";
export type AvatarLayerSlot = "aura_back" | "back_accessory" | "base_body" | "outfit" | "hair_back" | "weapon_back" | "weapon_front" | "hair_front" | "head_accessory" | "aura_front";

export const avatarAnchors: Record<AvatarAnchorName, { x: number; y: number }> = {
  head_center: { x: 512, y: 250 },
  shoulder_left: { x: 372, y: 365 },
  shoulder_right: { x: 652, y: 365 },
  hand_left: { x: 350, y: 575 },
  hand_right: { x: 674, y: 575 },
  waist: { x: 512, y: 540 },
  foot_left: { x: 430, y: 900 },
  foot_right: { x: 594, y: 900 },
};

export const avatarSafeZones: Record<AvatarSafeZone, AvatarRect> = {
  face: { x: 360, y: 120, width: 300, height: 230 },
  outfit: { x: 250, y: 310, width: 530, height: 590 },
  hair: { x: 330, y: 50, width: 360, height: 300 },
  head_accessory: { x: 310, y: 35, width: 400, height: 315 },
  hand_weapon: { x: 585, y: 410, width: 360, height: 500 },
  back: { x: 180, y: 300, width: 665, height: 610 },
  aura: { x: 100, y: 80, width: 824, height: 850 },
};

export const avatarLayerOrder: readonly AvatarLayerSlot[] = [
  "aura_back",
  "back_accessory",
  "base_body",
  "outfit",
  "hair_back",
  "weapon_back",
  "weapon_front",
  "hair_front",
  "head_accessory",
  "aura_front",
] as const;

export const avatarLayerDepth: Record<AvatarLayerSlot, number> = Object.fromEntries(avatarLayerOrder.map((slot, index) => [slot, index])) as Record<AvatarLayerSlot, number>;

/** 定義每個實際圖層可繪製的範圍，供資料驗證與素材交接使用。 */
export const avatarLayerSafeZones: Record<AvatarLayerSlot, readonly AvatarSafeZone[]> = {
  aura_back: ["aura"],
  back_accessory: ["back"],
  base_body: ["face", "outfit", "hair"],
  outfit: ["outfit"],
  hair_back: ["hair"],
  weapon_back: ["back"],
  weapon_front: ["hand_weapon"],
  hair_front: ["hair"],
  head_accessory: ["head_accessory"],
  aura_front: ["aura"],
};

export const avatarFaceProtection = avatarSafeZones.face;

export function avatarLayerHasValidSafeZone(layer: AvatarLayerSlot, zones: readonly AvatarSafeZone[]) {
  return zones.length > 0 && zones.every((zone) => avatarLayerSafeZones[layer].includes(zone));
}

/** 固定 Q 版骨架：圖層仍共用 1024 畫布，但所有配件以骨架掛點描述其語義位置。 */
export type AvatarBoneName = "root" | "spine" | "neck" | "head" | "shoulder_left" | "shoulder_right" | "hand_left" | "hand_right" | "hip" | "foot_left" | "foot_right";
export type AvatarAttachmentPoint = "root" | "head" | "head_accessory" | "hand_left" | "hand_right" | "spine_back" | "foot_aura";

export type AvatarBone = {
  name: AvatarBoneName;
  parent: AvatarBoneName | null;
  anchor: AvatarAnchorName;
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

export const avatarSkeletonBones: readonly AvatarBone[] = [
  { name: "root", parent: null, anchor: "waist", x: 512, y: 540, rotation: 0, scale: 1 },
  { name: "spine", parent: "root", anchor: "waist", x: 512, y: 430, rotation: 0, scale: 1 },
  { name: "neck", parent: "spine", anchor: "head_center", x: 512, y: 330, rotation: 0, scale: 1 },
  { name: "head", parent: "neck", anchor: "head_center", x: 512, y: 250, rotation: 0, scale: 1 },
  { name: "shoulder_left", parent: "spine", anchor: "shoulder_left", x: 372, y: 365, rotation: 0, scale: 1 },
  { name: "shoulder_right", parent: "spine", anchor: "shoulder_right", x: 652, y: 365, rotation: 0, scale: 1 },
  { name: "hand_left", parent: "shoulder_left", anchor: "hand_left", x: 350, y: 575, rotation: 0, scale: 1 },
  { name: "hand_right", parent: "shoulder_right", anchor: "hand_right", x: 674, y: 575, rotation: 0, scale: 1 },
  { name: "hip", parent: "root", anchor: "waist", x: 512, y: 590, rotation: 0, scale: 1 },
  { name: "foot_left", parent: "hip", anchor: "foot_left", x: 430, y: 900, rotation: 0, scale: 1 },
  { name: "foot_right", parent: "hip", anchor: "foot_right", x: 594, y: 900, rotation: 0, scale: 1 },
] as const;

export const avatarAttachmentPoints: Record<AvatarAttachmentPoint, { bone: AvatarBoneName; x: number; y: number; rotation: number }> = {
  root: { bone: "root", x: 512, y: 540, rotation: 0 },
  head: { bone: "head", x: 512, y: 250, rotation: 0 },
  head_accessory: { bone: "head", x: 512, y: 190, rotation: 0 },
  hand_left: { bone: "hand_left", x: 350, y: 575, rotation: 0 },
  hand_right: { bone: "hand_right", x: 674, y: 575, rotation: 0 },
  spine_back: { bone: "spine", x: 512, y: 445, rotation: 0 },
  foot_aura: { bone: "root", x: 512, y: 850, rotation: 0 },
};

export const avatarLayerBone: Record<AvatarLayerSlot, { bone: AvatarBoneName; attachment: AvatarAttachmentPoint }> = {
  aura_back: { bone: "root", attachment: "foot_aura" },
  back_accessory: { bone: "spine", attachment: "spine_back" },
  base_body: { bone: "root", attachment: "root" },
  outfit: { bone: "spine", attachment: "root" },
  hair_back: { bone: "head", attachment: "head" },
  weapon_back: { bone: "hand_right", attachment: "hand_right" },
  weapon_front: { bone: "hand_right", attachment: "hand_right" },
  hair_front: { bone: "head", attachment: "head" },
  head_accessory: { bone: "head", attachment: "head_accessory" },
  aura_front: { bone: "root", attachment: "foot_aura" },
};

export function avatarSkeletonHasAllRequiredBones() {
  const names = new Set(avatarSkeletonBones.map((bone) => bone.name));
  return ["root", "spine", "neck", "head", "hand_left", "hand_right", "foot_left", "foot_right"].every((name) => names.has(name as AvatarBoneName));
}

export function avatarAttachmentIsInSafeZone(point: AvatarAttachmentPoint, zone: AvatarSafeZone) {
  const { x, y } = avatarAttachmentPoints[point];
  const rect = avatarSafeZones[zone];
  return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
}
