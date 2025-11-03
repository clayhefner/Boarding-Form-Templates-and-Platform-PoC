import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardingFormTemplatesComponent } from './boarding-form-templates.component';

describe('BoardingFormTemplatesComponent', () => {
  let component: BoardingFormTemplatesComponent;
  let fixture: ComponentFixture<BoardingFormTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardingFormTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardingFormTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
