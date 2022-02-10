import React from "react";
import { useSelector, useDispatch } from "react-redux";
import NotiBadge from "./NotiBadge";
import HomeIcon from "@material-ui/icons/Home";

import { history } from "../redux/configureStore";
import { actionCreators as userActions } from "../redux/modules/user";
import { Grid, Text, Button } from "../elements";
import { getCookie, deleteCookie } from "../shared/Cookie";
import { apiKey } from "../shared/firebase";
import Permit from "../shared/Permit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Header = (props) => {
  const dispatch = useDispatch();
  const is_login = useSelector((state) => state.user.is_login);
  const _session_key = `firebase:authUser:${apiKey}:[DEFAULT]`;
  const is_session = sessionStorage.getItem(_session_key) ? true : false;

  console.log(is_session);
  // <Permit></Permit>;
  if (is_login && is_session) {
    return (
      <React.Fragment>
        <Grid is_flex padding="10px 150px">
          <Grid>
            <HomeIcon
              onClick={() => {
                history.push("/");
              }}
              style={{ fontSize: "35px", cursor: "pointer" }}
            ></HomeIcon>
          </Grid>
          <Grid flex_end>
            <NotiBadge
              _onClick={() => {
                history.push("/noti");
              }}
            />
            <ExitToAppIcon
              style={{ marginLeft: "10px", cursor: "pointer" }}
              onClick={() => {
                dispatch(userActions.logoutFB());
              }}
            />
          </Grid>
        </Grid>
        <hr
          style={{
            width: "calc((100% - 300px)",
            alignItems: "center",
            margin: "0.5px auto",
            borderTop: "0.5px solid #e2e2e2",
          }}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Grid is_flex padding="10px 150px">
        <Grid>
          <HomeIcon
            onClick={() => {
              history.push("/");
            }}
            style={{ fontSize: "35px", cursor: "pointer" }}
          />
        </Grid>
        <Grid flex_end>
          <Button
            width="100px"
            margin="6px 12px"
            text="로그인"
            _onClick={() => {
              history.push("/login");
            }}
          />
          <Button
            width="100px"
            text="회원가입"
            _onClick={() => {
              history.push("/signup");
            }}
          />
        </Grid>
      </Grid>
      <hr
        style={{
          width: "calc((100% - 300px)",
          alignItems: "center",
          margin: "0.5px auto",
          borderTop: "0.5px solid #e2e2e2",
        }}
      />
    </React.Fragment>
  );
};

Header.defaultProps = {};

export default Header;
