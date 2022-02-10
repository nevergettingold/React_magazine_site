import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";
import user from "../redux/modules/user";
import InfinityScroll from "../shared/InfinityScroll";
import { Button, Grid } from "../elements";
import Permit from "../shared/Permit";

const PostList = (props) => {
  const dispatch = useDispatch();
  const { history } = props;

  const post_list = useSelector((state) => state.post.list);
  const user_info = useSelector((state) => state.user.user);
  const is_loading = useSelector((state) => state.post.is_loading);
  const paging = useSelector((state) => state.post.paging);

  React.useEffect(() => {
    if (post_list.length < 2) {
      //디테일 페이지에서 뒤로 가기 했을 때, 하나는 무조건 있을 거니까 2보다 작을 경우로 설정
      dispatch(postActions.getPostFB());
    }
  }, []);

  return (
    <React.Fragment>
      <Grid padding="0px 150px" bg={"#fff"}>
        <InfinityScroll
          callNext={() => {
            dispatch(postActions.getPostFB(paging.next));
          }}
          is_next={paging.next ? true : false}
          loading={is_loading}
        >
          {post_list.map((p, idx) => {
            if (p.user_info.user_id === user_info?.uid) {
              //optional chaining

              return (
                <Grid
                  bg="#ffffff"
                  // margin="0px 0px 0px 0px"
                  key={idx}
                  // 수정 버튼을 누를 시에도 디테일 페이지로 넘어가서, Post.js에서 이미지와 제목만 history 적용
                  // _onClick={() => {
                  //   history.push(`/post/${p.id}`);
                  // }}
                >
                  <Post {...p} is_me />
                </Grid>
              );
            } else {
              return (
                <Grid
                  bg="#ffffff"
                  key={idx}
                  // _onClick={() => {
                  //   history.push(`/post/${p.id}`);
                  // }}
                >
                  <Post {...p} />
                </Grid>
              );
            }
          })}
        </InfinityScroll>
      </Grid>
      <Permit>
        <Button
          is_float
          text="+"
          _onClick={() => {
            history.push("/write");
          }}
        />
      </Permit>
    </React.Fragment>
  );
};

export default React.memo(PostList);
