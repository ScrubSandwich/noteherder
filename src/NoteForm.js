import React, { Component } from 'react'
import RichTextEditor from 'react-rte'

import './NoteForm.css'

class NoteForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      note: this.blankNote(),
      editorValue: RichTextEditor.createEmptyValue(),
    }
  }

  componentWillReceiveProps = (nextProps) => {
    const idFromUrl = nextProps.match.params.id
    const note = nextProps.notes[idFromUrl] || this.blankNote()

    const noteNotFound = idFromUrl && !note.id
    if (noteNotFound && nextProps.firebaseNotesSynced) {
      this.props.history.push('/notes')
    }

    let editorValue = this.state.editorValue
    if (editorValue.toString('html') !== note.body) {
      editorValue = RichTextEditor.createValueFromString(note.body, 'html')
    }

    this.setState({ note, editorValue })
  }

  blankNote = () => {
    return {
      id: null,
      title: '',
      body: '',
    }
  }

  handleChanges = (ev) => {
    const note = {...this.state.note}
    note[ev.target.name] = ev.target.value
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var today = mm+'/'+dd+'/'+yyyy;
    note.time = today

    this.setState(
      { note },
      () => this.props.saveNote(note)
    )
  }

  handleEditorChanges = (editorValue) => {
    const note = {...this.state.note}
    note.body = editorValue.toString('html')
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!

    var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd;
    } 
    if(mm<10){
        mm='0'+mm;
    } 
    var today = mm+'/'+dd+'/'+yyyy;
    note.time = today

    this.setState(
      { note, editorValue },
      () => this.props.saveNote(note)
    )
  }

  handleRemove = () => {
    this.props.removeNote(this.state.note)
  }

  render() {
    return (
      <div className="NoteForm">
        <div className="form-actions">
          <button
            type="button"
            onClick={this.handleRemove}
          >
            <i className="fa fa-trash-o"></i>
          </button>
        </div>
        <form>
          <p>
            <input
              type="text"
              name="title"
              placeholder="Title your note"
              value={this.state.note.title}
              onChange={this.handleChanges}
            />
          </p>
          
          <RichTextEditor
            name="body"
            value={this.state.editorValue}
            onChange={this.handleEditorChanges}
          ></RichTextEditor>
        </form>
      </div>
    )
  }
}

export default NoteForm
