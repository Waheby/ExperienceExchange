import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Searchbar from "../components/Searchbar";
import ScreenRecording from "../components/ScreenRecorder";
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
import ContentCSS from "../assets/styles/Content/content.module.css";
import VideoPLayer from "../components/VideoPlayer";
import VideoForm from "../components/VideoForm";
import { useSearchParams } from "react-router-dom";

// const APP_ID = "7a26c47116cf4606a08da84ce7d9cb47";
// const TOKEN =
//   "007eJxTYFhS8zbvvdKuywUm7zZzMi4yUktc8Sk5daXd5SN3fRYJ312owGCeaGSWbGJuaGiWnGZiZmCWaGCRkmhhkpxqnmKZnGRiftP+e2pDICPDrY0TGBihEMRnYkitYGAAAJQbIRs=";
// const CHANNEL = "ex";
// const client = AgoraRTC.createClient({
//   mode: "rtc",
//   codec: "vp8",
// });

function Session() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryToken = searchParams.get("token").replace(/ /g, "+"); //replace spaces with + sign
  const queryChannel = searchParams.get("name");

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const [channelName, setChannelName] = useState(queryChannel);
  const [AppID, setAppID] = useState("7a26c47116cf4606a08da84ce7d9cb47");
  const [token, setToken] = useState(queryToken);
  const [inCall, setInCall] = useState(false);

  const endSession = () => {
    setInCall(false);
    return <div>Rate the session:</div>;
  };

  const muteCall = () => {
    // client.localTracks.map((track) => track.setEnabled(true));
    // console.log(client.uid);
  };
  // const [users, setUsers] = useState([]);

  // let localTracks = [];
  // let remoteUsers = {};
  // const handleUserJoined = () => {};

  // const handleUserLeft = () => {};

  // const joinAndDisplayCam = async () => {
  //   let UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

  //   localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  //   let player = `<div style={{ width: "200px", height: "200px" }} id="user-${UID}">
  //                   <div style={{ width: "100%", height: "100%" }} id="user-${UID}"></div>
  //                 </div>`;

  //   console.log(localTracks);

  //   await client.publish([localTracks[0], localTracks[1]]);
  // };

  // let joinStream = async () => {
  //   await joinAndDisplayCam();
  // };

  // useEffect(() => {
  //   // client.on("user-published", handleUserJoined);
  //   // client.on("user-left", handleUserLeft);

  //   client
  //     .join(APP_ID, CHANNEL, TOKEN, null)
  //     .then((uid) => {
  //       Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid]);
  //     })
  //     .then((tracks, uid) => {
  //       const { audioTrack, videoTrack } = tracks;
  //       console.log(videoTrack);
  //       setUsers((previousUsers) => [...previousUsers], {
  //         uid,
  //         videoTrack,
  //       });
  //       client.publish(tracks);
  //     });
  // }, []);
  return (
    <>
      <h1 style={{ textAlign: "center" }}>Exchange Session</h1>
      {!inCall ? (
        <VideoForm
          AppID={AppID}
          setAppID={setAppID}
          channelName={channelName}
          setChannelName={setChannelName}
          token={token}
          setToken={setToken}
          setInCall={setInCall}
        />
      ) : (
        <>
          <ScreenRecording
            screen={true}
            audio={true}
            video={false}
            downloadRecordingPath="Screen_Recording_Demo"
            downloadRecordingType="mp4"
            emailToSupport="support@xyz.com"
          ></ScreenRecording>
          <AgoraRTCProvider client={client}>
            <VideoPLayer
              channelName={channelName}
              AppID={AppID}
              token={token}
            />
            <br />
            <br />
            <div
              style={{
                textAlign: "center",
                margin: "auto",
                alignContent: "center",
              }}
            >
              <button
                style={{
                  textAlign: "center",
                  margin: "auto",
                  alignContent: "center",
                  width: "100px",
                  height: "50px",
                  borderRadius: "15px",
                  backgroundColor: "#2C5F8D",
                  color: "white",
                  justifySelf: "center",
                  cursor: "pointer",
                }}
                onClick={() => endSession()}
              >
                Leave Call
              </button>
              {client.uid}
              {/* <button onClick={() => muteCall()}>Mute Call</button> */}
            </div>
          </AgoraRTCProvider>
        </>
      )}

      {/* <button
        onClick={() => {
          joinStream();
        }}
      >
        Connect to Room
      </button>
      {users.map((user) => {
        <VideoPLayer key={user.uid} user={user} />;
      })} */}
    </>
  );
}

export default Session;
