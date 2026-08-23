import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { JianghuPageAtmosphere } from "@/components/jianghu-ui";
import { levelTitle, useGame } from "@/lib/game-store";
import { settingsBanner } from "@/lib/custom-assets";

export default function SettingsScreen() {
  const game = useGame();
  const [name, setName] = useState(game.nickname);
  const [reminder, setReminder] = useState(true);

  return (
    <ScreenContainer containerClassName="bg-[#F4F1E7]" className="px-5">
      <View style={settingsPageStyles.page}><JianghuPageAtmosphere /><ScrollView style={settingsPageStyles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.head}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <Text style={styles.backText}>‹ 返回</Text>
          </Pressable>
          <Text style={styles.heading}>修煉設定</Text>
          <View style={styles.headSpacer} />
        </View>

        <View style={[styles.settingsBanner, settingsBannerLayers.banner]}>
          <Image source={settingsBanner} style={settingsBannerLayers.background} resizeMode="cover" />
          <View style={[styles.sceneShade, settingsBannerLayers.textShade]} />
          <View style={[styles.bannerCopy, settingsBannerLayers.copy]}>
            <Text style={styles.bannerKicker}>{game.sect} · 修煉手札</Text>
            <Text style={styles.bannerTitle}>{levelTitle(game.level)}</Text>
            <Text style={styles.bannerBody}>調整提醒與資料，讓修煉節奏始終貼近你的江湖。</Text>
          </View>
          <View style={settingsBannerLayers.belt}><View><Text style={settingsBannerLayers.beltValue}>{reminder ? "已開啟" : "已靜音"}</Text><Text style={settingsBannerLayers.beltLabel}>每日提醒</Text></View><View style={settingsBannerLayers.divider} /><View><Text style={settingsBannerLayers.beltValue}>本地保存</Text><Text style={settingsBannerLayers.beltLabel}>修煉資料</Text></View></View>
        </View>

        <Text style={styles.section}>少俠資料</Text>
        <View style={styles.listPanel}>
          <View style={styles.listRowStacked}>
            <Text style={styles.label}>暱稱</Text>
            <TextInput value={name} onChangeText={setName} onBlur={() => { game.nickname = name; }} style={styles.input} />
          </View>
          <View style={styles.listRow}>
            <View><Text style={styles.itemTitle}>所屬門派</Text><Text style={styles.itemSub}>門派身分會顯示於你的江湖名帖。</Text></View>
            <Text style={styles.itemValue}>{game.sect}</Text>
          </View>
        </View>

        <Text style={styles.section}>修煉提醒</Text>
        <View style={styles.listPanel}>
          <View style={styles.listRow}>
            <View><Text style={styles.itemTitle}>每日修煉提醒</Text><Text style={styles.itemSub}>每天晚上 8:00 提醒今日進度</Text></View>
            <Switch value={reminder} onValueChange={setReminder} trackColor={{ false: "#D8E7E2", true: "#2E8B91" }} />
          </View>
          <View style={styles.listRow}>
            <View><Text style={styles.itemTitle}>逾期提醒</Text><Text style={styles.itemSub}>任務逾期時提醒重新安排</Text></View>
            <Switch value trackColor={{ false: "#D8E7E2", true: "#2E8B91" }} />
          </View>
        </View>

        <Text style={styles.section}>資料管理</Text>
        <Pressable style={({ pressed }) => [styles.dangerRow, pressed && styles.pressed]} onPress={() => Alert.alert("清除本地資料", "這會清除所有任務與成長紀錄，確定嗎？", [{ text: "取消" }, { text: "清除", style: "destructive", onPress: () => { game.reset(); router.replace("/"); } }])}>
          <View><Text style={styles.danger}>清除本地資料</Text><Text style={styles.itemSub}>重置為新手狀態</Text></View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <Text style={styles.about}>江湖修煉手札 · MVP 原型 1.0.0{"\n"}任務即修煉，今日也要比昨日更強。</Text>
      </ScrollView></View>
    </ScreenContainer>
  );
}

const settingsPageStyles = StyleSheet.create({
  page: { flex: 1, position: "relative" },
  scroll: { zIndex: 1 },
});

const settingsBannerLayers = StyleSheet.create({
  banner: { minHeight: 212 },
  background: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  textShade: { width: "70%", backgroundColor: "rgba(11,39,48,0.50)" },
  copy: { zIndex: 3 },
  belt: { position: "absolute", left: 12, right: 12, bottom: 12, height: 43, borderRadius: 14, paddingHorizontal: 15, backgroundColor: "rgba(17,57,65,0.80)", borderWidth: 1, borderColor: "rgba(255,225,138,0.34)", flexDirection: "row", alignItems: "center", justifyContent: "space-around", zIndex: 4 },
  beltValue: { color: "#FFF0C8", fontSize: 12, fontWeight: "900", textAlign: "center" },
  beltLabel: { color: "#C9F3E7", fontSize: 9, fontWeight: "800", marginTop: 1, textAlign: "center" },
  divider: { width: 1, height: 22, backgroundColor: "rgba(255,255,255,0.22)" },
});

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 42 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 12, paddingBottom: 16 },
  back: { width: 64, paddingVertical: 8 },
  backText: { color: "#2E8B91", fontWeight: "900" },
  heading: { color: "#18343C", fontSize: 20, fontWeight: "900" },
  headSpacer: { width: 64 },
  settingsBanner: { minHeight: 170, borderRadius: 24, overflow: "hidden", padding: 16, justifyContent: "center", marginBottom: 8, backgroundColor: "#2E8B91" },
  settingsBannerImage: { borderRadius: 24 },
  sceneShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(19, 59, 66, 0.38)" },
  bannerCharacter: { position: "absolute", right: -10, bottom: -2, width: 154, height: 170, opacity: 0.96 },
  bannerCopy: { width: "64%", zIndex: 1 },
  bannerKicker: { color: "#C9F3E7", fontWeight: "900", fontSize: 10, letterSpacing: 0.8 },
  bannerTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 22, marginTop: 6 },
  bannerBody: { color: "#E4F8F1", fontSize: 11, lineHeight: 17, marginTop: 7 },
  section: { color: "#18343C", fontSize: 18, fontWeight: "900", marginTop: 24, marginBottom: 9 },
  listPanel: { backgroundColor: "rgba(255,255,255,0.76)", borderRadius: 20, borderWidth: 1, borderColor: "#DCEEE9", overflow: "hidden" },
  listRow: { minHeight: 72, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#E5F0ED", gap: 12 },
  listRowStacked: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#E5F0ED" },
  label: { color: "#527074", fontSize: 12, fontWeight: "900", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#CFE7E1", borderRadius: 12, backgroundColor: "#FFFFFF", paddingHorizontal: 12, paddingVertical: 10, color: "#18343C", fontWeight: "800" },
  itemTitle: { color: "#18343C", fontWeight: "900", fontSize: 13 },
  itemSub: { color: "#7C9798", fontSize: 11, lineHeight: 16, marginTop: 4 },
  itemValue: { color: "#2E8B91", fontWeight: "900", fontSize: 12 },
  dangerRow: { minHeight: 72, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.76)", borderWidth: 1, borderColor: "#E9CECA" },
  danger: { color: "#D65E59", fontWeight: "900", fontSize: 13 },
  chevron: { color: "#D65E59", fontSize: 28, fontWeight: "300" },
  about: { color: "#8CA09E", textAlign: "center", lineHeight: 18, fontSize: 11, marginVertical: 32 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
