import React from "react";
import { useDispatch } from "react-redux";

import { history } from "../redux/configureStore";
import { Button, Grid, Image, Text } from "../elements";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Permit from "../shared/Permit";
import Like from "./Like";
import { actionCreators as postActions } from "../redux/modules/post";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import EditIcon from "@material-ui/icons/Edit";

const Post = (props) => {
  const dispatch = useDispatch();
  //infinity scroll로 인해 원래 나타나 있던 카드들의 re-rendering 되는 현상을 방지하기 위해 memo 사용
  console.log("Post component rendered!");
  const deletePost = () => {
    dispatch(postActions.deletePostFB(props.id));
  };

  // ///우측 배치 ///
  if (props.location === "right") {
    return (
      <React.Fragment>
        <Grid margin="1px 0px">
          {/* 카드 윗단*/}
          <Grid is_flex padding="10px">
            <Grid is_flex width="auto">
              <Image shape="circle" src={props.src} />
              <Text width="50%" bold>
                {props.user_info.user_name}
              </Text>
            </Grid>

            <Grid is_flex width="auto">
              <Text>{props.insert_dt}</Text>

              {props.is_me && (
                <EditIcon
                  style={{ margin: "5px" }}
                  onClick={() => history.push(`/write/${props.id}`)}
                />
              )}
              {props.is_me && (
                <HighlightOffIcon
                  style={{ margin: "5px" }}
                  onClick={deletePost}
                />
              )}
            </Grid>
          </Grid>

          <Grid
            display="flex"
            _onClick={() => {
              history.push(`/post/${props.id}`);
            }}
          >
            {/* 카드 제목*/}
            <Text center>{props.contents}</Text>

            {/* 카드 이미지*/}
            <Image
              object_fit="contain"
              shape="rectangle"
              src={props.image_url}
            />
          </Grid>

          {/* 카드 댓글 갯수*/}
          <Grid is_flex padding="6px">
            <Like props={props} />
            <Text margin="0px 0px 0px 5px" bold>
              댓글 {props.comment_cnt}개
            </Text>
          </Grid>
        </Grid>
      </React.Fragment>
    );

    // /// 좌측 배치 ///
  } else if (props.location === "left") {
    return (
      <React.Fragment>
        <Grid margin="1px 0px">
          {/* 카드 윗단*/}
          <Grid is_flex padding="10px">
            <Grid is_flex width="auto">
              <Image shape="circle" src={props.src} />
              <Text width="50%" bold>
                {props.user_info.user_name}
              </Text>
            </Grid>

            <Grid is_flex width="auto">
              <Text>{props.insert_dt}</Text>
              {props.is_me && (
                <EditIcon
                  style={{ margin: "3px" }}
                  onClick={() => history.push(`/write/${props.id}`)}
                />
              )}
              {props.is_me && <HighlightOffIcon onClick={deletePost} />}
            </Grid>
          </Grid>

          <Grid
            display="flex"
            _onClick={() => {
              history.push(`/post/${props.id}`);
            }}
          >
            {/* 카드 이미지*/}
            <Image
              shape="rectangle"
              src={props.image_url}
              _onClick={() => {
                history.push(`/post/${props.id}`);
              }}
            />

            {/* 카드 제목*/}
            <Text center>{props.contents}</Text>
          </Grid>

          {/* 카드 댓글 갯수*/}
          <Grid is_flex padding="6px">
            <Like props={props} />
            <Text margin="0px 0px 0px 5px" bold>
              댓글 {props.comment_cnt}개
            </Text>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
  // /// 하단 배치 ///
  return (
    <React.Fragment>
      <Grid margin="1px 0px">
        {/* 카드 윗단*/}
        <Grid is_flex padding="10px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />
            <Text width="50%" bold>
              {props.user_info.user_name}
            </Text>
          </Grid>

          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {props.is_me && (
              <EditIcon
                style={{ margin: "3px" }}
                onClick={() => history.push(`/write/${props.id}`)}
              />
            )}
            {props.is_me && <HighlightOffIcon onClick={deletePost} />}
          </Grid>
        </Grid>

        {/* 카드 제목*/}
        <Grid
          display="flex"
          _onClick={() => {
            history.push(`/post/${props.id}`);
          }}
        >
          <Text margin="0 0 10px 10px">{props.contents}</Text>
        </Grid>

        {/* 카드 이미지*/}
        <Grid>
          <Image
            shape="rectangle"
            src={props.image_url}
            _onClick={() => {
              history.push(`/post/${props.id}`);
            }}
          />
        </Grid>

        {/* 카드 댓글 갯수*/}
        <Grid is_flex padding="6px">
          <Like props={props} />
          <Text margin="0px 0px 0px 5px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "ost",
    user_profile:
      "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d",
  },
  image_url:
    "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d",
  contents: "고양이네요!",
  comment_cnt: 10,
  insert_dt: "2022-02-04 11:51:00",
  is_me: false,
};

export default Post;
