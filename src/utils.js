import {
  ContentState,
  CompositeDecorator,
  EditorState,
  Modifier,
  SelectionState
} from "draft-js";

import Entity from "./Entity";

const insertEntitiesInContentState = (
  originalContentState,
  selectionState,
  entities
) => {
  const anchorKey = selectionState.getAnchorKey();
  const focusKey = selectionState.getFocusKey();

  return entities.reduce((contentState, entity) => {
    const { start, name } = entity;
    const contentStateWithEntity = contentState.createEntity(
      "TEST_TYPE",
      "IMMUTABLE",
      entity
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const entitySelectionState = new SelectionState({
      anchorKey,
      focusKey,
      anchorOffset: start,
      focusOffset: start + name.length,
      hasFocus: true,
      isBackward: false
    });

    return Modifier.applyEntity(
      contentStateWithEntity,
      entitySelectionState,
      entityKey
    );
  }, originalContentState);
};

// For each entity, replace the text between start and and with the name.
// Update entities' start and end accordingly.
const replaceTextByNames = (initialText, initialEntities) =>
  initialEntities.reduce(
    ({ text, entities, lengthChange }, entity) => {
      const { start, end, name } = entity;

      const updatedText = `${text.slice(
        0,
        start + lengthChange
      )}${name}${text.slice(end + lengthChange)}`;
      const updatedLengthChange =
        lengthChange + (updatedText.length - text.length);

      const updatedEntities = [
        ...entities,
        {
          ...entity,
          start: start + lengthChange,
          end: end + updatedLengthChange
        }
      ];

      return {
        text: updatedText,
        entities: updatedEntities,
        lengthChange: updatedLengthChange
      };
    },
    {
      text: initialText,
      entities: [],
      lengthChange: 0
    }
  );

const findEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(character => {
    if (!character) return false;
    const key = character.getEntity();

    if (key != null) {
      const entity = contentState.getEntity(key);
      return entity.getType() === "TEST_TYPE";
    }
    return false;
  }, callback);
};

export const createInitialState = (initialText, initialEntities) => {
  const { text, entities } = replaceTextByNames(initialText, initialEntities);
  const contentStateWithText = ContentState.createFromText(text);
  const decorator = new CompositeDecorator([
    { strategy: findEntities, component: Entity }
  ]);

  const newEditorState = EditorState.createEmpty(decorator);
  const editorStateWithText = EditorState.push(
    newEditorState,
    contentStateWithText,
    "insert-characters"
  );
  const selectionState = editorStateWithText.getSelection();

  const contentStateWithInstances = insertEntitiesInContentState(
    contentStateWithText,
    selectionState,
    entities
  );

  const editorStateWithInstances = EditorState.push(
    editorStateWithText,
    contentStateWithInstances,
    "change-block-data"
  );

  return EditorState.moveSelectionToEnd(editorStateWithInstances);
};
