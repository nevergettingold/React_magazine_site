import React from "react";
import styled from "styled-components";

const Image = (props) => {
  const { shape, src, size, half, display, _onClick } = props;

  const styles = {
    src: src,
    size: size,
    display,
    half,
  };

  if (shape === "circle") {
    return <ImageCircle {...styles} onClick={_onClick}></ImageCircle>;
  }

  if (shape === "rectangle") {
    return (
      <AspectOutter>
        <AspectInner {...styles} onClick={_onClick}></AspectInner>
      </AspectOutter>
    );
  }

  return (
    <React.Fragment>
      <ImageDefault {...styles} onClick={_onClick}></ImageDefault>
    </React.Fragment>
  );
};

Image.defaultProps = {
  shape: "circle",
  src: "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d",
  size: 36,
  half: false,
  display: "block",
  _onClick: () => {},
};

const ImageDefault = styled.div`
  display: ${(props) => props.display};
  ${(props) => (props.half ? `flex-basis: ${props.half};` : "")}
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover; //img가 들어가는 shape에 맞춘다
`;

const AspectOutter = styled.div`
  width: 100%;
  min-width: 250px;
`;
const AspectInner = styled.div`
  position: relative;
  padding-top: 100%; //width의 3/4를 맞춘다
  overflow: hidden;
  background-image: url("${(props) => props.src}");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const ImageCircle = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover; //img가 들어가는 shape에 맞춘다
  margin: 4px;
`;

export default Image;
