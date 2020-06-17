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

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      agreementHtml: null,
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({ editorState });

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.insertPlaceholder = this._insertPlaceholder.bind(this);
    this.getValue = this._getValue.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.editorState !== prevState.editorState) {
      console.log("eee");
      this.setState({
        agreementHtml: stateToHTML(this.state.editorState.getCurrentContent()),
      });
    }
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,
        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  _insertPlaceholder(placeholderText) {
    const { editorState } = this.state;

    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(), // get ContentState from EditorState
      editorState.getSelection(),
      placeholderText
    );

    this.setState({
      editorState: EditorState.createWithContent(newContentState), // get EditorState with ContentState
    });
  }

  _getValue() {
    this.setState({
      agreementHtml: stateToHTML(this.state.editorState.getCurrentContent()),
    });
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
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

    return (
      <div>
        <div className="RichEditor-root">
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
          <InlineStyleControls
            editorState={editorState}
            onToggle={this.toggleInlineStyle}
          />
          <button onClick={this.insertPlaceholder.bind(this, "{{first_name}}")}>
            Add First Name
          </button>
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Tell a story..."
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
        <button onClick={this.getValue.bind(this)}> Get Content</button>
        <div
          dangerouslySetInnerHTML={{ __html: this.state.agreementHtml }}
        ></div>
      </div>
    );
  }
}

export default MyEditor;
