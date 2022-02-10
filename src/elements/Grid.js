import React from "react";
import styled from "styled-components";

const Grid = (props) => {
  const {
    flex_end,
    is_flex,
    width,
    padding,
    margin,
    bg,
    children,
    center,
    _onClick,
    display,
    height,
  } = props;
  const styles = {
    flex_end,
    is_flex: is_flex,
    width: width,
    margin: margin,
    padding: padding,
    bg: bg,
    center: center,
    display,
    height,
  };
  return (
    <React.Fragment>
      <GridBox {...styles} onClick={_onClick}>
        {children}
      </GridBox>
    </React.Fragment>
  );
};

Grid.defaultProps = {
  flex_end: false,
  children: null,
  is_flex: false,
  width: "100%",
  height: "100%",
  padding: false,
  margin: false,
  bg: false,
  center: false,
  _onClick: () => {},
  display: "block",
};

const GridBox = styled.div`
  display: ${(props) => props.display};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-sizing: border-box; //padding, 테두리 굵기, 등 을 width에 포함하도록 설정
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.bg ? `background-color: ${props.bg};` : "")}
  ${(props) =>
    props.is_flex
      ? `display: flex; align-items: center; justify-content: space-between`
      : ""}
${(props) =>
    props.flex_end
      ? `display: flex; align-items: center; justify-content: flex-end`
      : ""}
  ${(props) => (props.center ? `text-align: center` : "")}
`;

export default Grid;
