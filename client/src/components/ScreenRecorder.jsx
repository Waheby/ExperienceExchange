import React, { useState } from "react";
import { Row, Col, Button, Badge } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";
import Text from "antd/lib/typography/Text";
import { useSelector } from "react-redux";

const ScreenRecording = ({
  screen,
  audio,
  video,
  downloadRecordingPath,
  downloadRecordingType,
  emailToSupport,
}) => {
  const [recordingNumber, setRecordingNumber] = useState(0);
  const RecordView = () => {
    const {
      status,
      startRecording: startRecord,
      stopRecording: stopRecord,
      mediaBlobUrl,
    } = useReactMediaRecorder({ screen, audio, video });
    const startRecording = () => {
      return startRecord();
    };
    const stopRecording = () => {
      const currentTimeSatmp = new Date().getTime();
      setRecordingNumber(currentTimeSatmp);
      return stopRecord();
    };
    const viewRecording = () => {
      window.open(mediaBlobUrl, "_blank").focus();
    };
    const downloadRecording = () => {
      const pathName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
      try {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // for IE
          window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
        } else {
          // for Chrome
          const link = document.createElement("a");
          link.href = mediaBlobUrl;
          link.download = pathName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error(err);
      }
    };
    const mailRecording = () => {
      try {
        window.location.href = `mailTo:${emailToSupport}?subject=Screen recording for an Issue number ${recordingNumber}&body=Hello%20Team,%0D%0A%0D%0A${mediaBlobUrl}`;
      } catch (err) {
        console.error(err);
      }
    };
    return (
      <Row>
        <Col span="12" style={{ lineHeight: "24px" }}>
          {status && status !== "stopped" && (
            <Text>{status && status.toUpperCase()}</Text>
          )}
          {status && status === "recording" && (
            <Badge
              className="screen-recording-badge"
              color="#faad14"
              status="processing"
              offset={[2, 0]}
              style={{
                marginLeft: "5px",
              }}
            />
          )}
        </Col>
        <Col span="12" style={{ textAlign: "right" }}>
          {status && status !== "recording" && (
            <Button size="small" onClick={startRecording} type="primary" ghost>
              {mediaBlobUrl ? "Start Recording Again" : "Start Recording"}
            </Button>
          )}
          {status && status === "recording" && (
            <Button size="small" onClick={stopRecording} type="primary" ghost>
              Stop Recording
            </Button>
          )}
          {mediaBlobUrl && status && status === "stopped" && (
            <Button
              size="small"
              onClick={viewRecording}
              type="primary"
              className="viewRecording margin-left-sm"
            >
              View
            </Button>
          )}
          {downloadRecordingType &&
            mediaBlobUrl &&
            status &&
            status === "stopped" && (
              <Button
                size="small"
                onClick={downloadRecording}
                type="primary"
                className="downloadRecording margin-left-sm"
              >
                Download
              </Button>
            )}
        </Col>
        <hr style={{ width: "100%" }} />
        <br />
        <br />
        <br />
      </Row>
    );
  };
  return (
    <div className="Scren-Record-Wrapper" style={{ padding: "5px 20px" }}>
      {RecordView()}
    </div>
  );
};
export default ScreenRecording;
