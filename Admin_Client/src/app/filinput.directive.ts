/**
 * Created by laixiangran on 2016/8/15.
 * homepage：http://www.laixiangran.cn.
 */

import { Directive, ElementRef, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { HttpClient} from '@angular/common/http';

declare var jquery:any;
declare var $ :any;
@Directive({
    selector: '[eNgxFileUpload]',
    exportAs: 'eNgxFileUpload'
})
export class ENgxFileUploadDirective implements OnInit, OnDestroy {
    private el: HTMLElement;
    private $el: any;
   // files = {'id-0': 'file-name-1', 'id-1': 'file-name-2'};
     private defaultOpts: any = {
        language: 'ENG',
        showCaption: false,
        resizeImage: false,
        showUpload: false,
        showCancel: false,
        showRemove: false,
        previewFileType: "image",
        //url: "http://localhost:2001/api/profile/uploadprofilepicture",
        initialPreviewAsData: true,
       // uploadExtraData: {csrf_token_name: $("input[name=files]").val()},
        overwriteInitial: false,
        allowedPreviewTypes: ['image'],
        previewFileIconSettings: {
            'doc': '<i class="fa fa-file-word-o text-primary"></i>',
            'xls': '<i class="fa fa-file-excel-o text-success"></i>',
            'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
            'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
            'htm': '<i class="fa fa-file-code-o text-info"></i>',
            'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
            'mp3': '<i class="fa fa-file-audio-o text-warning"></i>',
            'txt': '<i class="fa fa-file-text text-info"></i>',
        },
        previewFileExtSettings: {
            'doc': function (ext) {
                return ext.match(/(doc|docx)$/i);
            },
            'xls': function (ext) {
                return ext.match(/(xls|xlsx)$/i);
            },
            'ppt': function (ext) {
                return ext.match(/(ppt|pptx)$/i);
            },
            'zip': function (ext) {
                return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
            },
            'htm': function (ext) {
                return ext.match(/(php|js|css|htm|html)$/i);
            },
            'txt': function (ext) {
                return ext.match(/(txt|ini|md)$/i);
            },
            'mov': function (ext) {
                return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
            },
            'mp3': function (ext) {
                return ext.match(/(mp3|wav)$/i);
            },
        }
    };

    @Input('eNgxFileUpload') fileInputOpts: any;

    @Output()
    ready: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    fileuploaded: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    fileuploaderror: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    filebatchuploadcomplete: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    filebatchuploaderror: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    filebatchuploadsuccess: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    changes: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    fileclear: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    filereset: EventEmitter<any> = new EventEmitter<any>(false);

    @Output()
    filepreupload: EventEmitter<any> = new EventEmitter<any>(false);

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
        this.$el = $(this.el);
    }

    ngOnInit() {
        this.$el['fileinput'](
            
            $.extend(true, {}, this.defaultOpts, this.fileInputOpts)
            //this.alert()
            );

        this.ready.emit(this);

        this.$el.on('fileuploaded', (event: any, data: any, previewId: any, index: any) => {
            this.fileuploaded.emit({
                event: event,
                data: data,
                previewId: previewId,
                index: index
            });
        });

        this.$el.on('fileuploaderror', (event: any, data: any, msg: any) => {
            this.fileuploaderror.emit({
                event: event,
                data: data,
                msg: msg
            });
        });

        this.$el.on('filebatchuploadcomplete', (event: any, data: any, previewId: any, index: any) => {
            this.filebatchuploadcomplete.emit({
                event: event,
                data: data,
                previewId: previewId,
                index: index
            });
        });

        this.$el.on('filebatchuploaderror', (event: any, data: any, msg: any) => {
            this.filebatchuploaderror.emit({
                event: event,
                data: data,
                msg: msg
            });
        });

        this.$el.on('filebatchuploadsuccess', (event: any, data: any, previewId: any, index: any) => {
            this.filebatchuploadsuccess.emit({
                event: event,
                data: data,
                previewId: previewId,
                index: index
            });
        });

        this.$el.on('change', (event: any) => {
            this.changes.emit(event);
        });

        this.$el.on('fileclear', (event: any) => {
            this.fileclear.emit(event);
        });

         this.$el.on('filereset', (event: any) => {
            this.filereset.emit(event);
        });

        this.$el.on('filepreupload', (event: any, data: any, previewId: any, index: any) => {
            this.filepreupload.emit({
                event: event,
                data: data,
                previewId: previewId,
                index: index
            });
        });
    }

    ngOnDestroy() {
        this.destroy();
    }

    disable() {
        this.$el['fileinput']('disable');
    }

    enable() {
        this.$el['fileinput']('enable');
    }

    reset() {
        this.$el['fileinput']('reset');
    }

    refresh() {
        this.$el['fileinput']('refresh');
    }

    clear() {
        this.$el['fileinput']('clear');
    }
    destroy() {
        this.$el['fileinput']('destroy');
    }

  
    public upload(files: Set<File>): {[key:string]:Observable<number>} {
        // this will be the our resulting map
        alert('hi');
        const status = {};
        console.log("sssh");
        files.forEach(file => {
          // create a new multipart-form for every file
          const formData: FormData = new FormData();
          console.log(formData);
          formData.append('file', file, file.name);
         
         
        });
        this.$el['fileinput']('upload');
        // return the map of progress.observables
        return status;
      }

    cancel() {
        this.$el['fileinput']('cancel');
    }
}
