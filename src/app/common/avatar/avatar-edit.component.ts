import {
    Component,
    Output,
    EventEmitter,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core'

@Component({
    selector: 'logi-avatar-edit',
    templateUrl: './avatar-edit.component.html',
    styleUrls: ['./avatar-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarEditComponent{
    @Input() accept = 'image'
    @Output() public readonly imgChange$ = new EventEmitter<string>()
    public onLoadImg(dataUrl: string): void {
        this.imgChange$.next(dataUrl)
    }

}
