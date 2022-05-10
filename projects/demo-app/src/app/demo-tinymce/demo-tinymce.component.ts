import { Component, NgZone, Input, ViewChild } from '@angular/core';

import { MentionDirective } from 'angular-mentions';
import { COMMON_NAMES } from '../common-names';

/**
 * Angular 2 Mentions.
 * https://github.com/dmacfarlane/angular-mentions
 *
 * Example usage with TinyMCE.
 */
@Component({
  selector: 'app-demo-tinymce',
  template: `
    <div class="form-group" style="position:relative; margin-top:30px;">
      <span>Tiny MCE</span>
    </div>
    <div class="form-group" style="position:relative">
      <div [mention]="items"></div>
      <div>
        <textarea class="hidden" cols="60" rows="4" id="tmce">{{htmlContent}}</textarea>
      </div>
    </div>
    <editor [init]="CONFIG"></editor>
    
    <div class="form-group" style="position:relative; margin-top:30px;">
      <span>Angular editor by https://github.com/kolkov/angular-editor</span>
    </div>
    
    <div class="form-group" style="position:relative">
      <angular-editor [mention]="items" [config]="ngEditorConfig"> </angular-editor>
    </div>
    
    `
})
export class DemoTinymceComponent {
  @Input() htmlContent:string;
  @ViewChild(MentionDirective, { static: true }) mention: MentionDirective;
  public items:string[] = COMMON_NAMES;
  public ngEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '200px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Aral' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'subscript',
        'superscript',
        'justifyLeft',
        'justifyRight',
        'justifyFull',
        'outdent',
        'heading',
        'fontName',
      ],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode',
      ],
    ]
  }
  public CONFIG = {
    base_url: '/tinymce',
    suffix: '.min',
    height: 200,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount'
    ],
    toolbar:
      'undo redo | formatselect | bold italic backcolor | \
      alignleft aligncenter alignright alignjustify | \
      bullist numlist outdent indent | removeformat | help',
    setup: this.tinySetup.bind(this)
  };
  constructor(private _zone: NgZone) {}
  tinySetup(ed) {
    ed.on('init', (args) => {
      this.mention.setIframe(ed.iframeElement);
    });
    ed.on('keydown', (e) => {
      let frame = <any>window.frames[ed.iframeElement.id];
      let contentEditable = frame.contentDocument.getElementById('tinymce');
      this._zone.run(() => {
        this.mention.keyHandler(e, contentEditable);
      });
    });
  }
}
