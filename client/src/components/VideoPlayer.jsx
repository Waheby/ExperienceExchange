import { Icon } from "@iconify/react";
import {
  AgoraRTCProvider,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
  useRemoteVideoTracks,
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";
import React from "react";

function VideoPLayer(
  props = {
    channelName,
    AppID,
    token,
  }
) {
  const { channelName, AppID, token } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack(true);
  const { isLoading: isLoadingCam, localCameraTrack } =
    useLocalCameraTrack(true);

  const remoteUsers = useRemoteUsers();
  console.log(remoteUsers);
  console.log(localMicrophoneTrack, localCameraTrack);
  usePublish([localMicrophoneTrack, localCameraTrack]); //to publish the local media tracks (microphone and camera tracks).
  useJoin({
    appid: AppID,
    channel: channelName,
    token: token === "" ? null : token,
  });

  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const { videoTracks } = useRemoteVideoTracks(remoteUsers);
  audioTracks.map((track) => track.play());
  videoTracks.map((track) => track.play());

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading) return <div style={styles.grid}>Loading devices...</div>;

  return (
    <div style={{ ...styles.grid, ...returnGrid(remoteUsers) }}>
      <LocalVideoTrack
        track={localCameraTrack}
        play={true}
        style={styles.gridCell}
      />
      {remoteUsers.map((user) => (
        <RemoteUser user={user} style={styles.gridCell} />
      ))}
    </div>
  );
}

export default VideoPLayer;

/* Style Utils */
const returnGrid = (remoteUsers) => {
  return {
    gridTemplateColumns:
      remoteUsers.length > 8
        ? unit.repeat(4)
        : remoteUsers.length > 3
        ? unit.repeat(3)
        : remoteUsers.length > 0
        ? unit.repeat(2)
        : unit,
  };
};
const unit = "minmax(0, 1fr) ";
const styles = {
  grid: {
    width: "1000px",
    height: "500px",
    display: "grid",
    borderStyle: "solid",
    borderWidth: "1px",
    margin: "auto",
  },
  gridCell: { height: "100%", width: "100%" },
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
  },
};
