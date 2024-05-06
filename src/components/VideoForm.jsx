import ContentCSS from "../assets/styles/Content/content.module.css";
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
} from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

function VideoForm(props) {
  const {
    AppID,
    setAppID,
    channelName,
    setChannelName,
    token,
    setToken,
    setInCall,
  } = props;
  return (
    <div>
      <p>Please enter your Agora AppID and Channel Name {AppID}</p>
      <label htmlFor="appid">Agora App ID: </label>
      <input
        id="appid"
        type="text"
        value={AppID}
        onChange={(e) => setAppID(e.target.value)}
        placeholder="required"
      />
      <br />
      <br />
      <label htmlFor="channel">Channel Name: </label>
      <input
        id="channel"
        type="text"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
        placeholder="required"
      />
      <br />
      <br />
      <label htmlFor="token">Channel Token: </label>
      <input
        id="token"
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="optional"
      />
      <br />
      <br />
      <button
        onClick={() =>
          AppID && channelName
            ? setInCall(true)
            : alert("Please enter Agora App ID and Channel Name")
        }
      >
        Join
      </button>
    </div>
  );
}

export default VideoForm;