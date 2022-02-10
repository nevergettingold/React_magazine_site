import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { actionCreators as postActions } from "../redux/modules/post";
import Permit from "../shared/Permit";
import { Button } from "../elements";
import { history } from "../redux/configureStore";
import { Grid } from "../elements";

import { useSelector, useDispatch } from "react-redux";

const PostDetail = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.id;

  const user_info = useSelector((state) => state.user.user);

  const post_list = useSelector((store) => store.post.list);

  const post_idx = post_list.findIndex((p) => p.id === id);
  const post = post_list[post_idx];

  React.useEffect(() => {
    if (post) {
      return;
    }
    dispatch(postActions.getOnePostFB(id));
  }, []);

  return (
    <React.Fragment>
      <Grid padding="0px 150px">
        {post && (
          <Post {...post} is_me={post.user_info.user_id === user_info?.uid} />
        )}
        <CommentWrite post_id={id} />
        <CommentList post_id={id} />
        <Permit>
          <Button
            is_float
            text="+"
            _onClick={() => {
              history.push("/write");
            }}
          />
        </Permit>
      </Grid>
    </React.Fragment>
  );
};

export default PostDetail;
