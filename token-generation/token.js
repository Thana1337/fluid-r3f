// api/generateToken.js
import { AccessToken, VideoGrant } from 'livekit-server-sdk';

export default async function handler(req, res) {
  const { roomName, identity } = req.query;
  if (!roomName || !identity) {
    return res.status(400).json({ error: "Missing roomName or identity" });
  }
  
  // Use environment variables for your credentials
  const apiKey = 'API5dq5xUEiC2J9';
  const apiSecret = '1fyqTxoHVRqz00ccHZgrIuEjXefWzclk6mwpQfmmUCmD';
  
  // Create a new access token
  const at = new AccessToken(apiKey, apiSecret, { identity });
  
  // Create a grant for joining the room (video grant is used even for audio)
  const videoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  };
  
  at.addGrant(videoGrant);
  
  // Generate the JWT token. If toJwt returns a promise, await it.
  const token = await at.toJwt();
  
  res.status(200).json({ token });
}
