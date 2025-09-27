import { View, Text, Pressable, TextInput } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ThemeContext } from "@/context/ThemeContext";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TodoTypes } from "..";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [todo, setTodo] = useState<TodoTypes | null>(null);

  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  const [loaded, error] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageData = jsonValue ? JSON.parse(jsonValue) : null;

        if (storageData && storageData.length) {
          const myTodo = storageData.find((todo) => todo.id.toString() === id);
          setTodo(myTodo);
        }
      } catch (error) {
        console.error("❌ Failed to fetch data: ", error);
      }
    };
  }, []);

  const handleSave = async () => {
    try {
      const saveTodo = { ...todo, title: todo.title };

      const jsonValue = await AsyncStorage.getItem("TodoApp");
      const storageData = jsonValue ? JSON.parse(jsonValue) : null;

      if (storageData && storageData.length) {
        const otherTodos = storageData.filter(
          (todo) => todo.id !== saveTodo.id
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
    <SafeAreaView style={styles.conainter}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Edit todo" placeholderTextColor="gray" value={todo?.title || ''} onChangeText={(text) => setTodo((prev) => ({...prev, title: text}))} />
        <Pressable>

        </Pressable>
      </View>
      <View>
        <Pressable>
            
        </Pressable>
        <Pressable>
            
        </Pressable>
      </View>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = {

};