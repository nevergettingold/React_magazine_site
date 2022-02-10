import React from "react";
import { Badge } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useSelector } from "react-redux";
import { history } from "../redux/configureStore";
import { realtime } from "../shared/firebase";

const NotiBadge = (props) => {
  const [is_read, setIsRead] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const user_id = useSelector((state) => state.user.user.uid);
  const notiCheck = () => {
    if (!open) {
      const notiDB = realtime.ref(`noti/${user_id}`);
      notiDB.update({ read: true });
      props._onClick();
      setOpen(true);
    } else {
      setOpen(false);
      history.go(-1);
    }
  };

  //함수형 컴포넌트에서 Listener 구독할 때, useEffect
  React.useEffect(() => {
    const notiDB = realtime.ref(`noti/${user_id}`);

    notiDB.on("value", (snapshot) => {
      if (snapshot.val() === null) {
        return;
      }
      setIsRead(snapshot.val().read);
    });
  }, []);

  return (
    <React.Fragment>
      <Badge
        style={{ cursor: "pointer" }}
        color="secondary"
        variant="dot"
        invisible={is_read}
        onClick={notiCheck}
      >
        <NotificationsIcon />
      </Badge>
    </React.Fragment>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};

export default NotiBadge;
