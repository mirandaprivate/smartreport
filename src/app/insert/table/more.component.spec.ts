import {ComponentFixture, TestBed} from '@angular/core/testing'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'

import {TextMoreComponent, MoreData} from './more.component'

describe('AComponent', () => {
    let component: TextMoreComponent
    let fixture: ComponentFixture<TextMoreComponent>

    beforeEach(async () => {
        const data: MoreData = {
            date: '2020-01-01',
            text: `${'1'.repeat(100)}\n${'2'.repeat(100)}\n${'3'.repeat(100)}`,
        }
        await TestBed
            .configureTestingModule({
                declarations: [TextMoreComponent],
                imports: [MatDialogModule],
                providers: [
                    {
                        provide: MAT_DIALOG_DATA,
                        useValue: data,
                    },
                    {
                        provide: MatDialogRef,
                        useValue: {},
                    },
                ],
            })
            .compileComponents()
    })

    beforeEach(() => {
        fixture = TestBed.createComponent(TextMoreComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component.texts.length).toBe(3)
    })
})
