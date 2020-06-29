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
import AgreementList from "../OtherComponents/AgreementList";
import FormatMentionText, {
  formatMentionText,
} from "../OtherComponents/FormatMentionText";

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      agreementHtml: null,
      agreementFields: null,
      editorPlaceHoldersCounter: 0,
      editorPlaceHolders: [],
      editorFieldNames: [],
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({ editorState });

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
    this.insertPlaceholder = this._insertPlaceholder.bind(this);
    this.getValue = this._getValue.bind(this);
    this.handleChildKeyDownEvent = this._handleChildKeyDownEvent(this);
  }

  // componentDidUpdate(_, prevState) {
  //   if (this.state.editorState !== prevState.editorState) {
  //     this.setState({
  //       agreementHtml: stateToHTML(this.state.editorState.getCurrentContent()),
  //     });
  //   }
  // }

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

  _insertPlaceholder() {
    const {
      editorState,
      editorPlaceHoldersCounter,
      editorPlaceHolders,
      editorFieldNames,
    } = this.state;
    let field = null;
    let field_name = `field_${editorPlaceHoldersCounter}`;
    field = `[[${field_name}]]`;
    this.setState({
      editorPlaceHoldersCounter: editorPlaceHoldersCounter + 1,
      editorPlaceHolders: [...editorPlaceHolders, field],
      editorFieldNames: [...editorFieldNames, field_name],
    });

    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(), // get ContentState from EditorState
      editorState.getSelection(),
      field
    );

    this.setState({
      editorState: EditorState.createWithContent(newContentState), // get EditorState with ContentState
    });
  }

  _getValue() {
    // console.log(stateToHTML(this.state.editorState.getCurrentContent()));
    let resultant = formatMentionText(
      stateToHTML(this.state.editorState.getCurrentContent()),
      this.state.editorFieldNames
    );

    //resultant = stateToHTML(resultant);
    console.log(resultant);

    this.setState({
      agreementHtml: resultant,
      agreementFields: this.state.editorPlaceHolders,
    });
  }

  _handleChildKeyDownEvent(index, value) {
    const { editorFieldNames } = this.state;

    if (this.state.editorFieldNames.length > 0) {
      let editorNames = [...editorFieldNames];
      let editorName = editorNames[0];

      editorName = "valuee";
      editorNames[0] = editorName;
      this.setState({
        editorFieldNames: editorNames,
      });
      console.log(editorName);
      console.log(index, value);
    }

    //console.log(this.state);
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

    const handleChildSubmit = (value) => {
      console.log(value);
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
          <button onClick={this.insertPlaceholder.bind(this)}>
            Add variable
          </button>
          <div className={className} onClick={this.focus}>
            <Editor
              blockStyleFn={getBlockStyle}
              customStyleMap={styleMap}
              editorState={editorState}
              handleKeyCommand={this.handleKeyCommand}
              keyBindingFn={this.mapKeyToEditorCommand}
              onChange={this.onChange}
              placeholder="Create your own agreement"
              ref="editor"
              spellCheck={true}
            />
          </div>
        </div>
        <button onClick={this.getValue.bind(this)}> Get Content</button>

        {/* {this.state.agreementHtml && (
          <div
            dangerouslySetInnerHTML={{
              __html: this.state.agreementHtml.props.children,
            }}
          ></div>
        )} */}

        {this.state.agreementHtml && (
          <FormatMentionText
            text={stateToHTML(this.state.editorState.getCurrentContent())}
            values={this.state.editorFieldNames}
          />
        )}

        <br />
        {this.state.agreementFields && (
          <AgreementList
            agreementFields={this.state.agreementFields}
            onSubmit={handleChildSubmit}
            onChildKeyDown={this._handleChildKeyDownEvent.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default MyEditor;
