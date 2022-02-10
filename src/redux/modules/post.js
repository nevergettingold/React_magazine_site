import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import "moment";
import moment from "moment";

import { firestore, realtime, storage } from "../../shared/firebase";
import { actionCreators as imageActions } from "./image";
import Like from "../../components/Like";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING";
const LIKE_POST = "LIKE_POST";
const DISLIKE_POST = "DISLIKE_POST";
const DELETE_POST = "DELETE_POST";

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
}));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const likePost = createAction(LIKE_POST, (post_id, post) => ({
  post_id,
  post,
}));

const dislikePost = createAction(DISLIKE_POST, (post_id, post) => ({
  post_id,
  post,
}));

const deletePost = createAction(DELETE_POST, (post_id) => ({
  post_id,
}));

const initialState = {
  list: [],
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

// 게시글 Sample
const initialPost = {
  // id: 0,
  // user_info: {
  //   user_name: "mean0",
  //   user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  // },
  image_url:
    "https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554__340.jpg",
  contents: "고양이네요!",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};

//middlewares

//DELETE POST FB
const deletePostFB = (post_id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .delete()
      .then(() => {
        dispatch(deletePost(post_id));
        history.push("/");
        alert("이미지가 삭제되었습니다!");
        window.location.reload();
      })
      .catch((err) => {
        alert("포스트가 삭제되지 않았습니다!", err);
      });
  };
};

//EDIT POST FB
const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      alert("게시물 정보가 없어요!");
      return;
    }
    const _image = getState().image.preview;

    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];
    console.log(_post);

    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      //이미지를 수정하지 않았을 경우
      postDB
        .doc(post_id) //firestore에서 doc 찾고
        .update(post) //doc의 post data 수정하고
        .then((doc) => {
          dispatch(editPost(post_id, { ...post })); //다시 넘겨준다
          history.replace("/");
        });
      return;
    } else {
      //이미지도 수정했을 경우
      const user_id = getState().user.user.uid;
      const _uplaod = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _uplaod.then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            console.log(url);
            postDB
              .doc(post_id) //firestore에서 doc 찾고
              .update({ ...post, image_url: url }) //doc의 post data 수정하고
              .then((doc) => {
                dispatch(editPost(post_id, { ...post, image_url: url })); //다시 넘겨준다
                history.replace("/");
              });
            return url;
          })
          .then((url) => {})
          .catch((err) => {
            window.alert("이미지 업로드에 문제가 있어요! :(");
            console.log("이미지 업로드에 문제가 생겼어요!", err);
          });
      });
    }
  };
};

//ADD POST FB
const addPostFB = (contents = "", location, like, is_like) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");

    const _user = getState().user.user;
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile,
    };
    const _post = {
      ...initialPost,
      contents: contents,
      location,
      insert_dt: moment().format("YYYY-MM-DD HH:mm:ss"),
      like,
      is_like,
    };

    const _image = getState().image.preview;
    if (!_image) {
      alert("이미지를 업로드 해주세요! :)");
      return;
    } else if (_image && !location) {
      alert("이미지 위치를 선택 해주세요! :)");
      return;
    }

    const _uplaod = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _uplaod.then((snapshot) => {
      snapshot.ref
        .getDownloadURL()
        .then((url) => {
          console.log(url);

          return url;
        })
        .then((url) => {
          postDB
            .add({ ...user_info, ..._post, image_url: url })
            .then((doc) => {
              let post = { user_info, ..._post, id: doc.id, image_url: url };
              dispatch(addPost(post));
              history.replace("/");

              dispatch(imageActions.setPreview(null)); //img upload 하면 preview를 다시 Null로 바꿔준다
            })
            .catch((err) => {
              window.alert("포스트 작성에 문제가 있어요! :(");
              console.log("post 작성에 실패했어요! :(", err);
            });
        })
        .catch((err) => {
          window.alert("이미지 업로드에 문제가 있어요! :(");
          console.log("이미지 업로드에 문제가 생겼어요!", err);
        });
    });
  };
};

