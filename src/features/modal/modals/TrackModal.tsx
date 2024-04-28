import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { usePathname } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { ScrollView } from "react-native-gesture-handler";

import {
  addTrackToQueueAtom,
  playingInfoAtom,
} from "@/features/playback/api/playing";
import { useTrack } from "@/features/track/api/getTrack";
import { useIsTrackInPlaylist } from "@/features/playlist/api/isTrackInPlaylist";
import { useRemoveTrackFromPlaylist } from "@/features/playlist/api/removeTrackFromPlaylist";
import { useToggleFavorite } from "@/features/track/api/toggleFavorite";
import { modalAtom } from "../store";

import { cn } from "@/lib/style";
import { mutateGuard } from "@/lib/react-query";
import type { MediaList } from "@/components/media/types";
import { TextLine } from "@/components/ui/Text";
import { ReservedNames } from "@/features/playback/utils/trackList";
import { ModalBase } from "../components/ExperimentalModalBase";
import { ModalButton } from "../components/ExperimentalModalButton";
import { ModalLink } from "../components/ExperimentalModalLink";

type Props = { trackId: string; origin?: MediaList | "track-current" };

/** @description Modal used for tracks. */
export function TrackModal({ trackId, origin }: Props) {
  const openModal = useSetAtom(modalAtom);
  const addTrackToQueue = useSetAtom(addTrackToQueueAtom);
  const { isPending, error, data } = useTrack(trackId);
  const toggleMutation = useToggleFavorite(trackId);

  if (isPending || error) return null;

  // Add optimistic UI updates.
  const isToggled = toggleMutation.isPending
    ? !data.isFavorite
    : data.isFavorite;

  return (
    <ModalBase>
      <BottomSheetScrollView>
        <TextLine className="px-4 text-center font-ndot57 text-title text-foreground50">
          {data.name}
        </TextLine>
        <TextLine
          className={cn(
            "mb-4 px-4 text-center font-ndot57 text-lg text-accent50",
            { "mb-0": origin === "artist" && !data.album?.name },
          )}
        >
          {origin === "artist" ? data.album?.name : data.artistName}
        </TextLine>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          contentContainerClassName="mb-2 grow gap-2 px-4"
        >
          <ModalButton
            content={isToggled ? "Unfavorite" : "Favorite"}
            icon={isToggled ? "FavoriteFilled" : "FavoriteOutline"}
            onPress={() => mutateGuard(toggleMutation, data.isFavorite)}
            dontCloseOnPress
          />
          <RemoveTrackFromPlaylist trackId={trackId} />
          <ModalButton
            content="Add to Playlists"
            icon="PlaylistAddOutline"
            onPress={() =>
              openModal({ type: "track-to-playlist", id: trackId })
            }
          />
          <ModalButton
            content="Add to Queue"
            icon="QueueMusicOutline"
            onPress={() => addTrackToQueue(data.id)}
          />
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          overScrollMode="never"
          contentContainerClassName="grow gap-2 px-4"
        >
          {!!data.album && origin !== "album" && (
            <ModalLink
              href={`/album/${data.album.id}`}
              content="View Album"
              icon="AlbumOutline"
            />
          )}

          {origin !== "artist" && (
            <ModalLink
              href={`/artist/${data.artistName}`}
              content="View Artist"
              icon="ArtistOutline"
            />
          )}

          {origin === "track-current" && (
            <ModalButton
              content="View Upcoming"
              icon="LibraryMusicFilled"
              onPress={() => openModal({ type: "track-upcoming" })}
            />
          )}
        </ScrollView>
      </BottomSheetScrollView>
    </ModalBase>
  );
}

/**
 * @description Renders a button to remove track from this playlist if
 *  certain conditions are met.
 */
function RemoveTrackFromPlaylist({ trackId }: { trackId: string }) {
  const pathname = usePathname();
  const { listSrc } = useAtomValue(playingInfoAtom);

  const isValidPath = useMemo(
    () => pathname.startsWith("/playlist/") || pathname === "/current-track",
    [pathname],
  );
  const currentPlaylist = useMemo(() => {
    let _playlistName = pathname.startsWith("/playlist/")
      ? decodeURIComponent(pathname.substring(10))
      : listSrc?.type === "playlist"
        ? listSrc.name
        : undefined;
    if (_playlistName && ReservedNames.has(_playlistName)) {
      _playlistName = undefined;
    }

    return _playlistName;
  }, [pathname, listSrc]);

  const {
    isPending,
    error,
    data: isTrackInPlaylist,
  } = useIsTrackInPlaylist(trackId, currentPlaylist);
  const removeTrackFromPlaylist = useRemoveTrackFromPlaylist(
    trackId,
    currentPlaylist,
  );

  if (isPending || error) return null;
  if (!isValidPath || !isTrackInPlaylist) return null;

  return (
    <ModalButton
      content="Remove from this Playlist"
      icon="DeleteOutline"
      onPress={() => mutateGuard(removeTrackFromPlaylist, undefined)}
    />
  );
}
