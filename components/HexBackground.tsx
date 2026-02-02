import React from "react";
import { ImageBackground, StyleSheet } from "react-native";

/* --- Componente que añade la imagen de fondo --- */
export const HexBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (

    /* --- Imagen de fondo --- */
    <ImageBackground source = {require("../assets/game-images/bg.png")} style = {styles.background} resizeMode = "cover">{children}</ImageBackground>

  );

};

/* --- Estilos del componente --- */
const styles = StyleSheet.create({

  background: {

    flex: 1,
    width: "100%",
    height: "100%",

  },

});
