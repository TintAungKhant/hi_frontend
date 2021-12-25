import Echo from "laravel-echo";
import {
  postBroadcastingAuth
} from "../api";

window.Pusher = require("pusher-js");

const socket = new Echo({
  broadcaster: "pusher",
  cluster: "ap1",
  encrypted: true,
  key: "db69f0f59ac3a6f2ab57",
  authorizer: (channel) => {
    return {
      authorize: (socketId, callback) => {
        postBroadcastingAuth({
            socket_id: socketId,
            channel_name: channel.name
          }).then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
});

export default socket;