import React from "react";
import styled from "styled-components";

const Text = (props) => {
  const {
    bold,
    color,
    size,
    children,
    margin,
    width,
    display,
    center,
    _onClick,
  } = props;

  const styles = {
    bold: bold,
    color: color,
    size: size,
    margin,
    width,
    display,
    center,
  };
  return (
    <P {...styles} onClick={_onClick}>
      {children}
    </P>
  );
};

Text.defaultProps = {
  children: null,
  bold: false,
  color: "#222831",
  size: "14px",
  margin: false,
  width: "100%",
  display: "block",
  center: false,
  _onClick: () => {},
};

const P = styled.p`
  display: ${(props) => props.display};
  width: ${(props) => props.width};
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")};
  ${(props) => (props.center ? `margin: auto; text-align: center; ;` : "")}
`;

export default Text;
