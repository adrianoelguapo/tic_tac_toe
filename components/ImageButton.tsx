import React from "react";
import { GestureResponderEvent, ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";

interface ImageButtonProps {

  children: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: any;
  disabled?: boolean;

}

export const ImageButton: React.FC<ImageButtonProps> = ({ children, onPress, style, disabled }) => {

  return (

    <TouchableOpacity style = {[styles.container, style]} onPress = {onPress} disabled = {disabled} activeOpacity = {0.8}>

      <ImageBackground source = {require("../assets/game-images/button.png")} style = {styles.buttonBackground} resizeMode = "stretch">

        <Text style = {styles.buttonText}>{children}</Text>

      </ImageBackground>

    </TouchableOpacity>

  );

};

/* --- Estilos del componente --- */
const styles = StyleSheet.create({

  container: {

    width: "100%",
    height: 60,
    marginVertical: 8,

  },

  buttonBackground: {

    flex: 1,
    justifyContent: "center",
    alignItems: "center",

  },

  buttonText: {

    fontFamily: "Jersey10_400Regular",
    fontSize: 28,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: -6,

  }

});