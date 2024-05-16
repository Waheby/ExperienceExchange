import ContentCSS from "../assets/styles/Content/content.module.css";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";

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
import { Navigate } from "react-router-dom";

function VideoForm(props) {
  let navigate = useNavigate();

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
    <div style={{ textAlign: "center" }}>
      <p>Enter your AppID and Channel Name</p>
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
            : alert("Please enter the App ID and Channel Name")
        }
      >
        Join
      </button>
      <button onClick={() => navigate(`/userdashboard`)}>
        Exit to Dashboard
      </button>
    </div>
  );
}

export default VideoForm;
