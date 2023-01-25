import {DebugElement} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {By} from '@angular/platform-browser'

import {FileUploaderComponent} from './component'

// tslint:disable-next-line: max-func-body-length
describe('FileUploader component test: ', (): void => {
    let fixture: ComponentFixture<FileUploaderComponent>
    let component: FileUploaderComponent
    let input: DebugElement

    beforeEach((): void => {
        TestBed.configureTestingModule({
            declarations: [FileUploaderComponent],
            imports: [MatSnackBarModule],
        })
        fixture = TestBed.createComponent(FileUploaderComponent)
        component = fixture.componentInstance
        input = fixture.debugElement.query(By.css('.file-input'))
    })

    it('input element should not display', (): void => {
        expect(component).toBeDefined()
        expect(input).toBeDefined()
        expect(input.styles.display).toBe('none')
    })

    it('click callback of input element should be called', (): void => {
        const selector = By.css('.upload-region')
        const uploadRegion = fixture.debugElement.query(selector).nativeElement
        expect(uploadRegion).toBeDefined()
        const inputEle: HTMLElement = input.nativeElement
        let isClick = false
        inputEle.addEventListener('click', (): void => {
            isClick = true
        })
        uploadRegion.dispatchEvent(new Event('click'))
        expect(isClick).toBe(true)
    })

    it('emit file after input file change', (): void => {
        let emitFile: File | undefined
        component.file$.subscribe((file: File): void => {
            emitFile = file
        })
        const mockFile = new File([''], 'test.png', {type: 'image/png'})
        const inputEle = input.nativeElement
        /**
         * Mock a FileList. See: https://stackoverflow.com/a/56447852
         */
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(mockFile)
        inputEle.files = dataTransfer.files
        input.triggerEventHandler('change', {target: inputEle})
        expect(emitFile).toBeDefined()
        expect(emitFile).toBe(mockFile)
    })
})
