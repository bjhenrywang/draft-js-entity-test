import React from "react";

const Entity = ({ children, contentState, entityKey }) => {
  const entity = (contentState.getEntity(entityKey) || {}).data;

  if (!entity) return children;

  return (
    <span
      contentEditable={false}
      readOnly
      style={{
        backgroundColor: entity.color,
        padding: "3px 0",
        borderRadius: "3px"
      }}
    >
      {children}
    </span>
  );
};

export default Entity;
