import React from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./Editor.css";
import BlockStyleControls from "./BlockStyleControls";
import InlineStyleControls from "./InlineStyleControls";
import { styleMap } from "./Constants";
import { stateToHTML } from "draft-js-export-html";
import { useRef } from "react";
import { useReducer } from "react";
import StringReplace from "../OtherComponents/StringReplace";
import AgreementList from "../OtherComponents/AgreementList";

const PureEditor = (props) => {
  const editorRef = useRef(null);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      editorState: EditorState.createEmpty(),
      enableHtml: false,
      agreementFields: null,
      editorPlaceHoldersCounter: 0,
      editorPlaceHolders: [],
      editorFieldNames: [],
      formValues: false,
    }
  );

  let className = "RichEditor-editor";
  var contentState = state.editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
    }
  }

  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return null;
    }
  };

  const _handleChildSubmit = (value) => {
    console.log(value);
  };

  const _insertPlaceholder = () => {
    const {
      editorState,
      editorPlaceHoldersCounter,
      editorPlaceHolders,
      editorFieldNames,
    } = state;

    let field = null;
    let field_name = `field_${editorPlaceHoldersCounter}`;
    field = `[[${field_name}]]`;
    console.log(field);

    setState({
      editorPlaceHoldersCounter: editorPlaceHoldersCounter + 1,
      editorPlaceHolders: [...editorPlaceHolders, field],
      editorFieldNames: [...editorFieldNames, { [field_name]: field }],
    });

    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(), // get ContentState from EditorState
      editorState.getSelection(),
      field
    );

    setState({
      editorState: EditorState.createWithContent(newContentState), // get EditorState with ContentState
    });
  };

  const _handleChildKeyDownEvent = (index, value, field_name) => {
    if (state.agreementFields) {
      if (!state.formValues) {
        setState({ formValues: true });
      }

      if (state.editorFieldNames.length > 0) {
        let editorNames = [...state.editorFieldNames];
        let editorName = editorNames[index];
        editorName = value;
        editorNames[index][field_name] = editorName;
        setState({
          editorFieldNames: editorNames,
        });
      }

      // console.log(index, value);
    }
  };

  const _composeDraft = () => {
    setState({
      enableHtml: true,
      agreementFields: state.editorPlaceHolders,
    });
  };

  const _focus = () => editorRef.current.focus();
  const _onChange = (editorState) => setState({ editorState });

  const _toggleBlockType = (blockType) => {
    _onChange(RichUtils.toggleBlockType(state.editorState, blockType));
  };

  const _toggleInlineStyle = (inlineStyle) => {
    _onChange(RichUtils.toggleInlineStyle(state.editorState, inlineStyle));
  };

  const _handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      _onChange(newState);
      return true;
    }
    return false;
  };

  const _mapKeyToEditorCommand = (e) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        state.editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== state.editorState) {
        _onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  };

  return (
    <div>
      <div className="RichEditor-root">
        <BlockStyleControls
          editorState={state.editorState}
          onToggle={_toggleBlockType}
        />
        <InlineStyleControls
          editorState={state.editorState}
          onToggle={_toggleInlineStyle}
        />
        <button onClick={_insertPlaceholder}>Add variable</button>
        <div className={className} onClick={_focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={state.editorState}
            handleKeyCommand={_handleKeyCommand}
            keyBindingFn={_mapKeyToEditorCommand}
            onChange={_onChange}
            placeholder="Create your own agreement"
            ref={editorRef}
            spellCheck={true}
          />
        </div>
      </div>

      <button onClick={_composeDraft.bind(this)}> Get Content</button>

      <StringReplace
        text={stateToHTML(state.editorState.getCurrentContent())}
        values={state.editorFieldNames}
      />

      <br />
      {state.agreementFields && (
        <AgreementList
          agreementFields={state.agreementFields}
          onSubmit={_handleChildSubmit}
          onChildKeyDown={_handleChildKeyDownEvent.bind(this)}
        />
      )}
    </div>
  );
};

export default PureEditor;
