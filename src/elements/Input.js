import { findLast } from "lodash";
import React from "react";
import styled from "styled-components";

import { Text, Grid } from "./index";

const Input = (props) => {
  const {
    label,
    placeholder,
    _onChange,
    type,
    multiLine,
    value,
    is_submit,
    onSubmit,
    inline,
    name,
    width,
  } = props;

  if (multiLine) {
    return (
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        <ElTextarea
          rows={10}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={_onChange}
        />
      </Grid>
    );
  } else if (inline) {
    return (
      <React.Fragment>
        <Grid display="inline">
          {label && (
            <Text display="inline" margin="0px">
              {label}
            </Text>
          )}
          {is_submit ? (
            <ElInput
              name={name}
              type={type}
              placeholder={placeholder}
              onChange={_onChange}
              value={value}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSubmit(e);
                }
              }}
            />
          ) : (
            <ElInput
              name={name}
              type={type}
              value={value}
              placeholder={placeholder}
              onChange={_onChange}
            />
          )}
        </Grid>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <Grid>
        {label && <Text margin="0px">{label}</Text>}
        {is_submit ? (
          <ElInput
            type={type}
            width={width}
            placeholder={placeholder}
            onChange={_onChange}
            name={name}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSubmit(e);
              }
            }}
          />
        ) : (
          <ElInput
            width={width}
            name={name}
            type={type}
            placeholder={placeholder}
            onChange={_onChange}
          />
        )}
      </Grid>
    </React.Fragment>
  );
};

Input.defaultProps = {
  multiLine: false,
  label: false,
  placeholder: "텍스트를 입력해주세요",
  type: "text",
  value: "",
  is_submit: false, //댓글 작성 완료 후 댓글 입력값을 초기화해주기 위해 사용
  onSubmit: false, //댓글 작성 완료를 'enter' 키로 가능하게 해주기 위해 사용
  _onChange: () => {},
  width: "100%",
  inline: false,
  name: "",
};

const ElTextarea = styled.textarea`
  border: 1px solid #212121;
  width: 100%;
  padding: 12px 4px;
  box-sizing: border-box;
`;

const ElInput = styled.input`
  border: 1px solid #212121;
  width: ${(props) => props.width};
  padding: 12px 4px;
  box-sizing: border-box;
`;

export default Input;
