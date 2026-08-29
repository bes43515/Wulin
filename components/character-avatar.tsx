/** 山門手札 Q 版模型：所有圖層共用 1:1 人體模板，並以安全順序限制服飾、配件與特效。 */
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { avatarLayersFor, avatarRarityEffect, avatarRarityForEquipmentChange, defaultAvatarEquipment, type AvatarEquipment } from "@/lib/avatar-system";
import { avatarLayerDepth, type AvatarLayerSlot } from "@/lib/avatar-template";
import { avatarImageSource } from "@/components/avatar-assets";

type CharacterAvatarProps = { equipment?: AvatarEquipment; height?: number; style?: StyleProp<ViewStyle>; accessibilityLabel?: string; animateChanges?: boolean };

export function CharacterAvatar({ equipment = defaultAvatarEquipment, height = 240, style, accessibilityLabel = "目前角色外觀", animateChanges = true }: CharacterAvatarProps) {
  const width = height;
  const layers = avatarLayersFor(equipment);
  const signature = layers.map((layer) => `${layer.slot}:${layer.assetUrl}`).join("|");
  const previousSignature = useRef(signature);
  const previousEquipment = useRef(equipment);
  const [effect, setEffect] = useState(avatarRarityEffect.common);
  const transition = useRef(new Animated.Value(1)).current;
  const qiFlash = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animateChanges || previousSignature.current === signature) { previousSignature.current = signature; previousEquipment.current = equipment; return; }
    const rarity = avatarRarityForEquipmentChange(previousEquipment.current, equipment);
    previousSignature.current = signature;
    previousEquipment.current = equipment;
    const nextEffect = avatarRarityEffect[rarity];
    setEffect(nextEffect);
    transition.stopAnimation(); qiFlash.stopAnimation(); transition.setValue(0); qiFlash.setValue(0);
    Animated.parallel([
      Animated.timing(transition, { toValue: 1, duration: nextEffect.impactDuration + nextEffect.settleDuration, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(qiFlash, { toValue: 1, duration: nextEffect.impactDuration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(qiFlash, { toValue: 0, duration: nextEffect.settleDuration, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();
  }, [animateChanges, equipment, qiFlash, signature, transition]);

  const avatarScale = transition.interpolate({ inputRange: [0, 0.72, 1], outputRange: [0.95, 1.018, 1] });
  const flashScale = qiFlash.interpolate({ inputRange: [0, 1], outputRange: [effect.flashStart, effect.flashEnd] });
  const flashOpacity = qiFlash.interpolate({ inputRange: [0, 1], outputRange: [0, effect.flashPeakOpacity] });
  const ringOpacity = qiFlash.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, effect.flashPeakOpacity, 0] });
  return <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} pointerEvents="none" style={[styles.avatar, { width, height }, style]}>
    <Animated.View style={[styles.qiFlash, { backgroundColor: effect.glowColor, opacity: flashOpacity, transform: [{ scale: flashScale }] }]} />
    <Animated.View style={[styles.qiRing, { borderColor: effect.ringColor, opacity: ringOpacity, transform: [{ scale: flashScale }] }]} />
    {layers.map((layer) => <Animated.Image key={`${layer.slot}-${layer.bone}-${layer.attachment}-${layer.assetUrl}`} accessibilityLabel={`${layer.slot}，掛載於${layer.bone}骨節`} source={avatarImageSource(layer.assetUrl)} resizeMode="contain" style={[styles.layer, { zIndex: avatarLayerDepth[layer.slot as AvatarLayerSlot], opacity: transition, transform: [{ scale: avatarScale }] }]} />)}
  </View>;
}

const styles = StyleSheet.create({
  avatar: { position: "relative", alignItems: "center", justifyContent: "center", overflow: "visible" },
  layer: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  qiFlash: { position: "absolute", width: "55%", aspectRatio: 1, borderRadius: 999, top: "57%", zIndex: avatarLayerDepth.aura_front },
  qiRing: { position: "absolute", width: "48%", aspectRatio: 1, borderRadius: 999, borderWidth: 3, top: "60%", zIndex: avatarLayerDepth.aura_front },
});
