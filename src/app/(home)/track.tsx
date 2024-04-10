import { ActivityIndicator, FlatList, Text } from "react-native";

import { useFormattedTracks } from "@/features/track/api/getTracks";

import Colors from "@/constants/Colors";
import TrackCard from "@/features/track/TrackCard";

/** @description Screen for `/track` route. */
export default function TrackScreen() {
  const { isPending, data } = useFormattedTracks();

  return (
    <FlatList
      initialNumToRender={15}
      data={data}
      keyExtractor={({ id }) => id}
      renderItem={({ item: { id, name, coverSrc, artistName, duration } }) => (
        <TrackCard
          {...{ id, coverSrc, duration }}
          textContent={[name, artistName]}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        isPending ? (
          <ActivityIndicator
            size="large"
            color={Colors.surface500}
            className="mx-auto"
          />
        ) : (
          <Text className="mx-auto text-center font-geistMono text-base text-foreground100">
            No Tracks Found
          </Text>
        )
      }
      contentContainerClassName="mt-5 w-full gap-2 px-4 pb-16"
    />
  );
}
