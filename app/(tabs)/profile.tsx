/** 山門手札：角色是主角；朱砂印記與宣紙題籤只用來支援清楚的試穿與裝備決策。 */
import React from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { CharacterAvatar } from "@/components/character-avatar";
import { JianghuPageAtmosphere, JianghuPaperPanel } from "@/components/jianghu-ui";
import { ScreenContainer } from "@/components/screen-container";
import { customHeroBanner } from "@/lib/custom-assets";
import { levelTitle, typeLabel, useGame, type TaskType } from "@/lib/game-store";
import { avatarBrandMark, avatarItemById, avatarItems, avatarRarityColor, avatarRarityLabel, avatarSlotLabel, defaultAvatarEquipment, type AvatarEquipment, type AvatarSlot } from "@/lib/avatar-system";
import { avatarImageSource } from "@/components/avatar-assets";

const wardrobeSlots: AvatarSlot[] = ["outfit", "weapon", "head_accessory", "back_accessory", "aura"];
const summarySlots: AvatarSlot[] = ["outfit", "weapon", "head_accessory", "back_accessory", "aura"];
const qTemplateTestSteps: { slot: AvatarSlot; itemId: string; label: string; check: string }[] = [
  { slot: "outfit", itemId: "avatar-outfit-sect", label: "1. 換上門派弟子袍", check: "服飾停在頸部下方，臉部完整可見" },
  { slot: "head_accessory", itemId: "avatar-headband-blue", label: "2. 換上青布髮帶", check: "頭飾只貼合髮際，不遮住雙眼" },
  { slot: "weapon", itemId: "avatar-weapon-iron", label: "3. 裝備鐵劍", check: "武器固定在右手外側，不穿越胸口" },
  { slot: "back_accessory", itemId: "avatar-back-cape-plain", label: "4. 裝備素色披風", check: "披風保持於身體與服飾後方" },
  { slot: "aura", itemId: "avatar-aura-innerglow", label: "5. 開啟內力微光", check: "光效環繞足邊與外圍，不遮住表情" },
];
const attributes: { key: TaskType; label: string; color: string }[] = [
  { key: "inner", label: "內力", color: "#7564B4" },
  { key: "body", label: "筋骨", color: "#B64732" },
  { key: "wisdom", label: "悟性", color: "#B27A2D" },
  { key: "reputation", label: "聲望", color: "#2E7C78" },
];

