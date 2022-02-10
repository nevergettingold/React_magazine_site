import React from "react";
import { useSelector } from "react-redux";

import { Grid, Text } from "../elements";
import Card from "../components/Card";
import { realtime } from "../shared/firebase";

const Notification = (props) => {
  const user = useSelector((state) => state.user.user);
  const [noti, setNoti] = React.useState([]);
  React.useEffect(() => {
    if (!user) {
      return;
    }

    const notiDB = realtime.ref(`noti/${user.uid}/list`);
    console.log(notiDB);
    const _noti = notiDB.orderByChild("insert_dt"); //realtime database 는 오름차순만 지원하기 때문에 data를 먼저 가져오고 js로 역순한다

    _noti.once("value", (snapshot) => {
      if (snapshot.exists()) {
        let _data = snapshot.val();

        let _noti_list = Object.keys(_data)
          .reverse()
          .map((s) => {
            //reverse로 시간 내림차순
            return _data[s];
          });
        console.log(_noti_list);
        setNoti(_noti_list);
      }
    });
  }, [user]); //user 정보가 update되면서 noti 를 가져온다

  return (
    <React.Fragment>
      <Grid padding="0px 150px">
        {noti.map((n, idx) => {
          return <Card key={`$noti_${idx}`} {...n} />; //key값을 post_id로 할 경우, 한 게시물에 여러 댓글이 달렸을 때 중복된다.
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;
