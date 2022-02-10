import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { Grid, Text, Button, Image, Input } from "../elements";
import Upload from "../shared/Upload";
import { actionCreators as postActions } from "../redux/modules/post";
import { actionCreators as imageActions } from "../redux/modules/image";

const PostWrite = (props) => {
  const dispatch = useDispatch();
  const { history } = props;
  const [is_disabled, setIsDisable] = React.useState(false);

  const is_login = useSelector((state) => state.user.is_login);
  const preview = useSelector((state) => state.image.preview);

  const post_list = useSelector((state) => state.post.list);
  const post_id = props.match.params.id;
  const is_edit = post_id ? true : false;
  let _post = is_edit ? post_list.find((p) => p.id === post_id) : null; //수정 모드가 아니면 작성 모드

  const [contents, setContents] = React.useState(_post ? _post.contents : ""); //수정 시 기존 contents 불러오기

  const [location, setLocation] = React.useState("");
  const like = 0;
  const is_like = false;

  const editPost = () => {
    dispatch(
      postActions.editPostFB(post_id, {
        contents: contents,
        location: location,
        like,
        is_like,
      })
    );
  };

  const addPost = () => {
    if (!contents) {
      alert("게시글을 작성해주세요! :)");
      return;
    }
    dispatch(postActions.addPostFB(contents, location, like, is_like));
  };

  const changeContents = (e) => {
    setContents(e.target.value);
  };

  const locationChange = (e) => {
    setLocation(e.target.value);
  };

  React.useEffect(() => {
    if (is_edit && !_post) {
      alert("포스트 정보가 없어요!");
      history.goBack();
      return;
    }

    if (!contents || !preview) {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }

    if (is_edit) {
      //수정 모드일 경우
      dispatch(imageActions.setPreview(_post.image_url)); //기존 이미지 불러오기
    }
  }, [contents, preview]);

  if (!is_login) {
    return (
      <Grid margin="100px 0px" padding="16px" center>
        <Text size="32px" bold>
          앗! 잠깐!
        </Text>
        <Text size="16px">로그인 후에만 글을 쓰실 수 있어요!</Text>
        <Button
          _onClick={() => {
            history.replace("/login");
          }}
        >
          로그인 하러 가기
        </Button>
      </Grid>
    );
  }

  return (
    <React.Fragment>
      <Grid padding="0px 150px">
        {/*/// 타이틀  ///*/}
        <Grid padding="16px">
          <Text margin="0px" size="36px" bold>
            {is_edit ? "게시글 수정" : "게시글 작성"}
          </Text>
          <Upload />
        </Grid>

        {/*/// 미리보기  ///*/}
        <Grid padding="16px">
          <Text margin="0px" size="24px" bold>
            미리보기
          </Text>

          {/* /// 우측 배치//// */}
          <Grid margin="10px 0px 0px 0px">
            {/* label로 달아줄 경우, radio 보다 앞서서 문장이 나오기 때문에 <Text>로 배치 */}
            <Input
              inline
              name="location"
              type="radio"
              value="right"
              _onChange={locationChange}
            />
            <Text display="inline">게시글 우측에 이미지 배치</Text>

            <Grid display="flex" padding="10px 0">
              <Text center>{contents}</Text>
              <Image
                shape="rectangle"
                src={
                  preview
                    ? preview
                    : "http://via.placeholder.com/400/ffffff/ffffff" //size/bgcolor/fontcolor
                }
              />
            </Grid>
          </Grid>

          {/* /// 좌측 배치//// */}
          <Grid margin="10px 0px 0px 0px">
            <Input
              inline
              name="location"
              type="radio"
              value="left"
              _onChange={locationChange}
            />
            <Text display="inline"> 게시글 좌측에 이미지 배치</Text>
            <Grid display="flex" padding="10px 0">
              <Image
                shape="rectangle"
                src={
                  preview
                    ? preview
                    : "http://via.placeholder.com/400/ffffff/ffffff" //size/bgcolor/fontcolor
                }
              />
              <Text center>{contents}</Text>
            </Grid>
          </Grid>

          {/* /// 하단 배치//// */}
          <Grid margin="10px 0px 0px 0px">
            <Input
              inline
              name="location"
              type="radio"
              value="bottom"
              _onChange={locationChange}
            />
            <Text display="inline"> 게시글 하단에 이미지 배치</Text>

            <Text>{contents}</Text>
            <Image
              shape="rectangle"
              src={
                preview
                  ? preview
                  : "http://via.placeholder.com/400/ffffff/ffffff" //size/bgcolor/fontcolor
              }
            />
          </Grid>
        </Grid>

        {/*/// 게시글 내용  ///*/}
        <Grid padding="16px">
          <Input
            multiLine
            value={contents}
            _onChange={changeContents}
            label="게시글 내용"
            placeholder="게시글 작성"
          />
        </Grid>

        {/*/// 버튼  ///*/}
        <Grid padding="16px">
          {is_edit ? (
            <Button _onClick={editPost} text="게시글 수정"></Button>
          ) : (
            <Button
              is_disable={is_disabled}
              _onClick={addPost}
              text="게시글 작성"
            ></Button>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default PostWrite;
