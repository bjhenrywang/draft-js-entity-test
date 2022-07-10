import React, { useState } from "react";
import { Editor } from "draft-js";
import "draft-js/dist/Draft.css";

import { createInitialState } from "./utils";

const initialText = "test test test";

const initialEntities = [
  {
    start: 5,
    end: 9,
    name: "test_entity_1",
    color: "lightblue"
  },
  {
    start: 10,
    end: 14,
    name: "test_entity_2",
    color: "lightgreen"
  }
];

const style = {
  border: "1px solid black",
  width: "fit-content",
  padding: "10px 5px",
  borderRadius: "5px"
};

const Input = () => {
  const [editorState, setEditorState] = useState(() =>
    createInitialState(initialText, initialEntities)
  );

  return (
    <div style={style}>
      <Editor editorState={editorState} onChange={setEditorState} />
    </div>
  );
};

export default Input;
