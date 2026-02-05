import { createContext } from "react";

const CurrentUserContext = createContext({
  currentUser: {},
  handleUpdateUser: () => {},
  handleUpdateAvatar: () => {},
});

export default CurrentUserContext;
