// components/Screen.tsx
import React from "react";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

export function Screen({ style, children, ...rest }: SafeAreaViewProps) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: "#fff" }, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
}