export default function ProfileScreen() {
  const game = useGame();
  const [wardrobeVisible, setWardrobeVisible] = React.useState(false);
  const [wardrobeSlot, setWardrobeSlot] = React.useState<AvatarSlot>("outfit");
  const equippedSummary = summarySlots.map((slot) => ({ slot, item: avatarItemById(game.avatarEquipment[slot]) }));
  const openWardrobe = (slot: AvatarSlot) => { setWardrobeSlot(slot); setWardrobeVisible(true); };
  const nextTemplateStepIndex = qTemplateTestSteps.findIndex((step) => game.avatarEquipment[step.slot] !== step.itemId);
  const templateTestComplete = nextTemplateStepIndex === -1;
  const activeTemplateStep = qTemplateTestSteps[templateTestComplete ? qTemplateTestSteps.length - 1 : nextTemplateStepIndex];
  const runNextTemplateStep = () => {
    if (templateTestComplete) { openWardrobe("outfit"); return; }
    game.equipAvatarItem(activeTemplateStep.itemId);
  };

  return (
    <ScreenContainer containerClassName="bg-[#F4F1E7]" className="px-4">
      <View style={styles.page}>
        <JianghuPageAtmosphere />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.identityRow}>
              <Image source={avatarImageSource(avatarBrandMark)} style={styles.brandMark} resizeMode="contain" />
              <View>
                <Text style={styles.kicker}>江湖修煉手札</Text>
                <Text style={styles.heading}>少俠衣櫥</Text>
                <Text style={styles.nickname}>{game.nickname} · {levelTitle(game.level)}</Text>
              </View>
            </View>
            <Pressable onPress={() => router.push("/settings")} style={({ pressed }) => [styles.settings, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="開啟設定">
              <Text style={styles.settingsText}>設定</Text>
            </Pressable>
          </View>

          <View style={styles.stage}>
            <Image source={customHeroBanner} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            <View style={styles.stageShade} />
            <View style={styles.stageMist} />
            <CharacterAvatar equipment={game.avatarEquipment} height={338} style={styles.stageAvatar} accessibilityLabel="演武台上已裝備完整外觀的 Q 版少俠模型" />
            <View style={styles.stageCopy}>
              <Text style={styles.stageKicker}>{game.sect} · 山門演武台</Text>
              <Text style={styles.stageTitle}>{levelTitle(game.level)}</Text>
              <Text style={styles.stageMeta}>境界 Lv.{game.level}　修為 {game.exp}</Text>
              <Text style={styles.stageNote}>{game.titles.at(-1) ? `稱號「${game.titles.at(-1)}」` : "雲霧未散，少俠已立演武台。"}</Text>
            </View>
            <View style={styles.stageBelt}>
              <View style={styles.beltItem}><Text style={styles.beltValue}>Lv.{game.level}</Text><Text style={styles.beltLabel}>目前境界</Text></View>
              <View style={styles.beltDivider} />
              <View style={styles.beltItem}><Text style={styles.beltValue}>{game.streak} 日</Text><Text style={styles.beltLabel}>連續修煉</Text></View>
              <View style={styles.beltDivider} />
              <View style={styles.beltItem}><Text style={styles.beltValue}>{game.coin}</Text><Text style={styles.beltLabel}>江湖幣</Text></View>
            </View>
          </View>

          <JianghuPaperPanel style={styles.equipmentPanel}>
            <View style={styles.panelHeader}>
              <View><Text style={styles.panelKicker}>已裝備</Text><Text style={styles.panelTitle}>外觀題籤</Text></View>
              <Pressable onPress={() => openWardrobe("outfit")} style={({ pressed }) => [styles.changeButton, pressed && styles.pressed]} accessibilityRole="button">
                <Text style={styles.changeButtonText}>更換外觀</Text>
              </Pressable>
            </View>
            <View style={styles.equipmentGrid}>
              {equippedSummary.map(({ slot, item }) => (
                <Pressable key={slot} onPress={() => openWardrobe(slot)} style={({ pressed }) => [styles.equipmentCell, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`前往${avatarSlotLabel[slot]}換裝`}>
                  {item ? <Image source={avatarImageSource(item.asset_url)} style={styles.equipmentThumb} resizeMode="contain" /> : <View style={styles.emptyThumb}><Text style={styles.emptyThumbText}>—</Text></View>}
                  <View style={styles.equipmentCopy}>
                    <Text style={styles.equipmentSlot}>{avatarSlotLabel[slot]}</Text>
                    <Text style={styles.equipmentName} numberOfLines={1}>{item?.name ?? "未裝備"}</Text>
                    <Text style={[styles.equipmentRarity, { color: item ? avatarRarityColor[item.rarity] : "#86938B" }]}>{item ? avatarRarityLabel[item.rarity] : "素裝"}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </JianghuPaperPanel>

          <JianghuPaperPanel style={styles.templateTestPanel}>
            <View style={styles.templateTestHeader}><View><Text style={styles.panelKicker}>Q 版人體對位驗收</Text><Text style={styles.templateTestTitle}>{templateTestComplete ? "五步驗收已完成" : activeTemplateStep.label}</Text></View><Text style={styles.templateTestCount}>{templateTestComplete ? "5 / 5" : `${nextTemplateStepIndex + 1} / 5`}</Text></View>
            <Text style={styles.templateTestHint}>{templateTestComplete ? "所有配件皆已在固定模板上裝備；可回到衣櫥自由試穿。" : activeTemplateStep.check}</Text>
            <Pressable onPress={runNextTemplateStep} style={({ pressed }) => [styles.templateTestButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={templateTestComplete ? "開啟衣櫥重新檢視外觀" : activeTemplateStep.label}><Text style={styles.templateTestButtonText}>{templateTestComplete ? "開啟衣櫥檢視" : "套用下一步驗收外觀"}</Text></Pressable>
          </JianghuPaperPanel>

          <View style={styles.trainingHeader}><Text style={styles.trainingTitle}>今日修為</Text><Text style={styles.trainingHint}>功力隨每日試煉積累</Text></View>
          <View style={styles.attributeStrip}>
            {attributes.map((attribute) => (
              <View key={attribute.key} style={styles.attributeItem}>
                <View style={[styles.attributeSeal, { borderColor: attribute.color }]}><Text style={[styles.attributeSealText, { color: attribute.color }]}>{attribute.label.slice(0, 1)}</Text></View>
                <Text style={styles.attributeName}>{attribute.label}</Text>
                <Text style={[styles.attributeValue, { color: attribute.color }]}>{game.attributes[attribute.key]}</Text>
                <View style={styles.attributeTrack}><View style={[styles.attributeFill, { width: `${Math.min(game.attributes[attribute.key] * 3, 100)}%`, backgroundColor: attribute.color }]} /></View>
              </View>
            ))}
          </View>
        </ScrollView>
        <WardrobeModal visible={wardrobeVisible} initialSlot={wardrobeSlot} onClose={() => setWardrobeVisible(false)} />
      </View>
    </ScreenContainer>
  );
}

function WardrobeModal({ visible, initialSlot, onClose }: { visible: boolean; initialSlot: AvatarSlot; onClose: () => void }) {
  const game = useGame();
  const [slot, setSlot] = React.useState<AvatarSlot>(initialSlot);
  const [preview, setPreview] = React.useState<AvatarEquipment>(game.avatarEquipment);

  React.useEffect(() => {
    if (visible) {
      setSlot(initialSlot);
      setPreview(game.avatarEquipment);
    }
  }, [game.avatarEquipment, initialSlot, visible]);

  const options = avatarItems.filter((item) => item.type === slot);
  const selectedItem = avatarItemById(preview[slot]);
  const selectedOwned = !preview[slot] || game.userItems.some((entry) => entry.item_id === preview[slot] && entry.owned);
  const equipPreview = () => {
    if (!selectedOwned) {
      Alert.alert("尚未擁有", "這件外觀已試穿到模型上；取得後即可正式裝備。");
      return;
    }
    const selectedId = preview[slot];
    if (selectedId) game.equipAvatarItem(selectedId);
    else game.unequipAvatarSlot(slot);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.drawerBackdrop}>
        <JianghuPaperPanel style={styles.drawer}>
          <View style={styles.drawerHandle} />
          <View style={styles.drawerHeader}>
            <View><Text style={styles.drawerKicker}>江湖衣櫃</Text><Text style={styles.drawerTitle}>試穿與換裝</Text></View>
            <Pressable onPress={onClose} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="關閉換裝面板"><Text style={styles.closeText}>×</Text></Pressable>
          </View>
          <View style={styles.previewStage}>
            <View style={styles.previewGlow} />
            <CharacterAvatar equipment={preview} height={232} style={styles.previewAvatar} accessibilityLabel="試穿中的角色模型" />
            <View style={styles.previewCaption}><Text style={styles.previewCaptionKicker}>試穿外觀 · {avatarRarityLabel[selectedItem?.rarity ?? "common"]}</Text><Text style={styles.previewCaptionTitle}>{selectedItem?.name ?? "預設外觀"}</Text></View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotTabs}>
            {wardrobeSlots.map((entry) => <Pressable key={entry} onPress={() => setSlot(entry)} style={({ pressed }) => [styles.slotTab, slot === entry && styles.slotTabActive, pressed && styles.pressed]}><Text style={[styles.slotTabText, slot === entry && styles.slotTabTextActive]}>{avatarSlotLabel[entry]}</Text></Pressable>)}
          </ScrollView>
          <ScrollView style={styles.itemList} contentContainerStyle={styles.itemListContent} showsVerticalScrollIndicator={false}>
            {options.map((item) => {
              const owned = game.userItems.some((entry) => entry.item_id === item.id && entry.owned);
              const equipped = game.avatarEquipment[slot] === item.id;
              const selected = preview[slot] === item.id;
              return (
                <View key={item.id} style={[styles.itemRow, selected && styles.itemRowSelected, !owned && styles.itemRowLocked]}>
                  <Image source={avatarImageSource(item.asset_url)} style={styles.itemThumb} resizeMode="contain" />
                  <View style={[styles.raritySeal, { backgroundColor: avatarRarityColor[item.rarity] }]}><Text style={styles.raritySealText}>{avatarRarityLabel[item.rarity].slice(0, 1)}</Text></View>
                  <View style={styles.itemCopy}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.itemDescription} numberOfLines={1}>{item.description}</Text><Text style={[styles.itemStatus, { color: avatarRarityColor[item.rarity] }]}>{equipped ? "已裝備" : owned ? "已擁有" : "未擁有"}</Text></View>
                  <Pressable onPress={() => setPreview((current) => ({ ...current, [slot]: item.id }))} style={({ pressed }) => [styles.tryButton, selected && styles.tryButtonSelected, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`試穿${item.name}`}><Text style={[styles.tryButtonText, selected && styles.tryButtonTextSelected]}>{selected ? "試穿中" : "試穿"}</Text></Pressable>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.drawerActions}>
            <Pressable onPress={() => setPreview((current) => ({ ...current, [slot]: defaultAvatarEquipment[slot] }))} style={({ pressed }) => [styles.unequipButton, pressed && styles.pressed]} accessibilityRole="button"><Text style={styles.unequipButtonText}>卸下</Text></Pressable>
            <Pressable disabled={!selectedOwned} onPress={equipPreview} style={({ pressed }) => [styles.equipButton, !selectedOwned && styles.disabledButton, pressed && selectedOwned && styles.pressed]} accessibilityRole="button"><Text style={styles.equipButtonText}>{selectedOwned ? "裝備此試穿外觀" : "尚未擁有"}</Text></Pressable>
          </View>
        </JianghuPaperPanel>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, position: "relative" },
  scrollContent: { paddingTop: 10, paddingBottom: 42 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 4, paddingBottom: 14 },
  identityRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: { width: 37, height: 37 },
  kicker: { color: "#2E7C78", fontSize: 10, lineHeight: 14, letterSpacing: 1, fontWeight: "900" },
  heading: { color: "#213D3C", fontSize: 25, lineHeight: 31, fontWeight: "900", marginTop: -1 },
  nickname: { color: "#74847C", fontSize: 10, lineHeight: 14, fontWeight: "800", marginTop: -1 },
  settings: { borderWidth: 1, borderColor: "#C7DED5", backgroundColor: "rgba(255,253,246,0.85)", borderRadius: 13, paddingHorizontal: 12, paddingVertical: 8 },
  settingsText: { color: "#2E7C78", fontSize: 11, lineHeight: 14, fontWeight: "900" },
  stage: { height: 362, borderRadius: 26, overflow: "hidden", backgroundColor: "#315F78", shadowColor: "#315F78", shadowOpacity: 0.23, shadowRadius: 13, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  stageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(9,42,45,0.20)" },
  stageMist: { position: "absolute", left: -40, right: -40, bottom: 20, height: 115, borderRadius: 100, backgroundColor: "rgba(204,232,218,0.16)" },
  stageAvatar: { position: "absolute", right: 2, bottom: -6, zIndex: 2 },
  stageCopy: { position: "absolute", left: 17, top: 18, width: "56%", zIndex: 3 },
  stageKicker: { color: "#D8F3E6", fontSize: 9, lineHeight: 13, letterSpacing: 0.5, fontWeight: "900" },
  stageTitle: { color: "#FFFDF6", fontSize: 24, lineHeight: 30, fontWeight: "900", marginTop: 5 },
  stageMeta: { color: "#FFE2A0", fontSize: 11, lineHeight: 16, fontWeight: "900", marginTop: 4 },
  stageNote: { color: "#D9F3E9", fontSize: 11, lineHeight: 16, marginTop: 7, fontWeight: "700" },
  stageBelt: { position: "absolute", left: 12, right: 12, bottom: 11, minHeight: 47, borderRadius: 15, backgroundColor: "rgba(13,55,58,0.83)", borderWidth: 1, borderColor: "rgba(255,225,138,0.37)", flexDirection: "row", alignItems: "center", justifyContent: "space-around", zIndex: 4 },
  beltItem: { alignItems: "center", minWidth: 68 }, beltValue: { color: "#FFF0C8", fontSize: 13, lineHeight: 17, fontWeight: "900" }, beltLabel: { color: "#CFF1E4", fontSize: 8, lineHeight: 11, fontWeight: "800", marginTop: 1 }, beltDivider: { width: 1, height: 23, backgroundColor: "rgba(255,255,255,0.20)" },
  equipmentPanel: { marginTop: 14, padding: 15 },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  panelKicker: { color: "#AD722A", fontSize: 10, lineHeight: 14, letterSpacing: 0.9, fontWeight: "900" },
  panelTitle: { color: "#213D3C", fontSize: 18, lineHeight: 23, fontWeight: "900", marginTop: 1 },
  changeButton: { borderRadius: 13, backgroundColor: "#B64732", paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: "#963527" },
  changeButtonText: { color: "#FFFFFF", fontSize: 11, lineHeight: 14, fontWeight: "900" },
  equipmentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 13 },
  equipmentCell: { width: "31.5%", minHeight: 65, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F9F4E7", borderWidth: 1, borderColor: "#E1D8C7", paddingHorizontal: 6, paddingVertical: 6, borderRadius: 12 },
  equipmentThumb: { width: 25, height: 38 }, emptyThumb: { width: 25, height: 38, alignItems: "center", justifyContent: "center" }, emptyThumbText: { color: "#95A39C", fontSize: 17, lineHeight: 20 }, equipmentCopy: { flex: 1, minWidth: 0 }, equipmentSlot: { color: "#84948B", fontSize: 8, lineHeight: 11, fontWeight: "900" }, equipmentName: { color: "#345450", fontSize: 10, lineHeight: 13, fontWeight: "900", marginTop: 1 }, equipmentRarity: { fontSize: 8, lineHeight: 11, fontWeight: "900", marginTop: 1 },
  templateTestPanel: { marginTop: 12, padding: 14, borderColor: "#C9DDD2", backgroundColor: "#FAF8ED" }, templateTestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, templateTestTitle: { color: "#213D3C", fontSize: 16, lineHeight: 21, fontWeight: "900", marginTop: 2 }, templateTestCount: { color: "#B47B2C", fontSize: 13, lineHeight: 17, fontWeight: "900", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: "#FFF0C8" }, templateTestHint: { color: "#60766D", fontSize: 10, lineHeight: 15, marginTop: 8, fontWeight: "800" }, templateTestButton: { marginTop: 10, minHeight: 39, borderRadius: 12, backgroundColor: "#315F78", alignItems: "center", justifyContent: "center" }, templateTestButtonText: { color: "#FFFFFF", fontSize: 11, lineHeight: 14, fontWeight: "900" },
  trainingHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 23, marginHorizontal: 5 }, trainingTitle: { color: "#213D3C", fontSize: 18, lineHeight: 23, fontWeight: "900" }, trainingHint: { color: "#84948B", fontSize: 9, lineHeight: 12, fontWeight: "800" },
  attributeStrip: { marginTop: 9, flexDirection: "row", padding: 10, borderRadius: 19, borderWidth: 1, borderColor: "#DCE8DF", backgroundColor: "rgba(255,253,246,0.78)" }, attributeItem: { flex: 1, alignItems: "center" }, attributeSeal: { width: 27, height: 27, borderRadius: 14, borderWidth: 1, alignItems: "center", justifyContent: "center" }, attributeSealText: { fontSize: 12, lineHeight: 15, fontWeight: "900" }, attributeName: { color: "#74847C", fontSize: 9, lineHeight: 12, fontWeight: "800", marginTop: 4 }, attributeValue: { fontSize: 14, lineHeight: 18, fontWeight: "900", marginTop: 1 }, attributeTrack: { width: "74%", height: 3, borderRadius: 3, backgroundColor: "#E3EAE1", marginTop: 4, overflow: "hidden" }, attributeFill: { height: "100%", borderRadius: 3 },
  drawerBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,45,45,0.63)", paddingHorizontal: 8, paddingTop: 54 },
  drawer: { maxHeight: "100%", padding: 15, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }, drawerHandle: { width: 39, height: 4, borderRadius: 3, backgroundColor: "#C9C0AE", alignSelf: "center", marginBottom: 10 },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, drawerKicker: { color: "#AD722A", fontSize: 10, lineHeight: 14, letterSpacing: 0.8, fontWeight: "900" }, drawerTitle: { color: "#213D3C", fontSize: 20, lineHeight: 26, fontWeight: "900", marginTop: 1 },
  closeButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#E4EEE6", alignItems: "center", justifyContent: "center" }, closeText: { color: "#315F78", fontSize: 22, lineHeight: 25, fontWeight: "900" },
  previewStage: { height: 213, marginTop: 11, borderRadius: 17, overflow: "hidden", backgroundColor: "#D8E8DE", borderWidth: 1, borderColor: "#BFD6C8", alignItems: "center", justifyContent: "center" }, previewGlow: { position: "absolute", width: 186, height: 92, borderRadius: 100, bottom: 11, backgroundColor: "rgba(255,225,136,0.34)" }, previewAvatar: { position: "absolute", bottom: -18 }, previewCaption: { position: "absolute", left: 10, bottom: 9, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 6, backgroundColor: "rgba(20,61,64,0.84)" }, previewCaptionKicker: { color: "#D1F2E5", fontSize: 8, lineHeight: 11, fontWeight: "900" }, previewCaptionTitle: { color: "#FFF9E8", fontSize: 11, lineHeight: 14, fontWeight: "900", marginTop: 1 },
  slotTabs: { gap: 7, paddingVertical: 12 }, slotTab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 13, borderWidth: 1, borderColor: "#D8D0BE", backgroundColor: "#FFFDF6" }, slotTabActive: { backgroundColor: "#315F78", borderColor: "#315F78" }, slotTabText: { color: "#6F827A", fontSize: 11, lineHeight: 14, fontWeight: "900" }, slotTabTextActive: { color: "#FFFFFF" },
  itemList: { maxHeight: 213 }, itemListContent: { gap: 7, paddingBottom: 4 }, itemRow: { minHeight: 69, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 8, paddingVertical: 7, borderRadius: 14, backgroundColor: "#FFFDF6", borderWidth: 1, borderColor: "#E0D8C7" }, itemRowSelected: { backgroundColor: "#FFF6E4", borderColor: "#B47B2C" }, itemRowLocked: { opacity: 0.72 }, itemThumb: { width: 36, height: 50 }, raritySeal: { width: 23, height: 23, borderRadius: 8, alignItems: "center", justifyContent: "center" }, raritySealText: { color: "#FFFFFF", fontSize: 10, lineHeight: 13, fontWeight: "900" }, itemCopy: { flex: 1, minWidth: 0 }, itemName: { color: "#2F504C", fontSize: 12, lineHeight: 16, fontWeight: "900" }, itemDescription: { color: "#80918A", fontSize: 9, lineHeight: 13, marginTop: 1 }, itemStatus: { fontSize: 9, lineHeight: 12, fontWeight: "900", marginTop: 2 }, tryButton: { minWidth: 48, alignItems: "center", borderRadius: 10, paddingHorizontal: 8, paddingVertical: 7, backgroundColor: "#EDF2E9", borderWidth: 1, borderColor: "#D0DDD1" }, tryButtonSelected: { backgroundColor: "#315F78", borderColor: "#315F78" }, tryButtonText: { color: "#57756C", fontSize: 10, lineHeight: 13, fontWeight: "900" }, tryButtonTextSelected: { color: "#FFFFFF" },
  drawerActions: { flexDirection: "row", gap: 9, marginTop: 12 }, unequipButton: { flex: 0.75, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, borderWidth: 1, borderColor: "#C7D7CA", backgroundColor: "#E9EFEA" }, unequipButtonText: { color: "#55736A", fontSize: 12, lineHeight: 16, fontWeight: "900" }, equipButton: { flex: 1.25, minHeight: 46, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#B64732", borderWidth: 1, borderColor: "#963527" }, equipButtonText: { color: "#FFFFFF", fontSize: 12, lineHeight: 16, fontWeight: "900" }, disabledButton: { opacity: 0.52 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
});
