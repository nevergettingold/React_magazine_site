import React from "react";
import styled from "styled-components";

const Button = (props) => {
  const {
    text,
    _onClick,
    is_float,
    children,
    margin,
    width,
    padding,
    cursor,
    is_disable,
    height,
  } = props;
  if (is_float) {
    return (
      <React.Fragment>
        <FloatButton onClick={_onClick}>{text ? text : children}</FloatButton>
      </React.Fragment>
    );
  }

  const styles = {
    margin: margin,
    width: width,
    padding: padding,
    cursor,
    height,
  };

  return (
    <React.Fragment>
      {is_disable ? (
        <ElButton {...styles} onClick={_onClick}>
          {text ? text : children}
        </ElButton>
      ) : (
        <ElDisabledButton {...styles} onClick={_onClick} disabled>
          {text ? text : children}
        </ElDisabledButton>
      )}
    </React.Fragment>
  );
};

Button.defaultProps = {
  text: false,
  children: null,
  _onClick: () => {},
  is_float: false,
  margin: false,
  width: "100%",
  is_disable: true,
  height: "100%",
};

const ElButton = styled.button`
  width: ${(props) => props.width};
  background-color: #212121;
  color: #fff;
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  height: 40px;

  ${(props) => (props.margin ? `margin: ${props.margin};` : "")};
  cursor: pointer;
`;

const ElDisabledButton = styled.button`
  width: ${(props) => props.width};
  color: #fff;
  background-color: #dddddd;
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  border: none;
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")};
  cursor: pointer;
  height: 40px;
`;

const FloatButton = styled.button`
  width: 50px;
  height: 50px;
  background-color: #212121;
  color: #fff;
  box-sizing: border-box;
  font-size: 36px;
  font-weight: 800;
  position: fixed;
  bottom: 16px;
  right: 16px;
  text-align: center;
  vertical-align: middle;
  border: none;
  border-radius: 50px;
  cursor: pointer;
`;

export default Button;
