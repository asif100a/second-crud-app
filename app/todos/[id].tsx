import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ColorSchemeTypes, ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TodoTypes } from "..";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Octicons from "@expo/vector-icons/Octicons";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [todo, setTodo] = useState<TodoTypes | null>(null);

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageData = jsonValue ? JSON.parse(jsonValue) : null;

        if (storageData && storageData.length) {
          const myTodo = storageData.find(
            (todo: TodoTypes) => todo.id.toString() === id
          );
          setTodo(myTodo);
        }
      } catch (error) {
        console.error("❌ Failed to fetch data: ", error);
      }
    };

    fetchData();
  }, [id]);

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  const styles = createStyles(theme, colorScheme);

  const handleSave = async () => {
    if (!todo) return;
    try {
      const saveTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageData = jsonValue ? JSON.parse(jsonValue) : null;

      if (storageData && storageData.length) {
        const otherTodos = storageData.filter(
          (todo: TodoTypes) => todo.id !== saveTodo.id
        );
        const allTodos = [...otherTodos, saveTodo];
        await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos));
      } else {
        await AsyncStorage.setItem("TodoApp", JSON.stringify([saveTodo]));
      }

      router.push("/");
    } catch (error) {
      console.error("❌ Failed to save data: ", error);
    }
  };

  if (!loaded && !error) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          maxLength={30}
          placeholder="Edit todo"
          placeholderTextColor="gray"
          value={todo?.title || ""}
          onChangeText={(text) =>
            setTodo((prev) =>
              prev
                ? { ...prev, title: text }
                : { id: 0, title: text, completed: false }
            )
          }
        />
        <Pressable
          onPress={() =>
            setColorScheme(colorScheme === "light" ? "dark" : "light")
          }
          style={{ marginLeft: 10 }}
        >
          <Octicons
            name={colorScheme === "dark" ? "moon" : "sun"}
            size={24}
            color={theme.text}
            selectable={undefined}
            style={{ width: 24 }}
          />
        </Pressable>
      </View>
      <View style={styles.inputContainer}>
        {/* Save Button */}
        <Pressable onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
        {/* Cancel Button */}
        <Pressable
          onPress={() => router.push("/")}
          style={[styles.saveButton, { backgroundColor: "red" }]}
        >
          <Text style={[styles.saveButtonText, { color: "white" }]}>
            Cancel
          </Text>
        </Pressable>
      </View>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

function createStyles(theme: any, colorScheme: ColorSchemeTypes) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: "auto",
    },
    input: {
      flex: 1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    saveButtonText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "black" : "white",
    },
  });
}
