import type { ReactNode } from "react";
import type { ImageSourcePropType, StyleProp, ViewStyle } from "react-native";
import { Image, StyleSheet, Text, View } from "react-native";

export function JianghuPageAtmosphere() {
  return (
    <View pointerEvents="none" style={styles.atmosphere}>
      <View style={styles.cloudOne} />
      <View style={styles.cloudTwo} />
      <View style={styles.mountain} />
      <Text style={styles.watermark}>江湖</Text>
    </View>
  );
}

export function JianghuPaperPanel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.paperPanel, style]}>{children}</View>;
}

export function JianghuSceneBanner({
  source,
  kicker,
  title,
  detail,
  children,
  style,
}: {
  source: ImageSourcePropType;
  kicker: string;
  title: string;
  detail?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.sceneBanner, style]}>
      <Image source={source} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.sceneShade} />
      <View style={styles.sceneCopy}>
        <Text style={styles.sceneKicker}>{kicker}</Text>
        <Text style={styles.sceneTitle}>{title}</Text>
        {detail ? <Text style={styles.sceneDetail}>{detail}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export const jianghuColors = {
  ink: "#223D3D",
  paper: "#F4F1E7",
  paperDeep: "#E9E2D1",
  jade: "#2E8B91",
  indigo: "#315F78",
  cinnabar: "#C94D42",
  gold: "#D99632",
  line: "#D8D1BF",
  muted: "#71817B",
};

const styles = StyleSheet.create({
  atmosphere: { ...StyleSheet.absoluteFillObject, overflow: "hidden", backgroundColor: "#F4F1E7" },
  cloudOne: { position: "absolute", width: 250, height: 92, borderRadius: 90, backgroundColor: "rgba(255,255,250,0.42)", top: 44, left: -106 },
  cloudTwo: { position: "absolute", width: 260, height: 80, borderRadius: 90, backgroundColor: "rgba(213,226,218,0.40)", top: 224, right: -120 },
  mountain: { position: "absolute", width: 430, height: 220, borderRadius: 220, backgroundColor: "rgba(132,166,152,0.13)", bottom: -138, left: -78 },
  watermark: { position: "absolute", top: 106, right: -8, color: "rgba(83,123,112,0.07)", fontSize: 92, lineHeight: 112, fontWeight: "900" },
  paperPanel: { borderRadius: 24, overflow: "hidden", backgroundColor: "rgba(255,253,246,0.91)", borderWidth: 1, borderColor: "#DED6C7", shadowColor: "#806F50", shadowOpacity: 0.09, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  sceneBanner: { height: 156, borderRadius: 24, overflow: "hidden", backgroundColor: "#315F78", shadowColor: "#315F78", shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  sceneShade: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(13, 41, 47, 0.20)" },
  sceneCopy: { position: "absolute", left: 16, bottom: 16, right: 114 },
  sceneKicker: { color: "#D8F0E5", fontSize: 10, lineHeight: 14, fontWeight: "900", letterSpacing: 1.05 },
  sceneTitle: { color: "#FFF9E8", fontSize: 23, lineHeight: 29, fontWeight: "900", marginTop: 3 },
  sceneDetail: { color: "#E8F5EC", fontSize: 11, lineHeight: 16, fontWeight: "700", marginTop: 4 },
});