//GET POST FB
const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    let _paging = getState().post.paging;

    if (_paging.start && !_paging.next) {
      return;
      //next data가 없으면 바로 return
    }

    dispatch(loading(true));
    const postDB = firestore.collection("post");

    let query = postDB.orderBy("insert_dt", "desc");
    //desc를 써서 시간 내림차순 (최신 -> 예전), limit로 가져올 Data 수 제한

    if (start) {
      query = query.startAt(start);
    }

    query
      .limit(size + 1) //size + 1개를 다 가져왔으면, size개짜리 (redux에서 3개로 설정) 리스트에서 다음 페이지가 있다는 것을 의미
      .get()
      .then((docs) => {
        let post_list = [];

        let paging = {
          start: docs.docs[0],
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          size: size,
        };

        docs.forEach((doc) => {
          // DB와 Post component의 데이터 모양 맞추기
          let _post = doc.data();

          let post = Object.keys(_post).reduce(
            //reduce를 쓰기 위해 Object.keys를 써서 key값만 빼고 array형태로 만들어 줌
            (acc, cur) => {
              if (cur.indexOf("user_") !== -1) {
                //!==-1 은 포함이 된다는 뜻
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          );
          post_list.push(post);
        });

        if (paging.next !== null) {
          post_list.pop();
        }

        dispatch(setPost(post_list, paging));
        console.log("GET POST FB");
      });
  };
};

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(id)
      .get()
      .then((doc) => {
        console.log(doc.data());

        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          //reduce를 쓰기 위해 Object.keys를 써서 key값만 빼고 array형태로 만들어 줌
          (acc, cur) => {
            if (cur.indexOf("user_") !== -1) {
              //!==-1 은 포함이 된다는 뜻
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        dispatch(setPost([post]));
      });
  };
};

const likePostFB = (post_id, user_id, likeList, post = {}) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .update({ ...post, like: post.like + 1 })
      .then(() => {
        dispatch(likePost(post_id, { like: post.like + 1 }));
      });

    const _like_post = realtime.ref(`likes/${user_id}`).push();
    _like_post.set({ post_id });
  };
};

const dislikePostFB = (post_id, user_id, likeList, post = {}) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post");
    postDB
      .doc(post_id)
      .update({ ...post, like: post.like - 1 })
      .then((doc) => {
        dispatch(dislikePost(post_id, { like: post.like - 1 }));
      });

    const likesDB = realtime.ref(`likes/${user_id}/`);
    likesDB.once("value", (snapshot) => {
      let list = snapshot.val();
      let postIds = Object.keys(list).map((s) => {
        return list[s];
      });
      let keys = Object.keys(list).map((s) => {
        return s;
      });
      let idx = postIds.map((e) => e.post_id).indexOf(post_id);
      let removeKey = keys[idx];
      realtime.ref(`likes/${user_id}/${removeKey}`).remove();
    });
  };
};

// reducer
export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(...action.payload.post_list);

        //중복 post 처리
        draft.list = draft.list.reduce((acc, cur) => {
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            return [...acc, cur];
          } else {
            acc[acc.findIndex((a) => a.id === cur.id)] = cur;
            return acc;
          }
        }, []);

        if (action.payload.paging) {
          draft.paging = action.payload.paging;
        }
        draft.is_loading = false;
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post); //push와 반대로 맨 앞에 추가하기 위해 unshift 사용
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
        // 게시물만 혹은 이미지만 수정했을 경우를 대비해서 ... 사용
      }),

    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),

    [LIKE_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),

    [DISLIKE_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id);
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),

    [DELETE_POST]: (state, action) => produce(state, (draft) => {}),
  },
  initialState
);

// action creator export
const actionCreators = {
  setPost,
  addPost,
  editPost,
  getPostFB,
  addPostFB,
  editPostFB,
  getOnePostFB,
  likePostFB,
  dislikePostFB,
  deletePostFB,
};

export { actionCreators };
