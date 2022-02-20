export enum P2PMessageType {
  channelInit = 'channelInit',
  channelClose = 'channelClose',
  startScreenCast = 'startScreenCast',
  startVideo = 'startVideo',
  startAudio = 'startAudio',
  startChat = 'startChat',
  accept = 'accept',
  reject = 'reject',
  txtMessage = 'txtMessage',
  rtcOffer = 'rtcOffer',
  rtcAnswer = 'rtcAnswer',
  rtcClose = 'rtcClose',
  rtcNewICECandidate = 'rtcNewICECandidate'
}
