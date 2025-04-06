import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSanctionedEntityComponent } from './create-sanctioned-entity.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { SanctionedEntitiesService } from '../services/sanctioned-entities.service';

describe('CreateSanctionedEntityComponent', () => {
  let component: CreateSanctionedEntityComponent;
  let fixture: ComponentFixture<CreateSanctionedEntityComponent>;
  let dialogRefSpy: jasmine.SpyObj<
    MatDialogRef<CreateSanctionedEntityComponent>
  >;
  let mockEntityService: jasmine.SpyObj<SanctionedEntitiesService>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockEntityService = jasmine.createSpyObj('SanctionedEntitiesService', ['addSanctionedEntity']);

    await TestBed.configureTestingModule({
      declarations: [CreateSanctionedEntityComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: 'BASE_URL', useValue: 'http://localhost/api' },
        { provide: SanctionedEntitiesService, useValue: mockEntityService }, 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSanctionedEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    const form = component.sanctionEntityForm;
    expect(form).toBeDefined();
    expect(form.get('name')?.value).toBe('');
    expect(form.get('domicile')?.value).toBe('');
    expect(form.get('accepted')?.value).toBe(false);
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.sanctionEntityForm.setValue({
      name: '',
      domicile: '',
      accepted: false,
    });
    expect(component.sanctionEntityForm.invalid).toBeTrue();
  });

  it('should call dialogRef.close with form value on valid submit', () => {
    const mockEntity = {
      id: 'abc123',
      name: 'Test Entity',
      domicile: 'USA',
      accepted: true,
    };
 
    component.existingEntities = [];
    // Mock the addSanctionedEntity method to return an observable
    //const entityService = TestBed.inject(SanctionedEntitiesService);
    //spyOn(entityService, 'addSanctionedEntity').and.returnValue(of(mockEntity));
    mockEntityService.addSanctionedEntity.and.returnValue(of(mockEntity));

    component.sanctionEntityForm.patchValue(mockEntity);
    component.sanctionEntityForm.markAllAsTouched();
    fixture.detectChanges();

    component.onAddEntity();

    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });

  it('should not submit if form is invalid', () => {
    component.sanctionEntityForm.setValue({
      name: '',
      domicile: '',
      accepted: false,
    });

    component.onAddEntity();

    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should call dialogRef.close on cancel', () => {
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
