import React, { useState } from "react";
import "../shared/App.css";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useDispatch, useSelector } from "react-redux";

import { realtime } from "../shared/firebase";
import { Grid, Image, Input, Text, Button } from "../elements";
import { actionCreators as postActions } from "../redux/modules/post";
import post from "../redux/modules/post";
import { setUseProxies } from "immer";
import { history } from "../redux/configureStore";
import { useRef } from "react";

const Like = (props) => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const [likeList, setLikeList] = useState([]);

  const is_like = props.props.is_like;
  const post_id = props.props.id;
  const like = props.props.like;

  const likePost = () => {
    dispatch(
      postActions.likePostFB(post_id, user.uid, likeList, {
        like,
        is_like,
      })
    );
  };

  const dislikedPost = () => {
    dispatch(
      postActions.dislikePostFB(post_id, user.uid, likeList, {
        like,
        is_like,
      })
    );
  };

  React.useEffect(() => {
    if (!user) {
      return;
    } else if (like === 0) {
      setLikeList([]);
    }
    const likesDB = realtime.ref(`likes/${user.uid}`);
    const _likeDB = realtime.ref(`likes`);
    _likeDB.on("value", (snapshot) => {
      // user id search
      if (snapshot.exists()) {
        let datas = snapshot.val();
        let userids = Object.keys(datas).map((s) => {
          return s;
        });
        // 로그인 되어 있는  user id 가 있으면
        if (userids.includes(user.uid)) {
          likesDB.on("value", (snapshot) => {
            //로그인 되어 있는 user id가 좋아한 post search
            if (snapshot.exists()) {
              let _data = snapshot.val();
              let _like_list = Object.keys(_data).map((s) => {
                return _data[s];
              });
              let data = _like_list.map((a) => a.post_id);
              setLikeList(data);
            }
          });
        } else {
          setLikeList([]);
        }
      }
    });
  }, [like]);

  if (!user) {
    return (
      <React.Fragment>
        <Grid is_flex padding="5px" width="65px">
          <FavoriteIcon
            style={{ color: "grey", cursor: "pointer" }}
            onClick={() => {
              alert("로그인 먼저 부탁드려요!");
              history.push("/login");
            }}
          />
          <Text bold>{like}개</Text>
        </Grid>
      </React.Fragment>
    );
  } else if (user && likeList.includes(post_id)) {
    return (
      <React.Fragment>
        <Grid is_flex padding="5px" width="65px">
          <FavoriteIcon
            style={{
              color: "red",
              cursor: "pointer",
            }}
            onClick={dislikedPost}
          />

          <Text bold>{like}개</Text>
        </Grid>
      </React.Fragment>
    );
  } else if ((user && !likeList.includes(post_id)) || !likeList) {
    return (
      <React.Fragment>
        <Grid is_flex padding="5px" width="65px">
          <FavoriteIcon
            style={{
              color: "grey",
              cursor: "pointer",
            }}
            onClick={likePost}
          />
          <Text bold>{like}개</Text>
        </Grid>
      </React.Fragment>
    );
  }
  // return (
  //   <React.Fragment>
  //     <Grid is_flex padding="5px" width="65px">
  //       <FavoriteIcon
  //         style={{
  //           color: likeList.includes(post_id) ? "red" : "grey",
  //           cursor: "pointer",
  //         }}
  //         onClick={likePost}
  //       />
  //       <Text bold>{like}개</Text>
  //     </Grid>
  //   </React.Fragment>
  // );
};

export default Like;
