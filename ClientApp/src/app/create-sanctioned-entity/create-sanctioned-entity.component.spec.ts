import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSanctionedEntityComponent } from './create-sanctioned-entity.component';

describe('CreateSanctionedEntityComponent', () => {
  let component: CreateSanctionedEntityComponent;
  let fixture: ComponentFixture<CreateSanctionedEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSanctionedEntityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSanctionedEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
