import { getIO } from '../socket.js'; // Correct import

// Controller to initiate a call
export const initiateCall = (req, res) => {
  const { userToCall, signalData, from, name } = req.body;

  const io = getIO();
  io.to(userToCall).emit('callUser', { signal: signalData, from, name });

  res.status(200).json({ message: 'Call initiated' });
};

// Controller to answer a call
export const answerCall = (req, res) => {
  const { signal, to } = req.body;

  const io = getIO();
  io.to(to).emit('callAccepted', signal);

  res.status(200).json({ message: 'Call answered' });
};

// Controller to end a call
export const endCall = (req, res) => {
  const { callId, to } = req.body;

  const io = getIO();
  if (to) {
    io.to(to).emit('callEnded', { callId });
  }
  io.emit('callEnded', { callId }); // broadcast

  res.status(200).json({ message: 'Call ended' });
};

// Controller to start screen sharing
export const startScreenShare = (req, res) => {
  const { userId, screenTrack } = req.body;

  const io = getIO();
  io.to(userId).emit('startScreenShare', screenTrack);

  res.status(200).json({ message: 'Screen sharing started' });
};

// Controller to stop screen sharing
export const stopScreenShare = (req, res) => {
  const { userId, videoTrack } = req.body;

  const io = getIO();
  io.to(userId).emit('stopScreenShare', videoTrack);

  res.status(200).json({ message: 'Screen sharing stopped' });
};

// Controller to start recording
export const startRecording = (req, res) => {
  const { userId } = req.body;

  const io = getIO();
  io.to(userId).emit('startRecording');

  res.status(200).json({ message: 'Recording started' });
};

// Controller to stop recording
export const stopRecording = (req, res) => {
  const { userId } = req.body;

  const io = getIO();
  io.to(userId).emit('stopRecording');

  res.status(200).json({ message: 'Recording stopped' });
};
