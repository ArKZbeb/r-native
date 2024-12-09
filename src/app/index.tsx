import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import React from "react";
import { Alert, View } from "react-native";

export default function Index() {
  const [name, setName] = React.useState("");

  const handleInputChange = (text: string) => {
    setName(text);
  };

  return (
    <View className="flex-1 justify-center items-center gap-4">
      <View className="space-y-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter your name..."
          onChangeText={(text) => handleInputChange(text)}
        />
      </View>

      <Button
        className="bg-red-400"
        onPress={() => Alert.alert(`Hello ${name}`)}
      >
        <Text>Click me</Text>
      </Button>
    </View>
  );
}
